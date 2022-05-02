import React, { useEffect, useContext, useState } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import { IsEmpty } from 'react-lodash';
import Lib from '../utils/Lib';
import API from '../utils/API';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGolfBall, faUser } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cards from '../components/Cards';
import FiltersOffCanvas from '../components/FiltersOffCanvas';
import { ShinyBlock, Space } from '../components/SkeletonBuildingBlocks/SkeletonBuildingBlocks';
import { Container, Row, Col } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import moment from 'moment';

function Profile() {
  const { filterValue, setFilterValue, show, userDataObj } = useContext(DataAreaContext);
  const [userMatches, setUserMatches] = useState([]);
  const [componentToRender, setComponentToRender] = useState('userMatches');
  const [isLoading, setIsLoading] = useState(true);
  let sortedMatchesByMatchDateTime;
  let matchYears = [];

  useEffect(() => {
    getUserMatches(userDataObj.uid, 'userMatches');
    setFilterValue({
      year: '',
      region: '',
      round: '',
      golfClub: '',
    });
  }, []);

  async function getUserMatches(userId, matchType) {
    await API.getUserMatches(userId, matchType)
      .then((res) => {
        setUserMatches(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }

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
      year: '',
      region: '',
      round: '',
      golfClub: '',
    });
    setIsLoading(true);
    setUserMatches([]);

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
          <h5>There are no matches 🙁</h5>
        </div>
      </>
    );
  };

  const RenderMatchCards = () => {
    return (
      <>
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
                          return (
                            <div style={{ textAlign: 'center' }}>
                              <br />
                              <br />
                              <h5>You haven't created any matches for {filterValue.year} 🙁</h5>
                            </div>
                          );
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

  return (
    <>
      <Header activeRender={componentToRender} />
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
              <Navbar expand="md" className="flex-md-column">
                <Navbar.Brand>Hi, {Lib.capitalize(userDataObj.multiFactor.user.displayName)}</Navbar.Brand>
                <Navbar.Toggle
                  aria-controls="basic-navbar-nav"
                  className="px-0"
                  style={{ fontSize: '1.4rem', padding: '0px!important' }}
                />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mb-0 flex-column" defaultActiveKey="userMatches">
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
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </Row>
          </Col>
          <Col sm="12" md="9" lg="10" className="">
            <>
              {componentToRender === 'userMatches' ? (
                <RenderMatchCards />
              ) : componentToRender === 'collaboratingMatches' ? (
                <RenderMatchCards />
              ) : componentToRender === 'myAccount' ? (
                <>My Account</>
              ) : (
                setComponentToRender('userMatches')
              )}
            </>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Profile;
