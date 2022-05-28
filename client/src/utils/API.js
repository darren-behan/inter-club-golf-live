import axios from 'axios';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL_DEV;

// In each function, we use axios to send our api route request to the server

const requests = {
  // Update user
  updateUser: function (userData) {
    return axios.post('/user/update', userData);
  },
  // Get users
  getUsers: function (userData, appCheckToken) {
    return axios.get('/user/getusers', {
      params: userData,
      headers: {
        'X-Firebase-AppCheck': appCheckToken,
      },
    });
  },
  // Returns all matches on app load
  getMatchesOnLoad: function (appCheckToken) {
    return axios.get('/match', {
      headers: {
        'X-Firebase-AppCheck': appCheckToken,
      },
    });
  },
  // Returns all matches for competition searched
  getMatchesByCompetitionOnLoad: function (competition, appCheckToken) {
    return axios.get('/competition/' + competition, {
      headers: {
        'X-Firebase-AppCheck': appCheckToken,
      },
    });
  },
  // Returns all matches for status searched
  getMatchesByStatus: function (status, appCheckToken) {
    return axios.get('/match/status/' + status, {
      headers: {
        'X-Firebase-AppCheck': appCheckToken,
      },
    });
  },
  // Returns match when loading a single match
  getMatch: function (matchId, appCheckToken) {
    return axios.get('/match/' + matchId, {
      headers: {
        'X-Firebase-AppCheck': appCheckToken,
      },
    });
  },
  // Posts a new match
  postMatch: function (matchData, appCheckToken) {
    const authToken = LocalStorage.get('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    return axios.post('/match/create', matchData, {
      headers: {
        'X-Firebase-AppCheck': appCheckToken,
      },
    });
  },
  // Deletes a match
  deleteMatch: function (matchId, appCheckToken) {
    const authToken = LocalStorage.get('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    return axios.delete('/match/' + matchId, {
      headers: {
        'X-Firebase-AppCheck': appCheckToken,
      },
    });
  },
  // Update a match
  updateMatch: function (matchData, appCheckToken) {
    const authToken = LocalStorage.get('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    return axios.put('/match/' + matchData.matchId, matchData, {
      headers: {
        'X-Firebase-AppCheck': appCheckToken,
      },
    });
  },
  // Get user matches
  getUserMatches: function (userId, matchType, appCheckToken) {
    const authToken = LocalStorage.get('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    return axios.get('/match/user/' + userId + '?matchtype=' + matchType, {
      headers: {
        'X-Firebase-AppCheck': appCheckToken,
      },
    });
  },
};

export default requests;
