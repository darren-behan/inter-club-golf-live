import React, { useEffect, useState } from 'react';
import './App.css';
import DataAreaContext from "./utils/DataAreaContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Home from './pages/Home';
import login from './pages/login';
import Signup from './pages/Signup';
import PageNotFound from './pages/PageNotFound';

function App() {
  // This is used to confirm the user is logged in and redirect them to the home page
  const [isAuthenticated, setIsAuthenticated] = useState( false );

  return (
    <DataAreaContext.Provider
    value={{ isAuthenticated, setIsAuthenticated }}
    >
      <Router>
        <div>
          <Switch>
            <Route exact path={['/', '/home']} component={Home} />
            <Route exact path='/login' component={login} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='*' component={PageNotFound} />
          </Switch>
        </div>
      </Router>
    </DataAreaContext.Provider>
  );
}

export default App;