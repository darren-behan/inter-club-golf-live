// Defining methods for the matchesController
const moment = require('moment-timezone');
const { db, admin } = require('../util/admin');

const timeZoneDublin = "Europe/Dublin";

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
            matchDateTime: doc.data().matchDateTime,
            numIndividualMatches: doc.data().numIndividualMatches,
            teamOneName: doc.data().teamOneName,
            teamTwoName: doc.data().teamTwoName,
            teamOneScore: doc.data().teamOneScore,
            teamTwoScore: doc.data().teamTwoScore,
            individualMatch: doc.data().individualMatch,
            createdBy: doc.data().createdBy,
            createdByUid: doc.data().createdByUid,
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
  getMatch(request, response) {
    const matchId = request.params.matchId;
    db
    .collection('matches')
    .doc(matchId)
    .get()
    .then((data) => {
      let match = {
        matchId: data.id,
        competitionName: data.data().competitionName,
        matchDateTime: data.data().matchDateTime,
        numIndividualMatches: data.data().numIndividualMatches,
        teamOneName: data.data().teamOneName,
        teamTwoName: data.data().teamTwoName,
        teamOneScore: data.data().teamOneScore,
        teamTwoScore: data.data().teamTwoScore,
        individualMatch: data.data().individualMatch,
        createdBy: data.data().createdBy,
        createdByUid: data.data().createdByUid,
        createdAt: data.data().createdAt,
        updatedAt: data.data().updatedAt,
        matchStatus: data.data().matchStatus
      };
      return response.status(200).json(match);
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
      matchDateTime: request.body.matchDateTime,
      competitionName: request.body.competitionName, // USER selection here will drive numIndividualMatches value
      numIndividualMatches: request.body.numIndividualMatches,
      teamOneName: request.body.teamOneName,
      teamTwoName: request.body.teamTwoName,
      teamOneScore: calculateMatchScoreOnPost(request.body.numIndividualMatches),
      teamTwoScore: calculateMatchScoreOnPost(request.body.numIndividualMatches),
      individualMatch: returnIndividualMatchArr(request.body.numIndividualMatches, request.body.teamOneName, request.body.teamTwoName),
      createdBy: request.user.username,
      createdByUid: request.user.uid,
      createdAt: request.body.createdAt,
      updatedAt: request.body.updatedAt,
      timeZone: request.body.timeZone,
      matchStatus: calculateMatchStatus(request.body.matchDateTime, request.body.createdAt, request.body.timeZone)
    };

    let document = addMatch(newMatch);
    document
    .then(doc => {
      const matches = {
        matchId: doc.id,
        competitionName: doc.data().competitionName,
        matchDateTime: doc.data().matchDateTime,
        numIndividualMatches: doc.data().numIndividualMatches,
        teamOneName: doc.data().teamOneName,
        teamTwoName: doc.data().teamTwoName,
        teamOneScore: doc.data().teamOneScore,
        teamTwoScore: doc.data().teamTwoScore,
        individualMatch: doc.data().individualMatch,
        createdBy: doc.data().createdBy,
        createdByUid: doc.data().createdByUid,
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
      return response.status(200).json({ message: 'Delete successful' });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ message: err.code });
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
        holesPlayed: i.holesPlayed,
        homeMatch: i.homeMatch,
        id: i.id
      })
    } else if (i.teamOneScore < i.teamTwoScore) {
      teamTwoOverallScore += 1;
      individualMatchArr.push({
        teamOneName: i.teamOneName,
        teamOneScore: 0,
        teamTwoName: i.teamTwoName,
        teamTwoScore: i.teamTwoScore,
        holesPlayed: i.holesPlayed,
        homeMatch: i.homeMatch,
        id: i.id
      })
    } else if (i.teamOneScore > i.teamTwoScore) {
      teamOneOverallScore += 1;
      individualMatchArr.push({
        teamOneName: i.teamOneName,
        teamOneScore: i.teamOneScore,
        teamTwoName: i.teamTwoName,
        teamTwoScore: 0,
        holesPlayed: i.holesPlayed,
        homeMatch: i.homeMatch,
        id: i.id
      })
    }
  }
  return {
    teamOneScore: teamOneOverallScore,
    teamTwoScore: teamTwoOverallScore,
    individualMatch: individualMatchArr,
    // updatedAt: array.updatedAt,
  }
}

const calculateMatchStatus = (matchDateTime, createdAt, timeZone) => {
  var end_time = moment(matchDateTime).tz(timeZone).add(6, 'hours');

  // if createdAt date/time is between the match date/time & before 6 hours after the match date/time, return in progress 
  if (moment(createdAt).isBetween(matchDateTime, end_time)) {
    return "in progress";
  } else if (moment(createdAt).isBefore(matchDateTime)) {
    // if createdAt date/time is before match date/time, return not started
    return "not started";
  } else {
    // if createdAt date/time is 6 hours after date/time, return complete
    return "complete";
  }
}