import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PageNotFound from './pages/PageNotFound';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path={['/', '/home']} component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='*' component={PageNotFound} />
        </Switch>
      </Router>
    </>
  );
}

export default App;