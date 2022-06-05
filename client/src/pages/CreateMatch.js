import React, { useEffect, useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import { useHistory, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MatchForm from '../components/Forms/MatchForm';
import { Container, Breadcrumb } from 'react-bootstrap';
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
    if (isAuthenticating.status !== 400 && isAuthenticating.authenticatingComplete !== true) authenticateUser();
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
        signOut(auth);
      }
    });
  };

  const LoadingDiv = () => {
    return (
      <>
        <div className="py-2">
          <ShinyBlock height="1.5rem" width="40%" style={{ margin: '0% 56% 0% 4%' }} />
          <Space height="2rem" />
          <ShinyBlock height="1.5rem" width="40%" style={{ margin: '0% 50% 0% 10%' }} />
          <Space height="2.5rem" />
          <ShinyBlock height="2rem" width="80%" style={{ margin: '0% 10%' }} />
          <Space height="2.5rem" />
          <ShinyBlock height="2rem" width="80%" style={{ margin: '0% 10%' }} />
          <Space height="2.5rem" />
          <ShinyBlock height="2rem" width="80%" style={{ margin: '0% 10%' }} />
          <Space height="2.5rem" />
          <ShinyBlock height="2rem" width="80%" style={{ margin: '0% 10%' }} />
          <Space height="2.5rem" />
          <ShinyBlock height="2rem" width="80%" style={{ margin: '0% 10%' }} />
          <Space height="2.5rem" />
          <ShinyBlock height="2rem" width="80%" style={{ margin: '0% 10%' }} />
          <Space height="2.5rem" />
          <ShinyBlock height="2rem" width="80%" style={{ margin: '0% 10%' }} />
          <Space height="2.5rem" />
          <ShinyBlock height="2rem" width="80%" style={{ margin: '0% 10%' }} />
          <Space height="2.5rem" />
          <ShinyBlock height="2rem" width="80%" style={{ margin: '0% 10%' }} />
          <Space height="2.5rem" />
        </div>
      </>
    );
  };

  return (
    <>
      <Header />
      <Container className="px-0" style={{ marginBottom: '350px' }}>
        <div className="px-3" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={'/'} style={{ color: '#0a66c2' }}>
                Home
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Create a match</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {isAuthenticated ? (
          <>
            <MatchForm isUpdate={false} />
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
