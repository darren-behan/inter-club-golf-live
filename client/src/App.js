import React, { useEffect, useState } from 'react';
import './App.css';
import DataAreaContext from "./utils/DataAreaContext";
import API from './utils/API';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import Home from './pages/Home';
import Matches from './pages/Matches';
import UserMatches from './pages/UserMatches';
import Match from './pages/Match';
import CreateMatch from './pages/CreateMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PageNotFound from './pages/PageNotFound';

function App() {
  // This is used to confirm the user is logged in and redirect them to the home page
  const [isAuthenticated, setIsAuthenticated] = useState( false );
  // This is used to create an object to capture the login details so we can send the data to the server, confirm the user and proceed to log them in
  const [loginDataObj, setLoginDataObj] = useState({});
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
  // This stores the boolean value when the update button has been clicked to show the delete modal
  const [updateModalShow, setUpdateModalShow] = useState(false);
  // This stores the server response on updating a match which is used to be shown to the user
  const [updateResponse, setUpdateResponse] = useState({});

  useEffect(() => {
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

  console.log(appMatchesOnLoad);

  return (
    <>
      <DataAreaContext.Provider
      value={{ isAuthenticated, appMatchesOnLoad, loginDataObj, postMatchObj, show, filterValue, userDataObj, match, deleteModalShow, deleteResponse, timeZone, updateModalShow, updateResponse, updateMatchObj, setUpdateMatchObj, setUpdateResponse, setUpdateModalShow, setDeleteResponse, setDeleteModalShow, setMatchObj, setIsAuthenticated, setAppMatchesOnLoad, setLoginDataObj, setPostMatchObj, setShow, setFilterValue, setUserDataObj }}
      >
        <Router>
          <div>
            <Switch>
              <Route exact path={'/'} component={Home} />
              <Route exact path={'/matches'} component={Matches} />
              <Route exact path={'/match/:id'} component={Match} />
              <Route exact path={'/usermatches/:id'}>
                {!isAuthenticated ? <Redirect to="/login" /> : <UserMatches />}
              </Route>
              <Route exact path={'/creatematch'} component={CreateMatch} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/signup' component={Signup} />
              <Route exact path='/profile' component={Profile} />
              <Route exact path='/settings' component={Settings} />
              <Route exact path='*' component={PageNotFound} />
            </Switch>
          </div>
        </Router>
      </DataAreaContext.Provider>
    </>
  );
}

export default App;