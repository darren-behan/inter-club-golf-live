import React, { useContext, useEffect } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import Header from '../components/Header';
import Container from '@material-ui/core/Container';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
let isEmpty = require('lodash.isempty');

function PageNotFound() {
  const { setIsAuthenticating, isAuthenticating, setIsAuthenticated, setUserDataObj } = useContext(DataAreaContext);

  const auth = getAuth();

  useEffect(() => {
    authenticateUser();
  }, []);

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
        signOut();
      }
    });
  };

  return (
    <>
      <Header />
      <Container component="main" maxWidth="xs">
        <div>
          <h2>Page Not Found</h2>
        </div>
      </Container>
    </>
  );
}

export default PageNotFound;
