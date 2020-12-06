const functions = require('firebase-functions');
const express = require('express');
const routes = require('./routes');

// Sets up the Express App
const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express navigates to the routes folder and uses the index file
app.use(routes);

exports.api = functions.https.onRequest(app);
