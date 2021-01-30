// Defining methods for the matchesController
const moment = require('moment');
const { db } = require('../util/admin');

module.exports = {
  findAll(request, response) {
      db
      .collection('matches')
      // .where('username', '==', request.user.username)
      .orderBy('createdAt', 'desc')
      .get()
      .then((data) => {
        let matches = [];
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
            createdBy: doc.data().createdBy,
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
      username: request.user.username,
      competitionName: request.body[0].competitionName, // USER selection here will drive numIndividualMatches value
      numIndividualMatches: request.body[0].numIndividualMatches,
      teamOneName: request.body[0].teamOneName,
      teamTwoName: request.body[0].teamTwoName,
      teamOneScore: calculateMatchScoreOnPost(request.body[0].numIndividualMatches),
      teamTwoScore: calculateMatchScoreOnPost(request.body[0].numIndividualMatches),
      individualMatch: returnIndividualMatchObject(request.body[0].numIndividualMatches, request.body[0].teamOneName, request.body[0].teamTwoName),
      createdBy: request.user.username,
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
    db
    .collection('matches')
    .doc(matchId)
    .get()
    .then((doc) => {
      if (doc.data().username !== request.user.username) {
        return response.status(403).json({
          error:"Unauthorized"
        })
      }
      return db.collection('matches').doc(matchId).delete();
    })
    .then(() => {
      return response.json({ message: 'Delete successfull' });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
  },
  updateMatch(request, response) {
    let document = db.collection('matches').doc(`${request.params.matchId}`);
    document.update(matchDataToUpdate(request.body))
    .then(()=> {
      return response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ 
        error: err.code 
      });
    });
  }
}

const calculateMatchScoreOnPost = (value) => {
  return value / 2;
}

const returnIndividualMatchObject = (numIndividualMatches, teamOneName, teamTwoName) => {
  if (numIndividualMatches === 5) {
    const arr = [1, 2, 3, 4, 5];
    return constructIndividualMatchObject(arr, teamOneName, teamTwoName);
  } else {
    return;
  }
}

const constructIndividualMatchObject = (arr, teamOneName, teamTwoName) => {
  const individualMatchScoreObj = {};
  for (let i = 0; i < arr.length; i++) {
    const key = "Match " + arr[i];
    individualMatchScoreObj[key] = {
      teamOneName: teamOneName,
      teamOneScore: 0,
      teamTwoName: teamTwoName,
      teamTwoScore: 0,
      holesPlayed: 0
    };
  }
  return individualMatchScoreObj
}

const matchDataToUpdate = (obj) => {
  let individualMatchObj = {};
  let teamOneOverallScore = 0;
  let teamTwoOverallScore = 0;
  for (let i in obj) {
    if (obj[i].teamOneScore === obj[i].teamTwoScore) {
      teamOneOverallScore += 0.5;
      teamTwoOverallScore += 0.5;
      individualMatchObj[i] = {
        teamOneName: obj[i].teamOneName,
        teamOneScore: 0,
        teamTwoName: obj[i].teamTwoName,
        teamTwoScore: 0,
        holesPlayed: obj[i].holesPlayed
      }
    } else if (obj[i].teamOneScore < obj[i].teamTwoScore) {
      teamTwoOverallScore += 1;
      individualMatchObj[i] = {
        teamOneName: obj[i].teamOneName,
        teamOneScore: 0,
        teamTwoName: obj[i].teamTwoName,
        teamTwoScore: obj[i].teamTwoScore,
        holesPlayed: obj[i].holesPlayed
      }
    } else if (obj[i].teamOneScore > obj[i].teamTwoScore) {
      teamOneOverallScore += 1;
      individualMatchObj[i] = {
        teamOneName: obj[i].teamOneName,
        teamOneScore: obj[i].teamOneScore,
        teamTwoName: obj[i].teamTwoName,
        teamTwoScore: 0,
        holesPlayed: obj[i].holesPlayed
      }
    }
    console.log(obj[i].teamOneName);
    console.log(obj[i].teamTwoName);
  }
  return {
    teamOneScore: teamOneOverallScore,
    teamTwoScore: teamTwoOverallScore,
    individualMatch: individualMatchObj
  }
}