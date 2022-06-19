// Defining methods for the matchesController
const moment = require('moment-timezone');
const { db, admin } = require('../util/admin');

module.exports = {
  findAll(request, response) {
    db.collection('matches')
      .orderBy('createdAt', 'asc')
      .limit(100)
      .get()
      .then((data) => {
        let matches = [];
        data.forEach((doc) => {
          matches.push({
            matchId: doc.id,
            competitionName: doc.data().competitionName,
            competitionConcatRegion: doc.data().competitionConcatRegion,
            competitionRegion: doc.data().competitionRegion,
            competitionRegionArea: doc.data().competitionRegionArea,
            competitionCounty: doc.data().competitionCounty,
            competitionConcatCounty: doc.data().competitionConcatCounty,
            competitionRound: doc.data().competitionRound,
            matchDateTime: doc.data().matchDateTime,
            numIndividualMatches: doc.data().numIndividualMatches,
            teamOneName: doc.data().teamOneName,
            teamTwoName: doc.data().teamTwoName,
            teamOneScore: doc.data().teamOneScore,
            teamTwoScore: doc.data().teamTwoScore,
            neutralVenueName: doc.data().neutralVenueName,
            individualMatch: doc.data().individualMatch,
            createdByUid: doc.data().createdByUid,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
            matchStatus: doc.data().matchStatus,
            singlePlayer: doc.data().singlePlayer,
            collaborators: doc.data().collaborators,
          });
        });
        return response.status(200).json(matches);
      })
      .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
      });
  },
  getUserMatches(request, response) {
    const userId = request.params.userid;
    const isUserMatches = request.query.matchtype === 'userMatches' ? true : false;
    let matches = [];

    if (isUserMatches) {
      db.collection('matches')
        .where('createdByUid', '==', userId)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            matches.push({
              matchId: doc.id,
              competitionName: doc.data().competitionName,
              competitionConcatRegion: doc.data().competitionConcatRegion,
              competitionRegion: doc.data().competitionRegion,
              competitionRegionArea: doc.data().competitionRegionArea,
              competitionCounty: doc.data().competitionCounty,
              competitionConcatCounty: doc.data().competitionConcatCounty,
              competitionRound: doc.data().competitionRound,
              matchDateTime: doc.data().matchDateTime,
              numIndividualMatches: doc.data().numIndividualMatches,
              teamOneName: doc.data().teamOneName,
              teamTwoName: doc.data().teamTwoName,
              teamOneScore: doc.data().teamOneScore,
              teamTwoScore: doc.data().teamTwoScore,
              neutralVenueName: doc.data().neutralVenueName,
              individualMatch: doc.data().individualMatch,
              createdByUid: doc.data().createdByUid,
              createdAt: doc.data().createdAt,
              updatedAt: doc.data().updatedAt,
              matchStatus: doc.data().matchStatus,
              singlePlayer: doc.data().singlePlayer,
              collaborators: doc.data().collaborators,
            });
          });
          return response.status(200).json(matches);
        })
        .catch((err) => {
          console.error(err);
          return response.status(500).json({ error: err.code });
        });
    } else {
      db.collection('matches')
        .orderBy('createdAt', 'asc')
        .get()
        .then((data) => {
          data.forEach((doc) => {
            doc.data().collaborators.map((collaborator) => {
              if (collaborator.userId === userId) {
                matches.push({
                  matchId: doc.id,
                  competitionName: doc.data().competitionName,
                  competitionConcatRegion: doc.data().competitionConcatRegion,
                  competitionRegion: doc.data().competitionRegion,
                  competitionRegionArea: doc.data().competitionRegionArea,
                  competitionCounty: doc.data().competitionCounty,
                  competitionConcatCounty: doc.data().competitionConcatCounty,
                  competitionRound: doc.data().competitionRound,
                  matchDateTime: doc.data().matchDateTime,
                  numIndividualMatches: doc.data().numIndividualMatches,
                  teamOneName: doc.data().teamOneName,
                  teamTwoName: doc.data().teamTwoName,
                  teamOneScore: doc.data().teamOneScore,
                  teamTwoScore: doc.data().teamTwoScore,
                  neutralVenueName: doc.data().neutralVenueName,
                  individualMatch: doc.data().individualMatch,
                  createdByUid: doc.data().createdByUid,
                  createdAt: doc.data().createdAt,
                  updatedAt: doc.data().updatedAt,
                  matchStatus: doc.data().matchStatus,
                  singlePlayer: doc.data().singlePlayer,
                  collaborators: doc.data().collaborators,
                });
              }
            });
          });
          return response.status(200).json(matches);
        })
        .catch((err) => {
          console.error(err);
          return response.status(500).json({ error: err.code });
        });
    }
  },
  getMatch(request, response) {
    const matchId = request.params.matchId;
    db.collection('matches')
      .doc(matchId)
      .get()
      .then((data) => {
        let match = {
          matchId: data.id,
          competitionName: data.data().competitionName,
          competitionConcatRegion: data.data().competitionConcatRegion,
          competitionRegion: data.data().competitionRegion,
          competitionRegionArea: data.data().competitionRegionArea,
          competitionCounty: data.data().competitionCounty,
          competitionConcatCounty: data.data().competitionConcatCounty,
          competitionRound: data.data().competitionRound,
          matchDateTime: data.data().matchDateTime,
          numIndividualMatches: data.data().numIndividualMatches,
          teamOneName: data.data().teamOneName,
          teamTwoName: data.data().teamTwoName,
          teamOneScore: data.data().teamOneScore,
          teamTwoScore: data.data().teamTwoScore,
          neutralVenueName: data.data().neutralVenueName,
          individualMatch: data.data().individualMatch,
          createdByUid: data.data().createdByUid,
          createdAt: data.data().createdAt,
          updatedAt: data.data().updatedAt,
          matchStatus: data.data().matchStatus,
          singlePlayer: data.data().singlePlayer,
          collaborators: data.data().collaborators,
        };
        return response.status(200).json(match);
      })
      .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
      });
  },
  getMatchesByStatus(request, response) {
    const status = request.params.status;
    const todayStart = moment().startOf('day');
    const todayEnd = moment().endOf('day');
    let matches = [];
    if (status === 'complete') {
      db.collection('matches')
        .where('matchStatus', '==', status)
        .where('matchDateTime', '<=', todayEnd.toJSON())
        .get()
        .then((data) => {
          data.forEach((doc) => {
            matches.push({
              matchId: doc.id,
              competitionName: doc.data().competitionName,
              competitionConcatRegion: doc.data().competitionConcatRegion,
              competitionRegion: doc.data().competitionRegion,
              competitionRegionArea: doc.data().competitionRegionArea,
              competitionCounty: doc.data().competitionCounty,
              competitionConcatCounty: doc.data().competitionConcatCounty,
              competitionRound: doc.data().competitionRound,
              matchDateTime: doc.data().matchDateTime,
              numIndividualMatches: doc.data().numIndividualMatches,
              teamOneName: doc.data().teamOneName,
              teamTwoName: doc.data().teamTwoName,
              teamOneScore: doc.data().teamOneScore,
              teamTwoScore: doc.data().teamTwoScore,
              neutralVenueName: doc.data().neutralVenueName,
              individualMatch: doc.data().individualMatch,
              createdByUid: doc.data().createdByUid,
              createdAt: doc.data().createdAt,
              updatedAt: doc.data().updatedAt,
              matchStatus: doc.data().matchStatus,
              singlePlayer: doc.data().singlePlayer,
              collaborators: doc.data().collaborators,
            });
          });
          return response.status(200).json(matches);
        })
        .catch((err) => {
          console.error(err);
          return response.status(500).json({ error: err.code });
        });
    } else if (status === 'not started') {
      db.collection('matches')
        .where('matchStatus', '==', status)
        .where('matchDateTime', '>=', todayStart.toJSON())
        .get()
        .then((data) => {
          data.forEach((doc) => {
            matches.push({
              matchId: doc.id,
              competitionName: doc.data().competitionName,
              competitionConcatRegion: doc.data().competitionConcatRegion,
              competitionRegion: doc.data().competitionRegion,
              competitionRegionArea: doc.data().competitionRegionArea,
              competitionCounty: doc.data().competitionCounty,
              competitionConcatCounty: doc.data().competitionConcatCounty,
              competitionRound: doc.data().competitionRound,
              matchDateTime: doc.data().matchDateTime,
              numIndividualMatches: doc.data().numIndividualMatches,
              teamOneName: doc.data().teamOneName,
              teamTwoName: doc.data().teamTwoName,
              teamOneScore: doc.data().teamOneScore,
              teamTwoScore: doc.data().teamTwoScore,
              neutralVenueName: doc.data().neutralVenueName,
              individualMatch: doc.data().individualMatch,
              createdByUid: doc.data().createdByUid,
              createdAt: doc.data().createdAt,
              updatedAt: doc.data().updatedAt,
              matchStatus: doc.data().matchStatus,
              singlePlayer: doc.data().singlePlayer,
              collaborators: doc.data().collaborators,
            });
          });
          return response.status(200).json(matches);
        })
        .catch((err) => {
          console.error(err);
          return response.status(500).json({ error: err.code });
        });
    } else if (status === 'in progress') {
      db.collection('matches')
        .where('matchStatus', '==', status)
        .where('matchDateTime', '>=', todayStart.toJSON())
        .where('matchDateTime', '<=', todayEnd.toJSON())
        .get()
        .then((data) => {
          data.forEach((doc) => {
            matches.push({
              matchId: doc.id,
              competitionName: doc.data().competitionName,
              competitionConcatRegion: doc.data().competitionConcatRegion,
              competitionRegion: doc.data().competitionRegion,
              competitionRegionArea: doc.data().competitionRegionArea,
              competitionCounty: doc.data().competitionCounty,
              competitionConcatCounty: doc.data().competitionConcatCounty,
              competitionRound: doc.data().competitionRound,
              matchDateTime: doc.data().matchDateTime,
              numIndividualMatches: doc.data().numIndividualMatches,
              teamOneName: doc.data().teamOneName,
              teamTwoName: doc.data().teamTwoName,
              teamOneScore: doc.data().teamOneScore,
              teamTwoScore: doc.data().teamTwoScore,
              neutralVenueName: doc.data().neutralVenueName,
              individualMatch: doc.data().individualMatch,
              createdByUid: doc.data().createdByUid,
              createdAt: doc.data().createdAt,
              updatedAt: doc.data().updatedAt,
              matchStatus: doc.data().matchStatus,
              singlePlayer: doc.data().singlePlayer,
              collaborators: doc.data().collaborators,
            });
          });
          return response.status(200).json(matches);
        })
        .catch((err) => {
          console.error(err);
          return response.status(500).json({ error: err.code });
        });
    }
  },
  postMatch(request, response) {
    const newMatch = {
      matchDateTime: request.body.matchDateTime,
      competitionName: request.body.competitionName, // USER selection here will drive numIndividualMatches value
      competitionConcatRegion: request.body.competitionConcatRegion,
      competitionRegion: request.body.competitionRegion,
      competitionRegionArea: request.body.competitionRegionArea,
      competitionCounty: request.body.competitionCounty,
      competitionConcatCounty: request.body.competitionConcatCounty,
      competitionRound: request.body.competitionRound,
      numIndividualMatches: request.body.numIndividualMatches,
      teamOneName: request.body.teamOneName,
      teamTwoName: request.body.teamTwoName,
      teamOneScore: calculateMatchScoreOnPost(request.body.numIndividualMatches),
      teamTwoScore: calculateMatchScoreOnPost(request.body.numIndividualMatches),
      neutralVenueName: request.body.neutralVenueName,
      individualMatch: calculateMatchStatus(
        request.body.matchDateTime,
        request.body.createdAt,
        request.body.timeZone,
        request.body.individualMatch,
      ),
      createdByUid: request.body.uid,
      createdAt: request.body.createdAt,
      updatedAt: request.body.updatedAt,
      timeZone: request.body.timeZone,
      matchStatus: calculateMatchStatus(
        request.body.matchDateTime,
        request.body.createdAt,
        request.body.timeZone,
        null,
      ),
      singlePlayer: request.body.singlePlayer,
      collaborators: request.body.collaborators,
    };

    let document = addMatch(newMatch);
    document
      .then((doc) => {
        const matches = {
          matchId: doc.id,
          competitionName: doc.data().competitionName,
          competitionConcatRegion: doc.data().competitionConcatRegion,
          competitionRegion: doc.data().competitionRegion,
          competitionRegionArea: doc.data().competitionRegionArea,
          competitionCounty: doc.data().competitionCounty,
          competitionConcatCounty: doc.data().competitionConcatCounty,
          competitionRound: doc.data().competitionRound,
          matchDateTime: doc.data().matchDateTime,
          numIndividualMatches: doc.data().numIndividualMatches,
          teamOneName: doc.data().teamOneName,
          teamTwoName: doc.data().teamTwoName,
          teamOneScore: doc.data().teamOneScore,
          teamTwoScore: doc.data().teamTwoScore,
          neutralVenueName: doc.data().neutralVenueName,
          individualMatch: doc.data().individualMatch,
          createdByUid: doc.data().createdByUid,
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt,
          matchStatus: doc.data().matchStatus,
          singlePlayer: doc.data().singlePlayer,
          collaborators: doc.data().collaborators,
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
    db.collection('matches')
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
    document
      .update(request.body)
      .then((data) => {
        return response.status(200).json({ message: 'Updated successfully', match: request.body });
      })
      .catch((err) => {
        console.error(err);
        return response.status(400).json({
          error: err.code,
          message: err,
        });
      });
  },
};

async function addMatch(newMatch) {
  docRef = await db.collection('matches').add(newMatch);
  return await docRef.get();
}

const calculateMatchScoreOnPost = (value) => {
  return value / 2;
};

const calculateMatchStatus = (matchDateTime, createdAt, timeZone, individualMatches) => {
  var end_time = moment(matchDateTime).tz(timeZone).add(7, 'hours');
  // if createdAt date/time is between the match date/time & before 7 hours after the match date/time, return in progress
  if (moment(createdAt).isBetween(matchDateTime, end_time)) {
    if (individualMatches === null) {
      return 'in progress';
    } else {
      individualMatches.map((individualMatch) => {
        individualMatch.matchStatus = 'in progress';
      });
      return individualMatches;
    }
  } else if (moment(createdAt).isBefore(matchDateTime)) {
    // if createdAt date/time is before match date/time, return not started
    if (individualMatches === null) {
      return 'not started';
    } else {
      individualMatches.map((individualMatch) => {
        individualMatch.matchStatus = 'not started';
      });
      return individualMatches;
    }
  } else {
    // if createdAt date/time is 7 hours after date/time, return complete
    if (individualMatches === null) {
      return 'complete';
    } else {
      individualMatches.map((individualMatch) => {
        individualMatch.matchStatus = 'complete';
      });
      return individualMatches;
    }
  }
};
