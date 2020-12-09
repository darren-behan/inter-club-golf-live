const router = require('express').Router();
const userController = require('../../controllers/userController');

// Express then matches the final portion of the route to one of the below

// Matches with "/api/login/"
router.route('/')
  // POST request to login a USER
  .post(userController.loginUser);

module.exports = router;