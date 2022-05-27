const router = require('express').Router();
const matchesController = require('../../controllers/matchController');
const auth = require('../../util/auth');
const appCheck = require('../../util/appCheck');

// Express then matches the final portion of the route to one of the below

// Matches with "/api/match/"
router
  .route('/')
  // GET request to return all matches
  .get([appCheck], matchesController.findAll);

// Match with "/api/match/:matchId"
router
  .route('/:matchId')
  // GET request to return a match
  .get([appCheck], matchesController.getMatch);

// Match with "/api/match/status/:status"
router
  .route('/status/:status')
  // GET request to return matches by it's status in the last 30 days
  .get(matchesController.getMatchesByStatus);

// Matches with "/api/match/create"
router
  .route('/create')
  // POST request to create a match
  .post(auth, matchesController.postMatch);

router
  .route('/:matchId')
  // DELETE request to delete a match
  .delete(auth, matchesController.deleteMatch);

router
  .route('/:matchId')
  // UPDATE request to update a match
  .put(auth, matchesController.updateMatch);

router
  .route('/user/:userid')
  // GET request to get user matches
  .get(auth, matchesController.getUserMatches);

module.exports = router;
