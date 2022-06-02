// Defining methods for the matchesController
const moment = require('moment-timezone');
const { db, admin } = require('../util/admin');

module.exports = {
  getMatchesByCompetition(request, response) {
    const param = decodeURIComponent(request.params.competition);

    db.collection('matches')
      .where('competitionName', '==', param)
      .get()
      .then((data) => {
        let competitionMatches = [];
        data.forEach((doc) => {
          competitionMatches.push({
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
            collaborators: doc.data().collaborators,
          });
        });
        return response.status(200).json(competitionMatches);
      })
      .catch((err) => {
        console.error(err);
        return response.status(500).json(err);
      });
  },
};
