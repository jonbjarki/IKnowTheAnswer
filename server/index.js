import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import indexRoutes from './routes/index.js';
import docRoutes from './docs/index.js';
import { addPlayerToMatchById, removePlayerFromMatchById, answerQuestion, startMatch } from './services/matchService.js';
import { setMatchTimer } from './services/timerService.js';

const port = process.env.PORT || 4567;
const app = express();
const httpServer = createServer(app);

app.use(express.json({
  limit: '50mb'
}));
app.use(cors({
  origin: [ 'http://localhost:3000' ],
  credentials: true
}));
app.use(session({
  secret: '8cee8454e55618a295c425892ec59370',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.authenticate('session'));
app.use(authRoutes);
app.use(indexRoutes);
app.use(docRoutes);
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    return res.status(500).send('A server error occurred.');
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    allowedHeaders: '*',
    credentials: true
  }
});

io.on('connection', socket => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('joinmatch', async (matchId, user) => {
    socket.join(matchId);
    const success = await addPlayerToMatchById(matchId, user);
    if (!success) { return; }
    io.to(matchId).emit('joinmatch', user);
  });

  socket.on('leavematch', async (matchId, user) => {
    await removePlayerFromMatchById(matchId, user);
    socket.leave(matchId);
    io.to(matchId).emit('leavematch', user);
  });

  socket.on('startmatch', async matchId => {
    await startMatch(matchId);
    await setMatchTimer(io, matchId);
    io.to(matchId).emit('startmatch');
  });

  socket.on('answer', async (match, user, answer, timer) => {
    await answerQuestion(match, user, answer, timer);
    io.to(match._id).emit('answer', user);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(port, () => console.log(`Listening on port ${port}`));