import React, { useEffect, useContext, useState } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import { IsEmpty } from 'react-lodash';
import Lib from '../utils/Lib';
import API from '../utils/API';
import { useHistory, Link } from 'react-router-dom';
import { Navbar, Nav, Form, Button, Breadcrumb } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGolfBall, faUser } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cards from '../components/Cards';
import DeleteModal from '../components/Modals/DeleteModal';
import FiltersOffCanvas from '../components/FiltersOffCanvas';
import { ShinyBlock, Space } from '../components/SkeletonBuildingBlocks/SkeletonBuildingBlocks';
import { Container, Row, Col, Spinner, FloatingLabel } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { getAuth, updatePassword, onAuthStateChanged, signOut } from 'firebase/auth';
import ReauthenticateUserModal from '../components/Modals/ReauthenticateUserModal';

function Profile() {
  const {
    filterValue,
    setFilterValue,
    show,
    setUserDataObj,
    userDataObj,
    setIsAuthenticated,
    isAuthenticated,
    setIsAuthenticating,
    isAuthenticating,
    setDeleteModalShow,
    deleteModalShow,
    setIsShowTooltip,
    showFilters,
    sidebarOpen,
  } = useContext(DataAreaContext);
  const [userMatches, setUserMatches] = useState([]);
  const [componentToRender, setComponentToRender] = useState('myAccount');
  const [isLoading, setIsLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [setIsChangePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordResponse, setChangePasswordResponse] = useState({});
  const [reauthenticateUserModalShow, setReauthenticateUserModalShow] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(true);
  let history = useHistory();

  const auth = getAuth();
  const user = auth.currentUser;

  let sortedMatchesByMatchDateTime;
  let matchYears = [];

  useEffect(() => {
    if (isAuthenticating.status !== 400 && isAuthenticating.authenticatingComplete !== true) authenticateUser();
    getUserMatches(userDataObj.uid, 'userMatches');
  }, []);

  useEffect(() => {
    if (isAuthenticating.authenticatingComplete && isAuthenticating.status === 400) {
      history.push('/login');
    }
  }, [isAuthenticating]);

  useEffect(() => {
    if (showFilters) setIsShowTooltip(false);
    if (sidebarOpen) setIsShowTooltip(false);
  }, [showFilters, sidebarOpen]);

  const getUserMatches = async (userId, matchType) => {
    await API.getUserMatches(userId, matchType)
      .then((res) => {
        setUserMatches(res.data);
        setIsLoading(false);
        if (!isEmpty(res.data)) {
          setIsShowTooltip(true);
          setTimeout(() => {
            setIsShowTooltip(false);
          }, 4000);
        }
      })
      .catch((err) => console.log(err));
  };

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

  useEffect(() => {
    if (isEmpty(userMatches)) {
      return;
    }
    sortedMatchesByMatchDateTime = userMatches.sort(function (a, b) {
      return new Date(b.matchDateTime) - new Date(a.matchDateTime);
    });
  }, [userMatches]);

  useEffect(() => {
    setFilterValue({
      year: moment().format('YYYY'),
      region: '',
      round: '',
      golfClub: '',
    });
    setIsLoading(true);
    setUserMatches([]);
    setNewPassword({});
    setChangePasswordResponse({});

    if (Object.keys(userDataObj).length > 0) {
      if (componentToRender === 'userMatches') {
        getUserMatches(userDataObj.uid, 'userMatches');
      } else if (componentToRender === 'collaboratingMatches') {
        getUserMatches(userDataObj.uid, 'collaboratingMatches');
      }
    } else {
      sortedMatchesByMatchDateTime = [];
    }
  }, [componentToRender]);

  if (Object.keys(userDataObj).length > 0) {
    if (componentToRender === 'userMatches') {
      if (!isEmpty(userMatches)) {
        sortedMatchesByMatchDateTime = userMatches.sort(function (a, b) {
          return new Date(b.matchDateTime) - new Date(a.matchDateTime);
        });
      }
    } else if (componentToRender === 'collaboratingMatches') {
      if (!isEmpty(userMatches)) {
        sortedMatchesByMatchDateTime = userMatches.sort(function (a, b) {
          return new Date(b.matchDateTime) - new Date(a.matchDateTime);
        });
      }
    }
  } else {
    sortedMatchesByMatchDateTime = [];
  }

  const LoadingBlock = () => {
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

  const NoMatches = () => {
    return (
      <>
        <div style={{ textAlign: 'center' }}>
          <br />
          <br />
          <h5>Oops, something went wrong 🙁</h5>
        </div>
      </>
    );
  };

  const RenderMatchCards = () => {
    return (
      <>
        <Row>
          <BreadCrumb />
        </Row>
        <Row>
          <IsEmpty
            value={sortedMatchesByMatchDateTime}
            yes={() => <>{isLoading ? <LoadingDiv /> : <NoMatches />}</>}
            no={() => (
              <>
                {!isEmpty(sortedMatchesByMatchDateTime) ? (
                  <>
                    {sortedMatchesByMatchDateTime.map((match, i) => {
                      matchYears.push(moment(match.matchDateTime).format('YYYY'));

                      if (
                        !isEmpty(filterValue.year) &&
                        !isEmpty(filterValue.region) &&
                        !isEmpty(filterValue.round) &&
                        !isEmpty(filterValue.golfClub)
                      ) {
                        if (
                          moment(match.matchDateTime).format('YYYY') === filterValue.year &&
                          match.competitionConcatRegion === filterValue.region &&
                          match.competitionRound.round === filterValue.round &&
                          (match.teamOneName.toLowerCase() === filterValue.golfClub ||
                            match.teamTwoName.toLowerCase() === filterValue.golfClub)
                        ) {
                          return (
                            <>
                              <Col
                                lg={{ span: 4 }}
                                md={{ span: 12 }}
                                xs={{ span: 12 }}
                                className="mt-2 mb-3 px-0 user-match-col"
                              >
                                <Cards match={match} />
                              </Col>
                            </>
                          );
                        }
                      }

                      if (
                        (!isEmpty(filterValue.year) &&
                          !isEmpty(filterValue.region) &&
                          !isEmpty(filterValue.round) &&
                          isEmpty(filterValue.golfClub)) ||
                        (!isEmpty(filterValue.year) &&
                          !isEmpty(filterValue.region) &&
                          isEmpty(filterValue.round) &&
                          !isEmpty(filterValue.golfClub)) ||
                        (!isEmpty(filterValue.year) &&
                          isEmpty(filterValue.region) &&
                          !isEmpty(filterValue.round) &&
                          !isEmpty(filterValue.golfClub))
                      ) {
                        if (
                          (moment(match.matchDateTime).format('YYYY') === filterValue.year &&
                            match.competitionConcatRegion === filterValue.region &&
                            match.competitionRound.round === filterValue.round) ||
                          (moment(match.matchDateTime).format('YYYY') === filterValue.year &&
                            match.competitionConcatRegion === filterValue.region &&
                            (match.teamOneName.toLowerCase() === filterValue.golfClub ||
                              match.teamTwoName.toLowerCase() === filterValue.golfClub)) ||
                          (moment(match.matchDateTime).format('YYYY') === filterValue.year &&
                            match.competitionRound.round === filterValue.round &&
                            (match.teamOneName.toLowerCase() === filterValue.golfClub ||
                              match.teamTwoName.toLowerCase() === filterValue.golfClub))
                        ) {
                          return (
                            <>
                              <Col
                                lg={{ span: 4 }}
                                md={{ span: 12 }}
                                xs={{ span: 12 }}
                                className="mt-2 mb-3 px-0 user-match-col"
                              >
                                <Cards match={match} />
                              </Col>
                            </>
                          );
                        }
                      }

                      if (
                        (!isEmpty(filterValue.year) &&
                          !isEmpty(filterValue.region) &&
                          isEmpty(filterValue.round) &&
                          isEmpty(filterValue.golfClub)) ||
                        (!isEmpty(filterValue.year) &&
                          isEmpty(filterValue.region) &&
                          !isEmpty(filterValue.round) &&
                          isEmpty(filterValue.golfClub)) ||
                        (!isEmpty(filterValue.year) &&
                          isEmpty(filterValue.region) &&
                          isEmpty(filterValue.round) &&
                          !isEmpty(filterValue.golfClub))
                      ) {
                        if (
                          (moment(match.matchDateTime).format('YYYY') === filterValue.year &&
                            match.competitionConcatRegion === filterValue.region) ||
                          (moment(match.matchDateTime).format('YYYY') === filterValue.year &&
                            match.competitionRound.round === filterValue.round) ||
                          (moment(match.matchDateTime).format('YYYY') === filterValue.year &&
                            (match.teamOneName.toLowerCase() === filterValue.golfClub ||
                              match.teamTwoName.toLowerCase() === filterValue.golfClub))
                        ) {
                          return (
                            <>
                              <Col
                                lg={{ span: 4 }}
                                md={{ span: 12 }}
                                xs={{ span: 12 }}
                                className="mt-2 mb-3 px-0 user-match-col"
                              >
                                <Cards match={match} />
                              </Col>
                            </>
                          );
                        }
                      }

                      if (
                        (!isEmpty(filterValue.year) &&
                          isEmpty(filterValue.region) &&
                          isEmpty(filterValue.round) &&
                          isEmpty(filterValue.golfClub)) ||
                        (isEmpty(filterValue.year) &&
                          !isEmpty(filterValue.region) &&
                          isEmpty(filterValue.round) &&
                          isEmpty(filterValue.golfClub)) ||
                        (isEmpty(filterValue.year) &&
                          isEmpty(filterValue.region) &&
                          !isEmpty(filterValue.round) &&
                          isEmpty(filterValue.golfClub)) ||
                        (isEmpty(filterValue.year) &&
                          isEmpty(filterValue.region) &&
                          isEmpty(filterValue.round) &&
                          !isEmpty(filterValue.golfClub))
                      ) {
                        if (
                          moment(match.matchDateTime).format('YYYY') === filterValue.year ||
                          match.competitionConcatRegion === filterValue.region ||
                          match.competitionRound.round === filterValue.round ||
                          match.teamOneName.toLowerCase() === filterValue.golfClub ||
                          match.teamTwoName.toLowerCase() === filterValue.golfClub
                        ) {
                          return (
                            <>
                              <Col
                                lg={{ span: 4 }}
                                md={{ span: 12 }}
                                xs={{ span: 12 }}
                                className="mt-2 mb-3 px-0 user-match-col"
                              >
                                <Cards match={match} />
                              </Col>
                            </>
                          );
                        }
                      }

                      if (
                        isEmpty(filterValue.year) &&
                        isEmpty(filterValue.region) &&
                        isEmpty(filterValue.round) &&
                        isEmpty(filterValue.golfClub)
                      ) {
                        return (
                          <>
                            <Col
                              lg={{ span: 4 }}
                              md={{ span: 12 }}
                              xs={{ span: 12 }}
                              className="mt-2 mb-3 px-0 user-match-col"
                            >
                              <Cards match={match} />
                            </Col>
                          </>
                        );
                      }

                      if (i + 1 === sortedMatchesByMatchDateTime.length) {
                        if (!matchYears.includes(filterValue.year)) {
                          if (componentToRender === 'collaboratingMatches') {
                            return (
                              <div style={{ textAlign: 'center' }}>
                                <br />
                                <br />
                                <h5>You aren't a collaborator for any matches created for {filterValue.year} 🙁</h5>
                                <br />
                                <br />
                                <h6>
                                  Change the filter year to view matches where you could be a collaborator on in
                                  previous years
                                </h6>
                              </div>
                            );
                          } else {
                            return (
                              <div style={{ textAlign: 'center' }}>
                                <br />
                                <br />
                                <h5>You haven't created any matches for {filterValue.year} 🙁</h5>
                                <br />
                                <br />
                                <h6>Change the filter year to view matches you've created in previous years</h6>
                              </div>
                            );
                          }
                        }
                      }
                    })}
                  </>
                ) : (
                  <>
                    <NoMatches />
                  </>
                )}
              </>
            )}
          />
        </Row>
      </>
    );
  };

  const BreadCrumb = () => {
    return (
      <>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={'/'} style={{ color: '#0a66c2' }}>
              Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumbItem">
            <Link to={'/profile/' + userDataObj.uid} style={{ color: '#0a66c2' }}>
              Profile
            </Link>
          </Breadcrumb.Item>
          <>
            {componentToRender === 'myAccount' ? (
              <>
                <Breadcrumb.Item active>My account</Breadcrumb.Item>
              </>
            ) : componentToRender === 'userMatches' ? (
              <>
                <Breadcrumb.Item active>My matches</Breadcrumb.Item>
              </>
            ) : componentToRender === 'collaboratingMatches' ? (
              <>
                <Breadcrumb.Item active>Collaborating matches</Breadcrumb.Item>
              </>
            ) : null}
          </>
        </Breadcrumb>
      </>
    );
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    setChangePasswordResponse({});
    const { name, value } = event.target;
    setNewPassword({ ...newPassword, [name]: value });
  };

  const handleChangePasswordSubmit = (event) => {
    event.preventDefault();
    setChangePasswordLoading(true);
    updatePassword(user, newPassword.newPassword)
      .then((res) => {
        setNewPassword({ newPassword: '' });
        setChangePasswordResponse({
          message: "You're password has been changed successfully.",
          status: 200,
        });
        setChangePasswordLoading(false);
      })
      .catch((error) => {
        if (error.code === 400 || error.code === 'auth/requires-recent-login') {
          setReauthenticateUserModalShow(true);
          setChangePasswordLoading(false);
          setNewPassword({});
          return;
        }
        setNewPassword({});
        setChangePasswordResponse({
          message: error.message,
          status: 404,
        });
        setChangePasswordLoading(false);
      });
  };

  return (
    <>
      <ReauthenticateUserModal
        show={reauthenticateUserModalShow}
        onHide={() => setReauthenticateUserModalShow(false)}
        auth={auth}
        user={user}
        setReauthenticateUserModalShow={setReauthenticateUserModalShow}
        isPasswordReset={isPasswordReset}
      />
      <DeleteModal
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        isMatch={false}
        user={user}
        setReauthenticateUserModalShow={setReauthenticateUserModalShow}
        setIsPasswordReset={setIsPasswordReset}
      />
      <Header activeRender={componentToRender} />
      {isAuthenticated ? (
        <>
          <Container
            fluid
            className="profile-container d-flex flex-column px-0"
            style={{ boxShadow: '0 0 4px rgba(0,0,0,.1)' }}
          >
            <Row
              className={show ? 'mt-3 mx-0' : ''}
              style={{ backgroundColor: '#ffffff', boxShadow: '0 0 4px rgba(0,0,0,.1)', borderRadius: '.25rem' }}
            >
              <FiltersOffCanvas matches={sortedMatchesByMatchDateTime} />
            </Row>
            <Row className="flex-fill mx-0">
              <Col
                sm="12"
                md="3"
                lg="2"
                className="px-3"
                style={{ backgroundColor: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 4px' }}
              >
                <Row>
                  <Navbar collapseOnSelect expand="md" className="flex-md-column">
                    <Navbar.Brand>
                      {!isEmpty(userDataObj)
                        ? `Hi,${' '}
                        ${Lib.capitalize(
                          isEmpty(userDataObj.multiFactor)
                            ? userDataObj.displayName
                            : userDataObj.multiFactor.user.displayName,
                        )}`
                        : null}
                    </Navbar.Brand>
                    <Navbar.Toggle
                      aria-controls="basic-navbar-nav"
                      className="px-0"
                      style={{ fontSize: '1.4rem', padding: '0px!important' }}
                    />
                    <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="mb-0 flex-column" defaultActiveKey="myAccount">
                        <Nav.Item className="mx-0">
                          <Nav.Link
                            className="px-0 py-2 pr-md-0"
                            id="myAccount"
                            eventKey="myAccount"
                            onClick={() => setComponentToRender('myAccount')}
                          >
                            <FontAwesomeIcon icon={faUser} className="fa-lg" />
                            <span className="mb-0"> My account</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mx-0">
                          <Nav.Link
                            className="px-0 py-2 pr-md-0"
                            id="userMatches"
                            eventKey="userMatches"
                            onClick={() => setComponentToRender('userMatches')}
                          >
                            <FontAwesomeIcon icon={faGolfBall} className="fa-lg" />
                            <span className="mb-0"> My matches</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mx-0">
                          <Nav.Link
                            className="px-0 py-2 pr-md-0"
                            id="collaboratingMatches"
                            eventKey="collaboratingMatches"
                            onClick={() => setComponentToRender('collaboratingMatches')}
                          >
                            <FontAwesomeIcon icon={faGolfBall} className="fa-lg" />
                            <span className="mb-0"> Collaborating matches</span>
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Navbar.Collapse>
                  </Navbar>
                </Row>
              </Col>
              <Col sm="12" md="9" lg="10" className="">
                <>
                  {componentToRender === 'myAccount' ? (
                    <>
                      <Row>
                        <Col style={{ paddingTop: '10px' }}>
                          <BreadCrumb />
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{ paddingTop: '10px' }}>
                          <>
                            <h6>Reset your password</h6>
                            <Form>
                              <div>
                                <Form.Group
                                  className="mb-2"
                                  controlId="formBasicPassword"
                                  style={{ marginBottom: '0px!important' }}
                                >
                                  <FloatingLabel controlId="floatingPassword" label="Enter new password">
                                    <Form.Control
                                      type="password"
                                      name="newPassword"
                                      placeholder="Change password"
                                      value={newPassword.newPassword}
                                      onChange={handleInputChange}
                                    />
                                  </FloatingLabel>
                                </Form.Group>
                                {changePasswordResponse.status === 200 ? (
                                  <div className="mb-2">
                                    <Form.Text id="passwordHelpBlock" style={{ color: '#50C878' }}>
                                      {changePasswordResponse.message}
                                    </Form.Text>
                                  </div>
                                ) : changePasswordResponse.status === 404 ? (
                                  <div className="mb-2">
                                    <Form.Text id="passwordHelpBlock" className="mb-2" style={{ color: '#EE4B2B' }}>
                                      {changePasswordResponse.message}
                                    </Form.Text>
                                  </div>
                                ) : null}
                              </div>
                              <div>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  type="submit"
                                  className="mb-2"
                                  onClick={(e) => handleChangePasswordSubmit(e)}
                                >
                                  {setIsChangePasswordLoading ? (
                                    <Spinner animation="border" style={{ color: '#0a66c2' }} />
                                  ) : (
                                    'Change password'
                                  )}
                                </Button>
                              </div>
                              <span class="border-bottom"></span>
                            </Form>
                          </>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{ paddingTop: '10px' }}>
                          <>
                            <h6>Delete your account</h6>
                            <div>
                              <Button
                                variant="danger"
                                size="sm"
                                className="mb-2"
                                onClick={() => setDeleteModalShow(true)}
                              >
                                Delete account
                              </Button>
                            </div>
                          </>
                        </Col>
                      </Row>
                    </>
                  ) : componentToRender === 'userMatches' ? (
                    <RenderMatchCards />
                  ) : componentToRender === 'collaboratingMatches' ? (
                    <RenderMatchCards />
                  ) : (
                    setComponentToRender('myAccount')
                  )}
                </>
              </Col>
            </Row>
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
      <Footer />
    </>
  );
}

export default Profile;
