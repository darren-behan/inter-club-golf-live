// Defining methods for the matchesController
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
            homeTeamName: doc.data().homeTeamName,
            awayTeamName: doc.data().awayTeamName,
            numOfIndividualMatches: doc.data().numOfIndividualMatches,
            createdAt: doc.data().createdAt,
          });
        });
        console.log(matches);
        return response.json(matches);
      })
      .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code});
      });
  }
}