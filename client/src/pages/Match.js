import React, { useContext, useEffect } from 'react';
import API from '../utils/API';
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import Lib from '../utils/Lib';
import { Map } from 'react-lodash';
import { useParams, Link } from 'react-router-dom';
import { IsEmpty } from 'react-lodash';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DeleteModal from '../components/Modals/DeleteModal';
import UpdateModal from '../components/Modals/UpdateModal';
import AddCollaboratorsModal from '../components/Modals/AddCollaboratorsModal';
import { Container, Row, Table, Button, Breadcrumb } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ShinyBlock, Space } from '../components/SkeletonBuildingBlocks/SkeletonBuildingBlocks';
import Moment from 'react-moment';
import 'moment-timezone';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
const { getToken } = require('firebase/app-check');
let isEmpty = require('lodash.isempty');

function Match() {
  const {
    appCheck,
    match,
    setMatchObj,
    userDataObj,
    isAuthenticated,
    deleteModalShow,
    setDeleteModalShow,
    timeZone,
    updateModalShow,
    setUpdateModalShow,
    setUpdateMatchObj,
    addCollaboratorsModalShow,
    setAddCollaboratorsModalShow,
    setIsAuthenticating,
    isAuthenticating,
    setIsAuthenticated,
    setUserDataObj,
    setIsCompetitionByCountyFormat,
  } = useContext(DataAreaContext);
  let { id } = useParams();
  let individualMatches;
  let sortedIndividualMatches;
  const encodedURI = encodeURIComponent(match.competitionName);

  const auth = getAuth();

  useEffect(() => {
    if (isAuthenticating.status !== 400 && isAuthenticating.authenticatingComplete !== true) authenticateUser();
    if (!isEmpty(match)) {
      setUpdateMatchObj(JSON.parse(JSON.stringify({ ...match })));
    } else {
      getMatchOnLoad();
    }
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

  async function getMatchOnLoad() {
    let appCheckTokenResponse;
    try {
      appCheckTokenResponse = await getToken(appCheck, /* forceRefresh= */ false);
    } catch (err) {
      // Handle any errors if the token was not retrieved.
      console.log(JSON.stringify(err));
      return;
    }
    await API.getMatch(id, appCheckTokenResponse.token)
      .then((res) => {
        setMatchObj(res.data);
      })
      .catch((err) => console.log(err));
  }

  if (!isEmpty(match)) {
    individualMatches = match.individualMatch;
    sortedIndividualMatches = individualMatches.sort(function (a, b) {
      return a.individualMatchId - b.individualMatchId;
    });
  }

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
            <Breadcrumb.Item active>
              {Lib.capitalize(match.teamOneName)} v {Lib.capitalize(match.teamTwoName)}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </>
    );
  };

  const getScore = () => {
    if (match.teamOneScore > match.teamTwoScore) {
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          <span style={{ float: 'left' }}>
            <FontAwesomeIcon icon={faArrowLeft} className="fa-sm" />
          </span>
          {match.teamOneScore} - {match.teamTwoScore}
          <span style={{ float: 'right', color: '#0a66c2' }}>
            <FontAwesomeIcon icon={faArrowRight} className="fa-sm" />
          </span>
        </div>
      );
    } else if (match.teamOneScore < match.teamTwoScore) {
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          <span style={{ float: 'left', color: '#0a66c2' }}>
            <FontAwesomeIcon icon={faArrowLeft} className="fa-sm" />
          </span>
          {match.teamOneScore} - {match.teamTwoScore}
          <span style={{ float: 'right' }}>
            <FontAwesomeIcon icon={faArrowRight} className="fa-sm" />
          </span>
        </div>
      );
    } else {
      return <div style={{ color: '#ffffff', fontWeight: '900' }}>A/S</div>;
    }
  };

  const getIndividualMatchScore = (match) => {
    if (match.homeMatchScore > match.awayMatchScore) {
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          <span style={{ float: 'left' }}>
            <FontAwesomeIcon icon={faArrowLeft} className="fa-sm" />
          </span>
          {match.homeMatchScore} up
          <span style={{ float: 'right', color: '#0a66c2' }}>
            <FontAwesomeIcon icon={faArrowRight} className="fa-sm" />
          </span>
        </div>
      );
    } else if (match.homeMatchScore < match.awayMatchScore) {
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          <span style={{ float: 'left', color: '#0a66c2' }}>
            <FontAwesomeIcon icon={faArrowLeft} className="fa-sm" />
          </span>
          {match.awayMatchScore} up
          <span style={{ float: 'right' }}>
            <FontAwesomeIcon icon={faArrowRight} className="fa-sm" />
          </span>
        </div>
      );
    } else {
      return <div style={{ color: '#ffffff', fontWeight: '900' }}>A/S</div>;
    }
  };

  const getHomePlayerNames = (singleMatch) => {
    if (match.singlePlayer === true) {
      return singleMatch.homeMatchPlayerAName !== 'empty' ? (
        <p style={{ margin: '0px', alignItems: 'center', fontSize: '0.8rem' }}>
          {Lib.capitalize(singleMatch.homeMatchPlayerAName)}
        </p>
      ) : (
        <p style={{ margin: '0px', alignItems: 'center', fontSize: '0.8rem' }}>{Lib.capitalize(match.teamOneName)}</p>
      );
    } else {
      return singleMatch.homeMatchPlayerAName !== 'empty' && singleMatch.homeMatchPlayerBName !== 'empty' ? (
        <p style={{ margin: '0px', alignItems: 'center', fontSize: '0.8rem' }}>
          {Lib.capitalize(singleMatch.homeMatchPlayerAName)}
          <br />
          {Lib.capitalize(singleMatch.homeMatchPlayerBName)}
        </p>
      ) : (
        <p style={{ margin: '0px', alignItems: 'center', fontSize: '0.8rem' }}>{Lib.capitalize(match.teamOneName)}</p>
      );
    }
  };

  const getAwayPlayerNames = (singleMatch) => {
    if (match.singlePlayer === true) {
      return singleMatch.awayMatchPlayerAName !== 'empty' ? (
        <p style={{ margin: '0px', alignItems: 'center', fontSize: '0.8rem' }}>
          {Lib.capitalize(singleMatch.awayMatchPlayerAName)}
        </p>
      ) : (
        <p style={{ margin: '0px', alignItems: 'center', fontSize: '0.8rem' }}>{Lib.capitalize(match.teamTwoName)}</p>
      );
    } else {
      return singleMatch.awayMatchPlayerAName !== 'empty' && singleMatch.awayMatchPlayerBName !== 'empty' ? (
        <p style={{ margin: '0px', alignItems: 'center', fontSize: '0.8rem' }}>
          {Lib.capitalize(singleMatch.awayMatchPlayerAName)}
          <br />
          {Lib.capitalize(singleMatch.awayMatchPlayerBName)}
        </p>
      ) : (
        <p style={{ margin: '0px', alignItems: 'center', fontSize: '0.8rem' }}>{Lib.capitalize(match.teamTwoName)}</p>
      );
    }
  };

  return (
    <IsEmpty
      value={match}
      yes={() => (
        <Container fluid={true} style={{ padding: '0 0 70px 0' }}>
          <Header />
          <Container>
            <Row>
              <div>
                <br />
                <br />
                <ShinyBlock height="1.5rem" />
                <Space height="1rem" />
                <ShinyBlock height="12rem" />
                <Space height="1rem" />
                <ShinyBlock height="12rem" />
                <Space height="1rem" />
              </div>
            </Row>
          </Container>
        </Container>
      )}
      no={() => (
        <>
          <DeleteModal show={deleteModalShow} onHide={() => setDeleteModalShow(false)} isMatch={true} />
          <UpdateModal show={updateModalShow} onHide={() => setUpdateModalShow(false)} />
          <AddCollaboratorsModal show={addCollaboratorsModalShow} onHide={() => setAddCollaboratorsModalShow(false)} />
          <Header />
          <Container>
            <BreadCrumb />
            <Row style={{ marginTop: '10px' }}>
              <Table size="sm" className="caption-top" style={{ tableLayout: 'fixed' }}>
                <caption style={{ color: '#0a66c2', fontWeight: '900', textAlign: 'center' }}>Match Score</caption>
                <tbody>
                  <tr key={match.matchId}>
                    <td style={{ background: '#ffffff' }}>{Lib.capitalize(match.teamOneName)}</td>
                    <td style={{ background: '#0a66c2' }}>{getScore()}</td>
                    <td style={{ background: '#ffffff' }}>{Lib.capitalize(match.teamTwoName)}</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
            <Row>
              <div style={{ textAlign: 'left' }}>
                <h6>
                  Competition:&nbsp;
                  <Link to={'/competition/' + encodedURI}>
                    <span style={{ color: '#0a66c2' }}>{Lib.capitalize(match.competitionName)}</span>
                  </Link>
                </h6>
                <h6>
                  Competition Region:&nbsp;
                  <span style={{ color: '#0a66c2' }}>{Lib.capitalize(match.competitionConcatRegion)}</span>
                </h6>
                <>
                  {!isEmpty(match.competitionConcatCounty) ? (
                    <h6>
                      Competition County:&nbsp;
                      <span style={{ color: '#0a66c2' }}>{Lib.capitalize(match.competitionConcatCounty)}</span>
                    </h6>
                  ) : null}
                </>
                <h6>
                  Competition Round:&nbsp;
                  <span style={{ color: '#0a66c2' }}>{Lib.capitalize(match.competitionRound.round)}</span>
                </h6>
                <>
                  {isEmpty(match.neutralVenueName) ? (
                    <h6>
                      Home Team:&nbsp;<span style={{ color: '#0a66c2' }}>{Lib.capitalize(match.teamOneName)}</span>
                    </h6>
                  ) : match.matchStatus === 'complete' ? (
                    <h6>
                      Played at:&nbsp;<span style={{ color: '#0a66c2' }}>{Lib.capitalize(match.neutralVenueName)}</span>
                    </h6>
                  ) : (
                    <h6>
                      Playing at:&nbsp;
                      <span style={{ color: '#0a66c2' }}>{Lib.capitalize(match.neutralVenueName)}</span>
                    </h6>
                  )}
                </>
                <h6>
                  Match Status:&nbsp;<span style={{ color: '#0a66c2' }}>{Lib.capitalize(match.matchStatus)}</span>
                </h6>
                <h6>
                  Match Date:&nbsp;
                  <span style={{ color: '#0a66c2' }}>
                    <Moment tz={timeZone} format="DD/MM/YYYY">
                      {match.matchDateTime}
                    </Moment>
                  </span>
                </h6>
                <h6>
                  Tee Time:&nbsp;
                  <span style={{ color: '#0a66c2' }}>
                    <Moment tz={timeZone} format="HH:mm z">
                      {match.matchDateTime}
                    </Moment>
                  </span>
                </h6>
              </div>
            </Row>
            <br />
            <Row>
              <Table size="sm" className="caption-top" style={{ tableLayout: 'fixed' }}>
                <caption style={{ color: '#0a66c2', fontWeight: '900', textAlign: 'center' }}>
                  Individual Match Scores
                </caption>
                <thead>
                  <tr>
                    <th>{Lib.capitalize(match.teamOneName)}</th>
                    <th>Score</th>
                    <th>{Lib.capitalize(match.teamTwoName)}</th>
                  </tr>
                </thead>
                <tbody>
                  <Map
                    collection={sortedIndividualMatches}
                    iteratee={(singleMatch) => (
                      <>
                        <tr>
                          <td colSpan="3" style={{ background: '#ffffff', textAlign: 'left' }}>
                            {!isEmpty(match.neutralVenueName) ? (
                              <>Match {singleMatch.individualMatchId}</>
                            ) : parseInt(singleMatch.individualMatchId) <=
                              Math.ceil(parseInt(match.numIndividualMatches) / 2) ? (
                              <>
                                {Lib.capitalize(match.teamOneName)} match {singleMatch.individualMatchId}
                              </>
                            ) : (
                              <>
                                {Lib.capitalize(match.teamTwoName)} match{' '}
                                {parseInt(singleMatch.individualMatchId) -
                                  Math.ceil(parseInt(match.numIndividualMatches) / 2)}
                              </>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>{getHomePlayerNames(singleMatch)}</td>
                          <td style={{ background: '#0a66c2' }}>{getIndividualMatchScore(singleMatch)}</td>
                          <td>{getAwayPlayerNames(singleMatch)}</td>
                        </tr>
                        <tr>
                          <td colSpan="3">
                            Holes played{' '}
                            <span style={{ color: '#0a66c2', fontWeight: '500' }}>{singleMatch.holesPlayed}</span>
                          </td>
                        </tr>
                        <br />
                      </>
                    )}
                  />
                </tbody>
              </Table>
            </Row>
            {isAuthenticated ? (
              <>
                {match.createdByUid === userDataObj.uid ? (
                  <>
                    <Row className="d-grid gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        className="update-match"
                        onClick={() => setUpdateModalShow(true)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="add-match-collaborators"
                        onClick={() => setAddCollaboratorsModalShow(true)}
                      >
                        Add Collaborators
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="delete-match"
                        onClick={() => setDeleteModalShow(true)}
                      >
                        Delete
                      </Button>
                    </Row>
                    <br />
                  </>
                ) : match.hasOwnProperty('collaborators') && !isEmpty(match.collaborators) ? (
                  match.collaborators.map((collaborator) => {
                    if (collaborator.userId === userDataObj.uid) {
                      return (
                        <>
                          <Row className="d-grid gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              className="update-match"
                              onClick={() => setUpdateModalShow(true)}
                            >
                              Update
                            </Button>
                          </Row>
                          <br />
                        </>
                      );
                    }
                  })
                ) : null}
              </>
            ) : null}
            <Row>
              <h6>
                Last updated on&nbsp;
                <span style={{ color: '#0a66c2' }}>
                  <Moment tz={timeZone} format="DD/MM/YYYY">
                    {match.updatedAt}
                  </Moment>
                </span>
                &nbsp;at&nbsp;
                <span style={{ color: '#0a66c2' }}>
                  <Moment tz={timeZone} format="HH:mm">
                    {match.updatedAt}
                  </Moment>
                </span>
              </h6>
            </Row>
            <br />
          </Container>
          <Footer />
        </>
      )}
    />
  );
}

export default Match;
