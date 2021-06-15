const router = require('express').Router();
const matchesController = require('../../controllers/matchController');
const auth = require('../../util/auth');

// Express then matches the final portion of the route to one of the below

// Matches with "/api/match/"
router.route('/')
  // GET request to return all matches
  .get(matchesController.findAll);

// Match with "/api/match/:matchId"
router.route('/:matchId')
  // GET request to return a match
  .get(matchesController.getMatch);

// Matches with "/api/match/create"
router.route('/create')
  // POST request to create a match
  .post(auth, matchesController.postMatch);

router.route('/:matchId')
  // DELETE request to delete a match
  .delete(auth, matchesController.deleteMatch);

router.route('/:matchId')
  // UPDATE request to update a match
  .put(auth, matchesController.updateMatch);

module.exports = router;