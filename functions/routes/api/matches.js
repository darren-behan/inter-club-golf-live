const router = require('express').Router();
const matchesController = require('../../controllers/matchesController');

// Express then matches the final portion of the route to one of the below

// Matches with "/api/matches/"
router.route('/')
  // GET request to return all matches
  .get(matchesController.findAll);

module.exports = router;