import axios from 'axios';

// In each function, we use axios to send our api route request to the server

export default {
  // Logs in a user
  loginUser: function(userData) {
    // return axios.post('/api/user/login', userData);
    return axios.post('http://localhost:5000/inter-club-golf-live/us-central1/api/user/login', userData);
  },
  // Returns all matches
  getAllMatches: function() {
    // const authToken = localStorage.getItem('AuthToken');
		// axios.defaults.headers.common = { Authorization: `${authToken}` };
    return axios.get('http://localhost:5000/inter-club-golf-live/us-central1/api/match');
  }
};

// I need to fix this as it is calling the local URL where it should flow to index.js file in functions folder