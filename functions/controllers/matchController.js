// Defining methods for the matchesController
const moment = require('moment');
const { db } = require('../util/admin');

module.exports = {
  findAll(request, response) {
      db
      .collection('matches')
      .orderBy('createdAt', 'desc')
      .get()
      .then((data) => {
        let matches = [];
        console.log(data);
        data.forEach((doc) => {
          matches.push({
            matchId: doc.id,
            competitionName: doc.data().competitionName,
            numIndividualMatches: doc.data().numIndividualMatches,
            teamOneName: doc.data().homeTeamName,
            teamTwoName: doc.data().awayTeamName,
            teamOneScore: doc.data().teamOneScore,
            teamTwoScore: doc.data().teamTwoScore,
            individualMatch: doc.data().individualMatch,
            createdAt: doc.data().createdAt
          });
        });
        return response.json(matches);
      })
      .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code});
      });
  },
  postMatch(request, response) {
    if (request.body[0].teamOneName.trim() === "" || request.body[0].teamTwoName.trim() === "") {
      return response.status(400).json('Must not be empty');
    }

    const newMatch = {
      competitionName: request.body[0].competitionName, // USER selection here will drive numIndividualMatches value
      numIndividualMatches: request.body[0].numIndividualMatches,
      teamOneName: request.body[0].teamOneName,
      teamTwoName: request.body[0].teamTwoName,
      teamOneScore: calculateMatchScoreOnPost(request.body[0].numIndividualMatches),
      teamTwoScore: calculateMatchScoreOnPost(request.body[0].numIndividualMatches),
      individualMatch: returnIndividualMatchObject(request.body[0].numIndividualMatches, request.body[0].teamOneName, request.body[0].teamTwoName),
      createdAt: moment.utc()
    };

    db
    .collection('matches')
    .add(newMatch)
    .then((doc) => {
      const responseMatch = newMatch;
      responseMatch.id = doc.id;
      return response.json(responseMatch);
    })
    .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
  },
  deleteMatch(request, response) {
    const matchId = request.params.matchId;
    const res = db.collection('matches').doc(matchId).delete()
    .then(() => {
      response.json({ message: 'Delete successfull' });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
  }
}

const calculateMatchScoreOnPost = (value) => {
  return value / 2;
}

const returnIndividualMatchObject = (numIndividualMatches, teamOneName, teamTwoName) => {
  if (numIndividualMatches === 5) {
    const arr = [1, 2, 3, 4, 5];
    return returnIndividualMatchScoresObject(arr, teamOneName, teamTwoName);
  } else {
    return;
  }
}

const returnIndividualMatchScoresObject = (arr, teamOneName, teamTwoName) => {
  const individualMatchScoreObj = {};
  for (let i = 0; i < arr.length; i++) {
    const key = "Match " + arr[i];
    individualMatchScoreObj[key] = {
      [teamOneName]: 0,
      [teamTwoName]: 0
    };
  }
  return individualMatchScoreObj
}