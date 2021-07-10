const router = require('express').Router();
const userController = require('../../controllers/userController');
const auth = require('../../util/auth');

// Express then matches the final portion of the route to one of the below

// Matches with "/api/user/update/"
router.route('/update')
  // POST request to signup a USER
  .post(userController.updateUser);

module.exports = router;