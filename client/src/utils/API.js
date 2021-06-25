import axios from 'axios';

// In each function, we use axios to send our api route request to the server

const requests = {
  // Logs in a user
  loginUser: function(userData) {
    return axios.post('/user/login', userData);
  },
  // Returns all matches on app load
  getMatchesOnLoad: function() {
    return axios.get('/match');
  },
  // Returns match when loading a single match
  getMatch: function(matchId) {
    return axios.get('/match/' + matchId);
  },
  // Posts a new match
  postMatch: function(matchData) {
    const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
    return axios.post('/match/create', matchData);
  },
  // Deletes a match
  deleteMatch: function(matchId) {
    const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
    return axios.delete('/match/' + matchId);
  },
  // Update a match
  updateMatch: function(matchData) {
    const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
    return axios.put('/match/' + matchData.matchId, matchData);
  },
};

export default requests;
