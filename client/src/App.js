import React, { useEffect, useState } from 'react';
import './App.css';
import DataAreaContext from "./utils/DataAreaContext";
import API from './utils/API';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import Home from './pages/Home';
import Matches from './pages/Matches';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PageNotFound from './pages/PageNotFound';

function App() {
  // This is used to confirm the user is logged in and redirect them to the home page
  const [isAuthenticated, setIsAuthenticated] = useState( false );
  // This is used to create an object to capture the login details so we can send the data to the server, confirm the user and proceed to log them in
  const [loginDataObj, setLoginDataObj] = useState({});
  // This is used to store all matches in the database
  const [allMatches, setAllMatches] = useState( [] );

  useEffect(() => {
    const unsubscribe = loadMatches();

    return () => unsubscribe();
  }, []);

  async function loadMatches() {
    await trackPromise(
      API.getAllMatches()
      .then(res => {
        setAllMatches(res.data);
      })
      .catch(err => console.log(err))
    );
  }

  return (
    <>
      <DataAreaContext.Provider
      value={{ isAuthenticated, allMatches, loginDataObj, setIsAuthenticated, setLoginDataObj }}
      >
        <Router>
          <div>
            <Switch>
              <Route exact path={['/', '/home']} component={Home} />
              <Route exact path={['/matches']} component={Matches} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/signup' component={Signup} />
              <Route exact path='*' component={PageNotFound} />
            </Switch>
          </div>
        </Router>
      </DataAreaContext.Provider>
    </>
  );
}

export default App;