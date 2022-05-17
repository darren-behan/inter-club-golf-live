import React, { useContext, useState, useEffect } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import UserAuthModal from '../components/Modals/UserAuthModal';
import Header from '../components/Header';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from 'firebase/compat/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { ShinyBlock, Space } from '../components/SkeletonBuildingBlocks/SkeletonBuildingBlocks';
import { isEmpty } from 'lodash';

const styles = makeStyles({
  paper: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: 1,
    backgroundColor: 'grey',
  },
  form: {
    width: '100%',
    marginTop: 1,
  },
  submit: {
    margin: 3,
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 10,
  },
  progess: {
    position: 'absolute',
  },
});

function Login() {
  let history = useHistory();
  const {
    isAuthenticated,
    setIsAuthenticated,
    loginDataObj,
    setLoginDataObj,
    setUserDataObj,
    setUserAuthResponse,
    setUserAuthModalShow,
    userAuthModalShow,
    form,
    setForm,
    setIsAuthenticating,
    isAuthenticating,
  } = useContext(DataAreaContext);
  const [loading, setLoading] = useState(false);
  const classes = styles();

  useEffect(() => {
    if (isAuthenticating.status !== 400 && isAuthenticating.authenticatingComplete !== true) authenticateUser();
  }, []);

  // useEffect is listening on load of page
  // If isAuthenticated changes to true, the user is navigated to the home page
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, [isAuthenticated]);

  const auth = getAuth();

  const authenticateUser = () => {
    setIsAuthenticating({ ...isAuthenticating, authenticatingInProgress: true });
    onAuthStateChanged(auth, (user) => {
      if (!isEmpty(user) && user.emailVerified) {
        setIsAuthenticating({
          ...isAuthenticating,
          authenticatingInProgress: false,
          authenticatingComplete: true,
          status: 200,
          message: 'completed authenticating',
        });
        setIsAuthenticated(true);
        setUserDataObj(user);
        LocalStorage.set('AuthToken', `Bearer ${user.stsTokenManager.accessToken}`);
      } else {
        setIsAuthenticating({
          ...isAuthenticating,
          authenticatingInProgress: false,
          authenticatingComplete: true,
          status: 400,
          message: 'Ooops, something went wrong.',
        });
        setIsAuthenticated(false);
        signOut(auth);
      }
    });
  };

  const LoadingDiv = () => {
    return (
      <>
        <div className="container px-3 py-5">
          <br />
          <br />
          <ShinyBlock height="1.5rem" />
          <Space height="1rem" />
          <ShinyBlock height="12rem" />
          <Space height="1rem" />
          <ShinyBlock height="12rem" />
          <Space height="1rem" />
        </div>
        <br />
      </>
    );
  };

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setLoginDataObj({ ...loginDataObj, [name]: value });
  };

  const actionCodeSettings = {
    url: 'https://inter-club-golf-live.web.app/login',
    handleCodeInApp: false,
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return firebase.auth().signInWithEmailAndPassword(loginDataObj.email, loginDataObj.password);
      })
      .then((response) => {
        if (response.user.emailVerified) {
          setIsAuthenticated(true);
          setUserDataObj(response.user);
          LocalStorage.set('AuthToken', `Bearer ${response.user.multiFactor.user.accessToken}`);
          setLoading(false);
        } else {
          response.user.sendEmailVerification(actionCodeSettings);
          setUserAuthResponse({
            message:
              'Your email is not verified. A verification email has been sent to your email address. Please verify your email to continue to login.',
            status: 200,
          });
          setLoginDataObj({});
          setLoading(false);
          setUserAuthModalShow(true);
        }
      })
      .catch((error) => {
        setUserAuthResponse({
          message: error.message,
          status: 400,
        });
        setLoading(false);
        setUserAuthModalShow(true);
      });
  };

  const handleResetPasswordSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    firebase
      .auth()
      .sendPasswordResetEmail(loginDataObj.email, actionCodeSettings)
      .then(() => {
        setUserAuthResponse({
          message: 'A password reset email has been sent.',
          status: 200,
        });
        setLoading(false);
        setUserAuthModalShow(true);
      })
      .catch((error) => {
        setUserAuthResponse({
          message: error.message,
          status: 400,
        });
        setLoading(false);
        setUserAuthModalShow(true);
      });
  };

  return (
    <>
      <UserAuthModal show={userAuthModalShow} onHide={() => setUserAuthModalShow(false)} />
      <Header />
      {isAuthenticating.authenticatingComplete && !isAuthenticated ? (
        <>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              {form === true ? (
                <>
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
                  <form className={classes.form} noValidate>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email address"
                      name="email"
                      value={loginDataObj.email}
                      autoComplete="email"
                      onChange={handleInputChange}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      value={loginDataObj.password}
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={handleInputChange}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={(e) => handleLoginSubmit(e)}
                      disabled={loading || !loginDataObj.email || !loginDataObj.password}
                    >
                      Sign In
                      {loading && <CircularProgress size={30} className={classes.progess} />}
                    </Button>
                    <Grid container>
                      <Grid item>
                        <Link component={RouterLink} to="/signup" variant="body2">
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item>
                        <Link
                          onClick={() => {
                            setForm(false);
                          }}
                          variant="body2"
                        >
                          {'Forgot your password?'}
                        </Link>
                      </Grid>
                    </Grid>
                  </form>
                </>
              ) : (
                <>
                  <Typography component="h1" variant="h5">
                    Reset password
                  </Typography>
                  <form className={classes.form} noValidate>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email address"
                      name="email"
                      autoComplete="email"
                      onChange={handleInputChange}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={(e) => handleResetPasswordSubmit(e)}
                      disabled={loading || !loginDataObj.email}
                    >
                      Reset password
                      {loading && <CircularProgress size={30} className={classes.progess} />}
                    </Button>
                    <Grid container>
                      <Grid item>
                        <Link
                          onClick={() => {
                            setForm(true);
                          }}
                          variant="body2"
                        >
                          {'Sign in'}
                        </Link>
                      </Grid>
                    </Grid>
                  </form>
                </>
              )}
            </div>
          </Container>
        </>
      ) : !isAuthenticating.authenticatingComplete ? (
        <>
          <LoadingDiv />
        </>
      ) : isAuthenticating.authenticatingComplete && isAuthenticating.status === 400 ? (
        <>
          <div>
            <h2>{isAuthenticating.message}</h2>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Login;
