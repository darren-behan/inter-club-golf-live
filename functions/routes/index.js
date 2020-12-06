// Dependencies
const router = require('express').Router();
const path = require('path');
const matchesRoute = require('./api/matches');

router.use('/matches', matchesRoute);

// If no API routes are hit, send the React app
router.use((req, res) => {
  res.sendFile(path.join(__dirname, '../../../client/build/index.html'));
});

module.exports = router;
