// Dependencies
const router = require('express').Router();
const path = require('path');
const matchesRoute = require('./api/match');
const userRoute = require('./api/user');

router.use('/match', matchesRoute);

router.use('/login', userRoute);

// If no API routes are hit, send the React app
router.use((req, res) => {
  res.sendFile(path.join(__dirname, '../../../client/build/index.html'));
});

module.exports = router;
