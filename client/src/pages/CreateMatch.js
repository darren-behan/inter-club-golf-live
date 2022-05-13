import React, { useEffect, useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostMatchForm from '../components/PostMatchForm';
import { Container } from 'react-bootstrap';
import { ShinyBlock, Space } from '../components/SkeletonBuildingBlocks/SkeletonBuildingBlocks';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { isEmpty } from 'lodash';

function CreateMatch() {
  const { setUserDataObj, setIsAuthenticated, isAuthenticated, setIsAuthenticating, isAuthenticating } = useContext(
    DataAreaContext,
  );
  let history = useHistory();

  const auth = getAuth();

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    if (isAuthenticating.authenticatingComplete && isAuthenticating.status === 400) {
      history.push('/login');
    }
  }, [isAuthenticating]);

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

  return (
    <>
      <Header />
      <Container style={{ marginBottom: '350px' }}>
        {isAuthenticated ? (
          <>
            <PostMatchForm />
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
      </Container>
      <Footer />
    </>
  );
}

export default CreateMatch;
