import { executeQuery } from '../db/index.js';
import { ObjectId } from 'mongodb';

export const getMatches = () => executeQuery(client => client.collection('matches').find({}).toArray());

export const getMatchById = id => executeQuery(client => client.collection('matches').findOne({
  _id: new ObjectId(id)
}));

export const addPlayerToMatchById = (matchId, player) => executeQuery(async client => {
  if (await client.collection('matches').findOne({
    _id: new ObjectId(matchId),
    "$or": [
      { 'players.username': player.username },
      {
        status: {
          "$ne": "not-started"
        }
      }
    ]
  })) {
    console.log('Either the match is not applicable for join, or he is already a part of the match');
    return false;
  }
  await client.collection('matches').updateOne({
    _id: new ObjectId(matchId)
  }, {
    "$push": {
      "players": player
    }
  });

  return true;
});

export const removePlayerFromMatchById = (matchId, player) => executeQuery(async client => {
  await client.collection('matches').updateOne({
    _id: new ObjectId(matchId)
  }, {
    $pull: {
      "players": {
        id: player.id
      }
    }
  })
});

export const createMatch = match => executeQuery(async client => {
  const res = await client.collection('matches').insertOne({
    ...match,
    answers: [],
    currentQuestion: 1,
    players: [],
    status: 'not-started'
  });
  return res.acknowledged;
});

export const startMatch = matchId => executeQuery(async client => {
  await client.collection('matches').updateOne({
    _id: new ObjectId(matchId)
  }, {
    $set: {
      status: 'started'
    }
  });
});

export const finishMatch = matchId => executeQuery(async client => {
  await client.collection('matches').updateOne({
    _id: new ObjectId(matchId)
  }, {
    $set: {
      status: 'finished'
    }
  })
});

export const updateToNextQuestion = (matchId) => executeQuery(async client => {
  const match = await client.collection('matches').findOne({
    _id: new ObjectId(matchId)
  });

  if (match.questions.length <= match.currentQuestion) {
    return false;
  }

  await client.collection('matches').updateOne({
    _id: new ObjectId(matchId)
  }, {
    $inc: {
      currentQuestion: 1
    }
  });

  return true;
});

export const answerQuestion = (match, user, answer, timer) => executeQuery(async client => {
  const currentMatch = await client.collection('matches').findOne({
    _id: new ObjectId(match._id)
  });

  if (currentMatch.answers.some(a => a.question === match.currentQuestion && a.user.id === user.id)) {
    console.log(`User ${user.username} has already answered the question!`);
    return;
  }
  
  await client.collection('matches').updateOne({
    _id: new ObjectId(match._id)
  }, {
    $push: {
      answers: {
        question: match.currentQuestion,
        user,
        answer,
        secondsLeft: timer
      }
    }
  })
});