// Defining methods for the matchesController
const moment = require('moment-timezone');
const { db } = require('../util/admin');

module.exports = {
  findAll(request, response) {
      db
      .collection('matches')
      .orderBy('createdAt', 'asc')
      .limit(100)
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
            updatedAt: doc.data().updatedAt,
            matchStatus: doc.data().matchStatus
          });
        });
        return response.status(200).json(matches);
      })
      .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code});
      });
  },
  postMatch(request, response) {
    if (request.body.teamOneName.trim() === "" || request.body.teamTwoName.trim() === "") {
      return response.status(400).json('Must not be empty');
    }

    const newMatch = {
      username: request.user.username,
      matchDate: request.body.matchDate,
      matchTime: request.body.matchTime,
      competitionName: request.body.competitionName, // USER selection here will drive numIndividualMatches value
      numIndividualMatches: request.body.numIndividualMatches,
      teamOneName: request.body.teamOneName,
      teamTwoName: request.body.teamTwoName,
      teamOneScore: calculateMatchScoreOnPost(request.body.numIndividualMatches),
      teamTwoScore: calculateMatchScoreOnPost(request.body.numIndividualMatches),
      individualMatch: returnIndividualMatchArr(request.body.numIndividualMatches, request.body.teamOneName, request.body.teamTwoName),
      createdBy: request.user.username,
      createdAt: moment().tz("Europe/Dublin").format(),
      updatedAt: moment().tz("Europe/Dublin").format(),
      matchStatus: calculateMatchStatus()
    };

    let document = addMatch(newMatch);
    document
    .then(doc => {
      const matches = {
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
        updatedAt: doc.data().updatedAt,
        matchStatus: doc.data().matchStatus
      };
      return response.status(200).json(matches);
    })
    .catch((err) => {
			console.error(err);
			return response.status(500).json({ error: 'Something went wrong' });
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

async function addMatch(newMatch) {
  docRef = await db.collection('matches').add(newMatch);
  return await docRef.get();
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
          'id': i + 1,
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
          'id': i + 1,
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
    updatedAt: moment().tz("Europe/Dublin").format()
  }
}

const calculateMatchStatus = () => {
  return "not started";
}