import React, { useEffect, useState } from 'react';
import './App.css';
import DataAreaContext from "./utils/DataAreaContext";
import API from './utils/API';
import {
  BrowserRouter as Router,
  Switch,
  Route
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
  const [userDataObj, setUserDataObj] = useState({});
  // This is used to store all matches in the database
  const [allMatches, setAllMatches] = useState( [] );
  // This is used to store new match data to post in the database
  const [postMatchObj, setPostMatchObj] = useState({});
  // This is used to show the filters modal
  const [show, setShow] = useState(false);
  // This stores the value the user inputs to filter the results
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    async function loadMatches() {
      await API.getAllMatches()
        .then(res => {
          setAllMatches(res.data);
        })
        .catch(err => console.log(err));
    }
    loadMatches();
  }, []);

  console.log(allMatches);

  const resetFilterValues = () => {
    setFilterValue("");
  }

  return (
    <>
      <DataAreaContext.Provider
      value={{ isAuthenticated, allMatches, loginDataObj, postMatchObj, show, filterValue, userDataObj, setIsAuthenticated, setAllMatches, setLoginDataObj, setPostMatchObj, setShow, setFilterValue, setUserDataObj, resetFilterValues }}
      >
        <Router>
          <div>
            <Switch>
              <Route exact path={['/']} component={Home} />
              <Route exact path={['/matches']} component={Matches} />
              <Route exact path={['/usermatches/:id']} component={UserMatches} />
              <Route exact path={'/match/:id'} component={Match} />
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