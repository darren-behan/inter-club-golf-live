import axios from 'axios';

// In each function, we use axios to send our api route request to the server

export default {
  // Logs in a user
  loginUser: function(userData) {
    return axios.post('/user/login', userData);
  },
  // Returns all matches
  getAllMatches: function() {
    return axios.get('/match');
  },
  // Posts a new match
  postMatch: function(matchData) {
    const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
    return axios.post('/match/create', matchData);
  },
};
