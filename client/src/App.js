import React, { useEffect, useState } from 'react';
import './App.css';
import LocalStorage from './services/LocalStorage/LocalStorage.service';
import DataAreaContext from "./utils/DataAreaContext";
import API from './utils/API';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import Home from './pages/Home';
import Competition from './pages/Competitions';
import UserMatches from './pages/UserMatches';
import Match from './pages/Match';
import CreateMatch from './pages/CreateMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PageNotFound from './pages/PageNotFound';
import firebase from "firebase/app";
import "firebase/auth";

function App() {
  // This is used to confirm the user is logged in and redirect them to the home page
  const [isAuthenticated, setIsAuthenticated] = useState( false );
  // This is used to create an object to capture the login details so we can send the data to the server, confirm the user and proceed to log them in
  const [loginDataObj, setLoginDataObj] = useState({});
  // This is used to create an object to capture the user sign up details so we can send the data to the server, create the user, proceed to create their account
  const [signUpObj, setSignUpObj] = useState({});
  // This is used to store the data of the logged in user
  const [userDataObj, setUserDataObj] = useState({});
  // This is used to store all matches in the database
  const [appMatchesOnLoad, setAppMatchesOnLoad] = useState( [] );
  // This is used to store the match details when you want to view that specific match
  const [match, setMatchObj] = useState({});
  // This is used to store new match data to post in the database
  const [postMatchObj, setPostMatchObj] = useState({});
  // This is used to store match data to update in the database
  const [updateMatchObj, setUpdateMatchObj] = useState({});
  // This is used to show the filters modal
  const [show, setShow] = useState(false);
  // This stores the value the user inputs to filter the results
  const [filterValue, setFilterValue] = useState("");
  // This stores the boolean value when the delete button has been clicked to show the delete modal
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  // This stores the server response on deleting a match which is used to be shown to the user
  const [deleteResponse, setDeleteResponse] = useState({});
  // This will store the users timezone
  const [timeZone, setTimeZone] = useState("");
  // This stores the boolean value when the update button has been clicked to show the update modal
  const [updateModalShow, setUpdateModalShow] = useState(false);
  // This stores the server response on updating a match which is used to be shown to the user
  const [updateResponse, setUpdateResponse] = useState({});
  // This stores the request response when attempting to sign up and login
  const [userAuthResponse, setUserAuthResponse] = useState({});
  // This stores the boolean value to show & close the user auth modal for login & sign up purposes
  const [userAuthModalShow, setUserAuthModalShow] = useState(false);
  // This stores the request response when attempting to create a match
  const [createMatchResponse, setCreateMatchResponse] = useState({});
  // This stores the boolean value when a 400 response is received, it will set to true to show the sign up modal
  const [createMathModalShow, setCreateMatchModalShow] = useState(false);
  // This is to handle the opening and closing of the burger menu
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // This is used to dispaly the login form if true or reset password form if false
	const [form, setForm] = useState(true);

  useEffect(() => {
    authenticateUser();
    getAppMatchesOnLoad();
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  async function getAppMatchesOnLoad() {
    await API.getMatchesOnLoad()
      .then(res => {
        setAppMatchesOnLoad(res.data);
      })
      .catch(err => console.log(err));
  }

  function authenticateUser() {
    firebase.auth().onAuthStateChanged((response) => {
      if (response.emailVerified) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setIsAuthenticated(true);
        setUserDataObj(response);
        LocalStorage.set('AuthToken', `Bearer ${response.Aa}`);
      } else {
        // User is signed out
        firebase.auth().signOut();
      }
    });
  }

  return (
    <>
      <DataAreaContext.Provider
      value={{ isAuthenticated, appMatchesOnLoad, loginDataObj, postMatchObj, show, filterValue, userDataObj, match, deleteModalShow, deleteResponse, timeZone, updateModalShow, updateResponse, updateMatchObj, signUpObj, userAuthResponse, userAuthModalShow, createMatchResponse, createMathModalShow, sidebarOpen, form, setForm, setSidebarOpen, setCreateMatchModalShow, setCreateMatchResponse, setUserAuthModalShow, setUserAuthResponse, setSignUpObj, setUpdateMatchObj, setUpdateResponse, setUpdateModalShow, setDeleteResponse, setDeleteModalShow, setMatchObj, setIsAuthenticated, setAppMatchesOnLoad, setLoginDataObj, setPostMatchObj, setShow, setFilterValue, setUserDataObj }}
      >
        <Router>
          <div>
            <Switch>
              <Route exact path={'/'} component={Home} />
              <Route exact path={'/competition/:competition'} component={Competition} />
              <Route exact path={'/match/:id'} component={Match} />
              <Route exact path='/login' component={Login}>
                {isAuthenticated ? <Redirect to="/matches" /> : <UserMatches />}
              </Route>
              <Route exact path='/signup' component={Signup}>
                {isAuthenticated ? <Redirect to="/matches" /> : <UserMatches />}
              </Route>
              <Route exact path={'/usermatches/:id'}>
                {!isAuthenticated ? <Redirect to="/login" /> : <UserMatches />}
              </Route>
              <Route exact path={'/creatematch'}>
                {!isAuthenticated ? <Redirect to="/login" /> : <CreateMatch />}
              </Route>
              <Route exact path={'/profile'}>
                {!isAuthenticated ? <Redirect to="/login" /> : <Profile />}
              </Route>
              <Route exact path={'/settings'}>
                {!isAuthenticated ? <Redirect to="/login" /> : <Settings />}
              </Route>
              <Route exact path='*' component={PageNotFound} />
            </Switch>
          </div>
        </Router>
      </DataAreaContext.Provider>
    </>
  );
}

export default App;