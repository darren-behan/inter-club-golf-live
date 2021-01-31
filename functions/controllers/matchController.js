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
            matchDate: doc.data().matchDate,
            matchTime: doc.data().matchTime,
            numIndividualMatches: doc.data().numIndividualMatches,
            teamOneName: doc.data().teamOneName,
            teamTwoName: doc.data().teamTwoName,
            teamOneScore: doc.data().teamOneScore,
            teamTwoScore: doc.data().teamTwoScore,
            individualMatch: doc.data().individualMatch,
            createdBy: doc.data().createdBy,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt
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
      matchDate: request.body[0].matchDate,
      matchTime: request.body[0].matchTime,
      competitionName: request.body[0].competitionName, // USER selection here will drive numIndividualMatches value
      numIndividualMatches: request.body[0].numIndividualMatches,
      teamOneName: request.body[0].teamOneName,
      teamTwoName: request.body[0].teamTwoName,
      teamOneScore: calculateMatchScoreOnPost(request.body[0].numIndividualMatches),
      teamTwoScore: calculateMatchScoreOnPost(request.body[0].numIndividualMatches),
      individualMatch: returnIndividualMatchArr(request.body[0].numIndividualMatches, request.body[0].teamOneName, request.body[0].teamTwoName),
      createdBy: request.user.username,
      createdAt: moment().format("DD/MM/YY, HH:mm"),
      updatedAt: moment().format("DD/MM/YY, HH:mm")
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

const returnIndividualMatchArr = (numIndividualMatches, teamOneName, teamTwoName) => {
  if (numIndividualMatches === 5) {
    return constructIndividualMatchArr(numIndividualMatches, teamOneName, teamTwoName);
  } else if (numIndividualMatches === 9) {
    return constructIndividualMatchArr(numIndividualMatches, teamOneName, teamTwoName);
  } else {
    return;
  }
}

const constructIndividualMatchArr = (numIndividualMatches, teamOneName, teamTwoName) => {
  const individualMatchScoreArr = [];
  for (let i = 0; i < numIndividualMatches; i++) {
    if (i < Math.ceil(numIndividualMatches / 2)) {
      individualMatchScoreArr.push(
        {
          'teamOneName': teamOneName,
          'teamOneScore': 0,
          'teamTwoName': teamTwoName,
          'teamTwoScore': 0,
          'holesPlayed': 0,
          'homeMatch': true
        }
      )
    } else {
      individualMatchScoreArr.push(
        {
          'teamOneName': teamOneName,
          'teamOneScore': 0,
          'teamTwoName': teamTwoName,
          'teamTwoScore': 0,
          'holesPlayed': 0,
          'homeMatch': false
        }
      )
    }
  }
  return individualMatchScoreArr
}

const matchDataToUpdate = (array) => {
  let individualMatchArr = [];
  let teamOneOverallScore = 0;
  let teamTwoOverallScore = 0;
  for (const i of array) {
    if (i.teamOneScore === i.teamTwoScore) {
      teamOneOverallScore += 0.5;
      teamTwoOverallScore += 0.5;
      individualMatchArr.push({
        teamOneName: i.teamOneName,
        teamOneScore: 0,
        teamTwoName: i.teamTwoName,
        teamTwoScore: 0,
        holesPlayed: i.holesPlayed
      })
    } else if (i.teamOneScore < i.teamTwoScore) {
      teamTwoOverallScore += 1;
      individualMatchArr.push({
        teamOneName: i.teamOneName,
        teamOneScore: 0,
        teamTwoName: i.teamTwoName,
        teamTwoScore: i.teamTwoScore,
        holesPlayed: i.holesPlayed
      })
    } else if (i.teamOneScore > i.teamTwoScore) {
      teamOneOverallScore += 1;
      individualMatchArr.push({
        teamOneName: i.teamOneName,
        teamOneScore: i.teamOneScore,
        teamTwoName: i.teamTwoName,
        teamTwoScore: 0,
        holesPlayed: i.holesPlayed
      })
    }
  }
  return {
    teamOneScore: teamOneOverallScore,
    teamTwoScore: teamTwoOverallScore,
    individualMatch: individualMatchArr,
    updatedAt: moment().format("DD/MM/YY, HH:mm")
  }
}