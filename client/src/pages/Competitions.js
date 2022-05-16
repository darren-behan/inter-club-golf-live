import React, { useContext, useEffect, useState } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import API from '../utils/API';
import Lib from '../utils/Lib';
import { IsEmpty } from 'react-lodash';
import { isEmpty, orderBy } from 'lodash';
import { useParams, useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FiltersOffCanvas from '../components/FiltersOffCanvas';
import { Container, Row, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ShinyBlock, Space } from '../components/SkeletonBuildingBlocks/SkeletonBuildingBlocks';
import moment from 'moment';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

function Competition() {
  const {
    filterValue,
    setFilterValue,
    matchesByCompetition,
    setMatchesByCompetition,
    setMatchObj,
    setIsAuthenticating,
    isAuthenticating,
    setIsAuthenticated,
    setUserDataObj,
    showFilters,
    sidebarOpen,
  } = useContext(DataAreaContext);
  let { competition } = useParams();
  const history = useHistory();
  const competitionName = decodeURIComponent(competition);
  const [response, setResponse] = useState({});
  const [matchesObjByYearRegion, setMatchesObjByYearRegion] = useState({});
  const [isShowTooltip, setIsShowTooltip] = useState(true);
  let regions;
  let matchesByRegion;
  let rounds;
  let sortedRounds;

  const auth = getAuth();

  useEffect(() => {
    authenticateUser();
    setFilterValue({
      year: moment().format('YYYY'),
      region: '',
      round: '',
      golfClub: '',
    });
    setMatchesByCompetition([]);
    getMatchesByCompetition();
    setTimeout(() => {
      setIsShowTooltip(false);
    }, 4000);
  }, []);

  useEffect(() => {
    if (showFilters) setIsShowTooltip(false);
    if (sidebarOpen) setIsShowTooltip(false);
  }, [showFilters, sidebarOpen]);

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

  async function getMatchesByCompetition() {
    await API.getMatchesByCompetitionOnLoad(competition)
      .then((res) => {
        setMatchesByCompetition(res.data);
        setMatchesObjByYearRegion(matchesByYearRegion(res.data));
        setResponse({ code: 200 });
      })
      .catch((err) => console.log(err));
  }

  const matchesByYearRegion = (matches) => {
    let matchesByYearRegion = {};

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];

      const matchYear = moment(match.matchDateTime).format('YYYY');
      const concatRegion = match.competitionConcatRegion;
      const matchId = match.matchId;

      if (!matchesByYearRegion.hasOwnProperty(matchYear)) {
        matchesByYearRegion[matchYear] = {};
      }

      if (!matchesByYearRegion[matchYear].hasOwnProperty(concatRegion)) {
        matchesByYearRegion[matchYear][concatRegion] = {};
      }

      if (!matchesByYearRegion[matchYear][concatRegion].hasOwnProperty(matchId)) {
        matchesByYearRegion[matchYear][concatRegion][matchId] = {};
      }

      matchesByYearRegion[matchYear][concatRegion][matchId] = match;
    }

    return matchesByYearRegion;
  };

  const uniqueMatchYears = Lib.eliminateDuplicates(
    orderBy(matchesByCompetition, 'matchDateTime', 'desc').map(({ matchDateTime }) =>
      moment(matchDateTime).format('YYYY'),
    ),
  ).sort(function (a, b) {
    return b - a;
  });

  const getMatchesByRegion = (matchesObjByRegion) => {
    let matchesByRegion = [];

    for (const key in matchesObjByRegion) {
      matchesByRegion.push(matchesObjByRegion[key]);
    }

    return matchesByRegion;
  };

  const getRoundsByRegion = (matches) => {
    let rounds = [];

    for (const key in matches) {
      rounds.push(matches[key].competitionRound);
    }

    return rounds;
  };

  const getSortedRounds = (rounds) => {
    const sortedRounds = rounds.sort(Lib.compare);

    const roundArray = sortedRounds.map(function (round) {
      return round.round;
    });

    return Lib.eliminateDuplicates(roundArray);
  };

  const renderRegionHeading = (matchesObjByRegions, region) => {
    matchesByRegion = getMatchesByRegion(matchesObjByRegions[region]);
    let filteredMatchesByRegion;

    if (!isEmpty(filterValue.region) && !isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
      filteredMatchesByRegion = matchesByRegion.filter((match) => {
        if (
          match.competitionConcatRegion === filterValue.region &&
          match.competitionRound.round === filterValue.round &&
          (match.teamOneName.toLowerCase() === filterValue.golfClub ||
            match.teamTwoName.toLowerCase() === filterValue.golfClub)
        )
          return true;
      });

      if (!isEmpty(filteredMatchesByRegion)) {
        return renderRegionBody(region, true, filteredMatchesByRegion);
      }
    }

    if (
      (!isEmpty(filterValue.region) && !isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) ||
      (!isEmpty(filterValue.region) && isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) ||
      (isEmpty(filterValue.region) && !isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub))
    ) {
      filteredMatchesByRegion = matchesByRegion.filter((match) => {
        if (
          (match.competitionConcatRegion === filterValue.region &&
            match.competitionRound.round === filterValue.round) ||
          (match.competitionConcatRegion === filterValue.region &&
            (match.teamOneName.toLowerCase() === filterValue.golfClub ||
              match.teamTwoName.toLowerCase() === filterValue.golfClub)) ||
          (match.competitionRound.round === filterValue.round &&
            (match.teamOneName.toLowerCase() === filterValue.golfClub ||
              match.teamTwoName.toLowerCase() === filterValue.golfClub))
        )
          return true;
      });

      if (!isEmpty(filteredMatchesByRegion)) {
        return renderRegionBody(region, true, filteredMatchesByRegion);
      }
    }

    if (
      (!isEmpty(filterValue.region) && isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) ||
      (isEmpty(filterValue.region) && !isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) ||
      (isEmpty(filterValue.region) && isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub))
    ) {
      filteredMatchesByRegion = matchesByRegion.filter((match) => {
        if (
          match.competitionConcatRegion === filterValue.region ||
          match.competitionRound.round === filterValue.round ||
          match.teamOneName.toLowerCase() === filterValue.golfClub ||
          match.teamTwoName.toLowerCase() === filterValue.golfClub
        )
          return true;
      });

      if (!isEmpty(filteredMatchesByRegion)) {
        return renderRegionBody(region, true, filteredMatchesByRegion);
      }
    }

    if (isEmpty(filterValue.region) && isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) {
      return renderRegionBody(region, false, matchesByRegion);
    }
  };

  const renderRegionBody = (region, isFiltersPopulated, matchesByRegion) => {
    if (isFiltersPopulated) {
      rounds = getRoundsByRegion(matchesByRegion);
      sortedRounds = getSortedRounds(rounds);
    } else {
      rounds = getRoundsByRegion(matchesByRegion);
      sortedRounds = getSortedRounds(rounds);
    }

    return (
      <>
        <div style={{ marginTop: '25px', paddingTop: '15px', textAlign: 'center' }}>
          <h4>{Lib.capitalize(region)}</h4>
        </div>
        <div>
          <>
            {sortedRounds.map(function (round, i) {
              return renderRoundBody(matchesByRegion, round, i);
            })}
          </>
        </div>
      </>
    );
  };

  const renderRoundBody = (matchesObjByRegion, round, i) => {
    if (filterValue.round === '') {
      return renderRoundHeading(round, matchesObjByRegion, i);
    } else if (round === filterValue.round) {
      return renderRoundHeading(round, matchesObjByRegion, i);
    }
  };

  const renderRoundHeading = (round, matches, i) => {
    return (
      <>
        <Row>
          <Table hover size="sm" className="caption-top" style={{ tableLayout: 'fixed' }}>
            <caption style={{ color: '#0a66c2', fontWeight: '900', textAlign: 'center' }}>
              {Lib.capitalize(round)}
            </caption>
            <thead>
              {i === 0 ? (
                <OverlayTrigger
                  placement="top"
                  show={isShowTooltip}
                  overlay={
                    <Tooltip id="button-tooltip-2">Click on a match to view the individual match scores</Tooltip>
                  }
                >
                  <tr>
                    <th>Home Team</th>
                    <th>Score</th>
                    <th>Away Team</th>
                  </tr>
                </OverlayTrigger>
              ) : (
                <tr>
                  <th>Home Team</th>
                  <th>Score</th>
                  <th>Away Team</th>
                </tr>
              )}
            </thead>
            <tbody>
              {matches.map(function (match) {
                if (match.competitionRound.round === round) {
                  return renderRoundMatches(match);
                }
              })}
            </tbody>
          </Table>
        </Row>
      </>
    );
  };

  const renderRoundMatches = (match) => {
    if (
      match.teamOneName.toLowerCase().includes(filterValue.golfClub.toLowerCase()) ||
      match.teamTwoName.toLowerCase().includes(filterValue.golfClub.toLowerCase())
    ) {
      return (
        <>
          <tr key={match.matchId} onClick={(e) => onClickRow(e, match)} style={{ cursor: 'pointer' }}>
            <td>{Lib.capitalize(match.teamOneName)}</td>
            <td style={{ background: '#0a66c2' }}>{getScore(match)}</td>
            <td>{Lib.capitalize(match.teamTwoName)}</td>
          </tr>
          <tr>
            <td colSpan="3">{Lib.capitalize(match.matchStatus)}</td>
          </tr>
        </>
      );
    }
  };

  const onClickRow = (e, match) => {
    e.preventDefault();
    setMatchObj({
      ...match,
      competitionRound: { ...match.competitionRound },
      individualMatch: [...match.individualMatch],
      collaborators: [...match.collaborators],
    });
    const path = '/match/' + match.matchId;
    history.push(path);
  };

  const getScore = (match) => {
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

  return (
    <>
      <FiltersOffCanvas matches={matchesByCompetition} />
      <Header />
      <Container>
        <div>
          <div style={{ marginTop: '25px', paddingTop: '15px', textAlign: 'center' }}>
            <h4>{competitionName}</h4>
          </div>
          <IsEmpty
            value={matchesObjByYearRegion}
            yes={() => (
              <>
                {response.code === 200 ? (
                  <div style={{ textAlign: 'center' }}>
                    <br />
                    <br />
                    <h5>There's been no matches created for the {competitionName} to date 🙁</h5>
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
                {uniqueMatchYears.includes(filterValue.year) ? (
                  <>
                    {uniqueMatchYears.map(function (matchYear) {
                      regions = Object.keys(matchesObjByYearRegion[matchYear]).sort();
                      if (matchYear === filterValue.year) {
                        return (
                          <>
                            <div style={{ marginTop: '25px', paddingTop: '15px', textAlign: 'center' }}>
                              <h4>{Lib.capitalize(matchYear)}</h4>
                            </div>
                            <>
                              {regions.map(function (region) {
                                return renderRegionHeading(matchesObjByYearRegion[matchYear], region);
                              })}
                            </>
                          </>
                        );
                      }
                    })}
                  </>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <br />
                    <br />
                    <h5>
                      There are no matches created for the {competitionName} for {filterValue.year} 🙁
                    </h5>
                  </div>
                )}
              </>
            )}
          />
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default Competition;
