const functions = require('firebase-functions');
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

// Sets up the Express App
const app = require('express')();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://inter-club-golf-live.web.app");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next()
// });
app.use(cors());

// Express navigates to the routes folder and uses the index file
app.use(routes);

exports.api = functions.https.onRequest(app);