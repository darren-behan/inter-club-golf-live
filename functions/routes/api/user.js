const router = require('express').Router();
const userController = require('../../controllers/userController');
const auth = require('../../util/auth');
const appCheck = require('../../util/appCheck');

// Express then matches the final portion of the route to one of the below

// Matches with "/api/user/update/"
router
  .route('/update')
  // POST request to signup a USER
  .post([appCheck], userController.updateUser);

// Matches with "/api/user/getusers/"
router
  .route('/getusers')
  // GET request to get users collaborating on a match
  .get([appCheck], userController.getUsers);

module.exports = router;
