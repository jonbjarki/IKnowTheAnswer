import { updateToNextQuestion, finishMatch, getMatchById } from "./matchService.js";

export const setMatchTimer = async (io, matchId) => {
  await scheduleTimer(io, matchId, 10, 1);
};

const scheduleTimer = async (io, matchId, counter, currentQuestion) => {
  io.to(matchId).emit('updatetimer', counter);
  if (counter === 0) {
    const match = await getMatchById(matchId);
    io.to(matchId).emit('answers', match.answers.filter(a => a.question === currentQuestion).map(a => ({
      user: a.user,
      answer: a.answer      
    })));
    setTimeout(async () => {
      if (!(await updateToNextQuestion(matchId))) {
        // This was the last question, so it needs to be cancelled
        await finishMatch(matchId);
        io.to(matchId).emit('finishedgame', {
          ...match,
          status: 'finished'
        });
      } else {
        io.to(matchId).emit('nextquestion', currentQuestion + 1);
        setTimeout(scheduleTimer.bind(null, io, matchId, 10, currentQuestion + 1), 0);
      }
    }, 5000);
  } else {
    setTimeout(scheduleTimer.bind(null, io, matchId, counter - 1, currentQuestion), 1000);
  }
};