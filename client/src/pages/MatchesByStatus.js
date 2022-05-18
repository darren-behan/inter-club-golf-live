import React, { useEffect, useContext, useState } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import Lib from '../utils/Lib';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import { IsEmpty } from 'react-lodash';
import API from '../utils/API';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cards from '../components/Cards';
import FiltersOffCanvas from '../components/FiltersOffCanvas';
import { ShinyBlock, Space } from '../components/SkeletonBuildingBlocks/SkeletonBuildingBlocks';
import { Container, Row, Col } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

function MatchesByStatus() {
  const {
    filterValue,
    setFilterValue,
    setUserDataObj,
    setIsAuthenticated,
    setIsAuthenticating,
    isAuthenticating,
  } = useContext(DataAreaContext);
  const [matchesByStatus, setMatchesByStatus] = useState([]);
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  let { status } = useParams();
  const matchesStatus = decodeURIComponent(status);

  let sortedMatchesByMatchDateTime;
  let matchYears = [];

  useEffect(() => {
    if (isAuthenticating.status !== 400 && isAuthenticating.authenticatingComplete !== true) authenticateUser();
    getMatchesByStatus();
    setFilterValue({
      year: moment().format('YYYY'),
      region: '',
      round: '',
      golfClub: '',
    });
  }, []);

  const getMatchesByStatus = async () => {
    await API.getMatchesByStatus(matchesStatus)
      .then((res) => {
        console.log(res.data);
        setMatchesByStatus(res.data);
        setIsLoading(false);
        setResponse({ code: 200 });
      })
      .catch((err) => console.log(err));
  };

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

  sortedMatchesByMatchDateTime = matchesByStatus.sort(function (a, b) {
    return new Date(b.matchDateTime) - new Date(a.matchDateTime);
  });

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
      <FiltersOffCanvas matches={sortedMatchesByMatchDateTime} />
      <Header />
      <Container>
        <div>
          <div style={{ marginTop: '25px', paddingTop: '15px', textAlign: 'center' }}>
            <>
              {matchesStatus === 'complete' ? (
                <>
                  <h4>{Lib.capitalize(matchesStatus)}d Matches within the last 30 days</h4>
                </>
              ) : matchesStatus === 'in progress' ? (
                <>
                  <h4>Matches {Lib.capitalize(matchesStatus)} today</h4>
                </>
              ) : matchesStatus === 'not started' ? (
                <>
                  <h4>Upcoming Matches in the next 30 days</h4>
                </>
              ) : (
                <NoMatches />
              )}
            </>
          </div>
          <IsEmpty
            value={sortedMatchesByMatchDateTime}
            yes={() => (
              <>
                {response.code === 200 ? (
                  <div style={{ textAlign: 'center' }}>
                    <br />
                    <br />
                    <>
                      {matchesStatus === 'complete' ? (
                        <>
                          <h5>There's been no matches {matchesStatus}d in the last 30 days 🙁</h5>
                        </>
                      ) : matchesStatus === 'in progress' ? (
                        <>
                          <h5>There are currently no matches {matchesStatus} 🙁</h5>
                        </>
                      ) : matchesStatus === 'not started' ? (
                        <>
                          <h5>There are currently no matches upcoming 🙁</h5>
                        </>
                      ) : (
                        <NoMatches />
                      )}
                    </>
                  </div>
                ) : (
                  <>
                    <div className="py-5">
                      <br />
                      <ShinyBlock height="1.5rem" />
                      <Space height="1rem" />
                      <ShinyBlock height="12rem" />
                      <Space height="1rem" />
                      <ShinyBlock height="12rem" />
                      <Space height="1rem" />
                      <br />
                    </div>
                  </>
                )}
              </>
            )}
            no={() => (
              <>
                <RenderMatchCards />
              </>
            )}
          />
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default MatchesByStatus;
