const router = require('express').Router();
const competitionController = require('../../controllers/competitionController');

// Express then matches the final portion of the route to one of the below

// Match with "/api/competition/:competition"
router.route('/:competition')
  // GET request to return a match
  .get(competitionController.getMatchesByCompetition);

module.exports = router;