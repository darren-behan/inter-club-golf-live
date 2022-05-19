import React, { useContext, useEffect } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Breadcrumb } from 'react-bootstrap';
import Container from '@material-ui/core/Container';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
let isEmpty = require('lodash.isempty');

function PageNotFound() {
  const { setIsAuthenticating, isAuthenticating, setIsAuthenticated, setUserDataObj } = useContext(DataAreaContext);

  const auth = getAuth();

  useEffect(() => {
    if (isAuthenticating.status !== 400 && isAuthenticating.authenticatingComplete !== true) authenticateUser();
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
        signOut(auth);
      }
    });
  };

  const BreadCrumb = () => {
    return (
      <>
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={'/'} style={{ color: '#0a66c2' }}>
                Home
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Page not found</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </>
    );
  };

  return (
    <>
      <Header />
      <Container component="main" maxWidth="xs">
        <BreadCrumb />
        <div>
          <h2>Page not found</h2>
        </div>
      </Container>
    </>
  );
}

export default PageNotFound;
