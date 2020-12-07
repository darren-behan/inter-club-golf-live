const router = require('express').Router();
const matchesController = require('../../controllers/matchController');

// Express then matches the final portion of the route to one of the below

// Matches with "/api/match/"
router.route('/')
  // GET request to return all matches
  .get(matchesController.findAll);

// Matches with "/api/matches/create"
router.route('/create')
  // POST request to return all matches
  .post(matchesController.postMatch);

module.exports = router;