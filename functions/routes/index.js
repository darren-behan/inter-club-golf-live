// Dependencies
const router = require('express').Router();
const path = require('path');
const competitionRoute = require('./api/competition');
const matchesRoute = require('./api/match');
const userRoute = require('./api/user');

router.use('/match', matchesRoute);

router.use('/competition', competitionRoute);

router.use('/user', userRoute);

// If no API routes are hit, send the React app
router.use((req, res) => {
  res.sendFile(path.join(__dirname, '../../../client/build/index.html'));
});

module.exports = router;
