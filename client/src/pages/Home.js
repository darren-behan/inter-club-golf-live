import React, { useContext, useEffect } from 'react';
import API from '../utils/API';
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ComboBox from '../components/ComboBox';
import Slider from '../components/Slider';
import { Container, Row, Col } from 'react-bootstrap';
import { ShinyBlock, Space } from '../components/SkeletonBuildingBlocks/SkeletonBuildingBlocks';
import { IsEmpty } from 'react-lodash';
import { Link } from 'react-router-dom';
import AdSense from 'react-adsense';
import { isEmpty } from 'lodash';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
const { getToken } = require('firebase/app-check');

function Home() {
  const {
    appMatchesOnLoad,
    setAppMatchesOnLoad,
    setIsAuthenticating,
    isAuthenticating,
    setIsAuthenticated,
    setUserDataObj,
    appCheck,
    setIsCompetitionByCountyFormat,
  } = useContext(DataAreaContext);
  const RowStyles = {
    // height: "100vh",
    margin: 0,
  };
  let completedMatches = [];
  let inProgressMatches = [];
  let notStartedMatches = [];

  if (appMatchesOnLoad.length > 0) {
    appMatchesOnLoad.map((match) => {
      if (match.matchStatus === 'complete') {
        completedMatches.push(match);
      }

      if (match.matchStatus === 'in progress') {
        inProgressMatches.push(match);
      }

      if (match.matchStatus === 'not started') {
        notStartedMatches.push(match);
      }
    });
  }

  const auth = getAuth();

  useEffect(() => {
    getAppMatchesOnLoad();
    if (isAuthenticating.status !== 400 && isAuthenticating.authenticatingComplete !== true) authenticateUser();
    setIsCompetitionByCountyFormat(false);
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

  const getAppMatchesOnLoad = async () => {
    let appCheckTokenResponse;
    try {
      appCheckTokenResponse = await getToken(appCheck, /* forceRefresh= */ false);
    } catch (err) {
      console.log(JSON.stringify(err));
      return;
    }
    await API.getMatchesOnLoad(appCheckTokenResponse.token)
      .then((res) => {
        setAppMatchesOnLoad(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header />
      <Container className="px-0" style={{ height: '85vh' }}>
        <Row style={RowStyles}>
          <Col className="mt-4 px-0" xs={{ span: 12 }}>
            <p className="mx-3 mx-sm-0" style={{ fontSize: '2rem', fontWeight: '900' }}>
              Support your
              <br />
              club on the
              <br />
              inter club
              <br />
              stage
            </p>
            <p className="mx-3 mx-sm-0" style={{ fontSize: '1rem' }}>
              Know your clubs upcoming, in progress &amp; completed inter club matches across various golf tournaments.
            </p>
            <br />
            <div className="mx-3 mx-sm-0">
              <ComboBox />
            </div>
          </Col>
        </Row>
      </Container>
      {/* <Row className="ads-row mx-3">
      <AdSense.Google
        client={process.env.REACT_APP_GOOGLE_ADSENSE}
        slot='4238602370'
        style={{ display: 'block' }}
        format='auto'
        responsive='true'
        layoutKey='-gw-1+2a-9x+5c'
      />
    </Row> */}
      <IsEmpty
        value={appMatchesOnLoad}
        yes={() => (
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
        )}
        no={() => (
          <>
            <div className="container px-4 py-5">
              <h3>Completed</h3>
              {!isEmpty(completedMatches) ? (
                <>
                  <h6 style={{ color: '#0a66c2', fontWeight: '500' }}>
                    <Link to={'/matches/status/complete'} style={{ textDecoration: 'none' }}>
                      View more
                    </Link>
                  </h6>
                  <Slider matches={completedMatches} status="completed" />
                </>
              ) : (
                <div style={{ textAlign: 'left' }}>
                  <br />
                  <br />
                  <h5>There are no finalized matches</h5>
                </div>
              )}
            </div>
            <div className="container px-4 py-5">
              <h3>In Progress</h3>
              {!isEmpty(inProgressMatches) ? (
                <>
                  <h6 style={{ color: '#0a66c2', fontWeight: '500' }}>
                    <Link
                      to={'/matches/status/' + encodeURIComponent('in progress')}
                      style={{ textDecoration: 'none' }}
                    >
                      View more
                    </Link>
                  </h6>
                  <Slider matches={inProgressMatches} status="inProgress" />
                </>
              ) : (
                <div style={{ textAlign: 'left' }}>
                  <br />
                  <br />
                  <h5>There are currently no matches in progress</h5>
                </div>
              )}
            </div>
            <div className="container px-4 py-5">
              <h3>Upcoming Matches</h3>
              {!isEmpty(notStartedMatches) ? (
                <>
                  <h6 style={{ color: '#0a66c2', fontWeight: '500' }}>
                    <Link
                      to={'/matches/status/' + encodeURIComponent('not started')}
                      style={{ textDecoration: 'none' }}
                    >
                      View more
                    </Link>
                  </h6>
                  <Slider matches={notStartedMatches} status="notStarted" />
                </>
              ) : (
                <div style={{ textAlign: 'left' }}>
                  <br />
                  <br />
                  <h5>There are currently no upcoming matches</h5>
                </div>
              )}
            </div>
          </>
        )}
      />
      <Footer />
    </>
  );
}

export default Home;
