import React, { useContext, useEffect } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col } from 'react-bootstrap';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
let isEmpty = require('lodash.isempty');

function About() {
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

  return (
    <>
      <Header />
      <Container fluid>
        <Row style={{ textAlign: 'center', backgroundColor: '#0a66c2', color: '#ffffff' }}>
          <Col className="my-3">
            <h2>About us</h2>
          </Col>
        </Row>
        <Row className="mb-3" style={{ backgroundColor: '#ffffff' }}>
          <Col className="my-3" xs={{ span: 12 }}>
            <p style={{ fontSize: '1rem', fontWeight: '500' }}>About interclubgolfireland.ie</p>
          </Col>
          <Col xs={{ span: 12 }}>
            <p style={{ fontSize: '0.9rem' }}>
              At interclubgolfireland.ie our purpose is to provide a simple &amp; efficient platform for golf clubs to
              create visibility over their clubs inter club golf matches. Whether you’re a relative or friend of a
              player representing the golf club or even a club member, interclubgolfireland.ie is the place for people
              to unite, follow and share their passion for the sport of golf at the amateur level.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              <span style={{ fontWeight: '500', fontSize: '1rem' }}>About thecreativedream.ie:</span> At The Creative
              Dream, we're passionate about helping businesses build an online presence. With years experience working
              in fast paced digital companies, we have knowledge in helping to build long-term digital strategies. We
              work collaboratively to make your business dreams and visions come through. Creativity and drive for
              helping businesses is what we are most passionate about.
            </p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default About;
