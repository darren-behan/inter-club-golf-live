const router = require('express').Router();
const userController = require('../../controllers/userController');

// Express then matches the final portion of the route to one of the below

// Matches with "/api/user/login/"
router.route('/login')
  // POST request to login a USER
  .post(userController.loginUser);

// Matches with "/api/user/signup/"
router.route('/signup')
  // POST request to signup a USER
  .post(userController.signUpUser);

module.exports = router;