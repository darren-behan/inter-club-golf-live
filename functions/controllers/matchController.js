// Defining methods for the matchesController
const moment = require('moment-timezone');
const { db, admin } = require('../util/admin');

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
            competitionRegion: doc.data().competitionRegion,
            competitionRound: doc.data().competitionRound,
            matchDateTime: doc.data().matchDateTime,
            numIndividualMatches: doc.data().numIndividualMatches,
            teamOneName: doc.data().teamOneName,
            teamTwoName: doc.data().teamTwoName,
            teamOneScore: doc.data().teamOneScore,
            teamTwoScore: doc.data().teamTwoScore,
            individualMatch: doc.data().individualMatch,
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
        competitionRegion: data.data().competitionRegion,
        competitionRound: data.data().competitionRound,
        matchDateTime: data.data().matchDateTime,
        numIndividualMatches: data.data().numIndividualMatches,
        teamOneName: data.data().teamOneName,
        teamTwoName: data.data().teamTwoName,
        teamOneScore: data.data().teamOneScore,
        teamTwoScore: data.data().teamTwoScore,
        individualMatch: data.data().individualMatch,
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
    const newMatch = {
      matchDateTime: request.body.matchDateTime,
      competitionName: request.body.competitionName, // USER selection here will drive numIndividualMatches value
      competitionRegion: request.body.competitionRegion,
      competitionRound: request.body.competitionRound,
      numIndividualMatches: request.body.numIndividualMatches,
      teamOneName: request.body.teamOneName,
      teamTwoName: request.body.teamTwoName,
      teamOneScore: calculateMatchScoreOnPost(request.body.numIndividualMatches),
      teamTwoScore: calculateMatchScoreOnPost(request.body.numIndividualMatches),
      individualMatch: request.body.individualMatch,
      createdByUid: request.body.uid,
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
        competitionRegion: doc.data().competitionRegion,
        competitionRound: doc.data().competitionRound,
        matchDateTime: doc.data().matchDateTime,
        numIndividualMatches: doc.data().numIndividualMatches,
        teamOneName: doc.data().teamOneName,
        teamTwoName: doc.data().teamTwoName,
        teamOneScore: doc.data().teamOneScore,
        teamTwoScore: doc.data().teamTwoScore,
        individualMatch: doc.data().individualMatch,
        createdByUid: doc.data().createdByUid,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt,
        matchStatus: doc.data().matchStatus
      };
      return response.status(200).json(matches);
    })
    .catch((err) => {
			console.error(err);
			return response.status(400).json({ error: err.message });
		});
  },
  deleteMatch(request, response) {
    const matchId = request.params.matchId;
    db
    .collection('matches')
    .doc(matchId)
    .delete()
    .then(() => {
      return response.status(200).json({ message: 'Delete successful' });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ message: err.message });
    });
  },
  updateMatch(request, response) {
    let document = db.collection('matches').doc(`${request.params.matchId}`);
    document.update(request.body)
    .then(data => {
      return response.status(200).json({message: 'Updated successfully'});
    })
    .catch((err) => {
      console.error(err);
      return response.status(400).json({ 
        error: err.code,
        message: err
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
