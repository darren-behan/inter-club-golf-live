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
            homeTeamName: doc.data().homeTeamName,
            awayTeamName: doc.data().awayTeamName,
            numOfIndividualMatches: doc.data().numOfIndividualMatches,
            createdAt: doc.data().createdAt
          });
        });
        console.log(matches);
        return response.json(matches);
      })
      .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code});
      });
  },
  postMatch(request, response) {
    console.log(request.body[0]);
    if (request.body[0].homeTeamName.trim() === "" || request.body[0].awayTeamName.trim() === "") {
      return response.status(400).json('Must not be empty');
    }

    const newMatch = {
      homeTeamName: request.body[0].homeTeamName,
      awayTeamName: request.body[0].awayTeamName,
      numOfIndividualMatches: request.body[0].numOfIndividualMatches,
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
  }
}