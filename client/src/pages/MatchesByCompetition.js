import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import API from '../utils/API';
import Lib from '../utils/Lib';
import CompetitionData from '../assets/data/competitions.json';
import { IsEmpty } from 'react-lodash';
import { isEmpty, orderBy } from 'lodash';
import { useParams, useHistory, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FiltersOffCanvas from '../components/FiltersOffCanvas';
import { Container, Row, Table, OverlayTrigger, Tooltip, Breadcrumb, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ShinyBlock, Space } from '../components/SkeletonBuildingBlocks/SkeletonBuildingBlocks';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment-timezone';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
const { getToken } = require('firebase/app-check');

function MatchesByCompetition() {
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
    isShowTooltip,
    setIsShowTooltip,
    appCheck,
    isCommpetitionByCountyFormat,
    setIsCompetitionByCountyFormat,
    timeZone,
  } = useContext(DataAreaContext);
  let { competition } = useParams();
  const history = useHistory();
  const competitionName = decodeURIComponent(competition);
  const [response, setResponse] = useState({});
  const [matchesObjByYearRegion, setMatchesObjByYearRegion] = useState({});
  const [isCommpetitionNameParamInvalid, setIsCommpetitionNameParamInvalid] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  let regions;
  let matchesByRegion;
  let countiesByRegion;
  let sortedCounties;
  let matchesByCounty;
  let rounds;
  let sortedRounds;

  const auth = getAuth();

  useEffect(() => {
    if (isAuthenticating.status !== 400 && isAuthenticating.authenticatingComplete !== true) authenticateUser();
    if (!isCommpetitionNameParamValid()) return;
    setIsCompetitionByCountyFormat(false);
    getIsCommpetitionByCountyFormat();
    setFilterValue({
      year: moment().format('YYYY'),
      region: '',
      round: '',
      golfClub: '',
    });
    setMatchesByCompetition([]);
    getMatchesByCompetition();
  }, []);

  useEffect(() => {
    if (showFilters) setIsShowTooltip(false);
    if (sidebarOpen) setIsShowTooltip(false);
  }, [showFilters, sidebarOpen]);

  const isCommpetitionNameParamValid = () => {
    const competitionNames = CompetitionData.map((competition) => {
      return competition.name;
    });
    if (competitionNames.includes(competitionName)) {
      return true;
    } else {
      setIsCommpetitionNameParamInvalid(true);
      return false;
    }
  };

  const getIsCommpetitionByCountyFormat = () => {
    CompetitionData.map((competition) => {
      if (competition.name === competitionName && competition.isCountyFormat) setIsCompetitionByCountyFormat(true);
    });
  };

  useLayoutEffect(() => {
    const handleScroll = (e) => {
      setScrolled(window.scrollY > 0);
      setIsShowTooltip(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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

  const getMatchesByCompetition = async () => {
    let appCheckTokenResponse;
    try {
      appCheckTokenResponse = await getToken(appCheck, /* forceRefresh= */ false);
    } catch (err) {
      console.log(JSON.stringify(err));
      return;
    }
    await API.getMatchesByCompetitionOnLoad(competition, appCheckTokenResponse.token)
      .then((res) => {
        setMatchesByCompetition(res.data);
        setMatchesObjByYearRegion(matchesByYearRegion(res.data));
        setResponse({ code: 200 });
        if (!isEmpty(res.data)) {
          setIsShowTooltip(true);
          setTimeout(() => {
            setIsShowTooltip(false);
          }, 4000);
        }
      })
      .catch((err) => console.log(err));
  };

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

  const getIsProvinceFinalsMatches = (matchesArrByRegion, getProvinceFinalsMatches) => {
    let provinceFinalsMatches = [];
    let countyMatches = [];

    for (const key in matchesArrByRegion) {
      if (isEmpty(matchesArrByRegion[key].competitionConcatCounty)) {
        provinceFinalsMatches.push(matchesArrByRegion[key]);
      } else if (!isEmpty(matchesArrByRegion[key].competitionConcatCounty)) {
        countyMatches.push(matchesArrByRegion[key]);
      }
    }

    if (getProvinceFinalsMatches) {
      return provinceFinalsMatches;
    } else {
      return countyMatches;
    }
  };

  const getMatchesByCounty = (matchesByRegion, county) => {
    let matches = [];

    for (const key in matchesByRegion) {
      if (matchesByRegion[key].competitionConcatCounty.toLowerCase() === county.toLowerCase()) {
        matches.push(matchesByRegion[key]);
      }
    }

    return matches;
  };

  const getCountiesByRegion = (matchesArrByRegion) => {
    let countiesByRegion = [];

    for (const key in matchesArrByRegion) {
      countiesByRegion.push(matchesArrByRegion[key].competitionConcatCounty);
    }

    return countiesByRegion;
  };

  const getSortedCounties = (counties) => {
    const sortedCounties = counties.sort(Lib.compare);

    return Lib.eliminateDuplicates(sortedCounties);
  };

  const getRoundsByRegion = (matches) => {
    let rounds = [];

    for (const key in matches) {
      rounds.push(matches[key].competitionRound);
    }

    return rounds;
  };

  const getRoundsByCounty = (matches, county) => {
    let rounds = [];

    for (const key in matches) {
      if (matches[key].competitionConcatCounty.toLowerCase() === county.toLowerCase()) {
        rounds.push(matches[key].competitionRound);
      }
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
        return renderRegionBody(region, filteredMatchesByRegion);
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
        return renderRegionBody(region, filteredMatchesByRegion);
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
        return renderRegionBody(region, filteredMatchesByRegion);
      }
    }

    if (isEmpty(filterValue.region) && isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) {
      return renderRegionBody(region, matchesByRegion);
    }
  };

  const renderRegionBody = (region, matchesByRegion) => {
    if (isCommpetitionByCountyFormat) {
      if (region === 'all ireland') {
        rounds = getRoundsByRegion(matchesByRegion);
        sortedRounds = getSortedRounds(rounds);

        return (
          <>
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
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
      } else {
        let provinceFinalsMatches = getIsProvinceFinalsMatches(matchesByRegion, true);
        let countyMatches = getIsProvinceFinalsMatches(matchesByRegion, false);

        rounds = getRoundsByRegion(provinceFinalsMatches);
        sortedRounds = getSortedRounds(rounds);
        countiesByRegion = getCountiesByRegion(countyMatches);
        sortedCounties = getSortedCounties(countiesByRegion);

        return (
          <>
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <h4>{Lib.capitalize(region)}</h4>
            </div>
            <>
              {!isEmpty(provinceFinalsMatches) ? (
                <>
                  <div>
                    {sortedRounds.map(function (round, i) {
                      return renderRoundBody(provinceFinalsMatches, round, i);
                    })}
                  </div>
                </>
              ) : null}
            </>
            <div>
              <>
                {sortedCounties.map(function (county) {
                  return renderCountyBody(countyMatches, county);
                })}
              </>
            </div>
          </>
        );
      }
    } else {
      rounds = getRoundsByRegion(matchesByRegion);
      sortedRounds = getSortedRounds(rounds);

      return (
        <>
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
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
    }
  };

  const renderCountyBody = (matchesByRegion, county) => {
    matchesByCounty = getMatchesByCounty(matchesByRegion, county);
    rounds = getRoundsByCounty(matchesByRegion, county);
    sortedRounds = getSortedRounds(rounds);

    return (
      <>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <h6>{Lib.capitalize(county)}</h6>
        </div>
        <div>
          <>
            {sortedRounds.map(function (round, i) {
              return renderRoundBody(matchesByCounty, round, i);
            })}
          </>
        </div>
      </>
    );
  };

  const renderRoundBody = (matches, round, i) => {
    if (filterValue.round === '') {
      return renderRoundHeading(round, matches, i);
    } else if (round === filterValue.round) {
      return renderRoundHeading(round, matches, i);
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
              <tr>
                <th>Home Team</th>
                <th>Score</th>
                <th>Away Team</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => {
                if (match.competitionRound.round === round) {
                  return renderRoundMatches(match, i);
                }
              })}
            </tbody>
          </Table>
        </Row>
      </>
    );
  };

  const renderRoundMatches = (match, i) => {
    if (
      match.teamOneName.toLowerCase().includes(filterValue.golfClub.toLowerCase()) ||
      match.teamTwoName.toLowerCase().includes(filterValue.golfClub.toLowerCase())
    ) {
      return (
        <>
          {i === 0 ? (
            <>
              <OverlayTrigger
                placement="top"
                show={isShowTooltip}
                overlay={<Tooltip id="button-tooltip-2">Click on a match to view the individual match scores</Tooltip>}
              >
                <tr key={match.matchId} onClick={(e) => onClickRow(e, match)} style={{ cursor: 'pointer' }}>
                  <td>{Lib.capitalize(match.teamOneName)}</td>
                  <td style={{ background: '#0a66c2' }}>{getScore(match)}</td>
                  <td>{Lib.capitalize(match.teamTwoName)}</td>
                </tr>
              </OverlayTrigger>
              <tr>
                <td colSpan="3" style={{ fontSize: '13px' }}>
                  {calculateMatchStatus(match)}
                </td>
              </tr>
            </>
          ) : (
            <>
              <tr key={match.matchId} onClick={(e) => onClickRow(e, match)} style={{ cursor: 'pointer' }}>
                <td>{Lib.capitalize(match.teamOneName)}</td>
                <td style={{ background: '#0a66c2' }}>{getScore(match)}</td>
                <td>{Lib.capitalize(match.teamTwoName)}</td>
              </tr>
              <tr>
                <td colSpan="3" style={{ fontSize: '13px' }}>
                  {calculateMatchStatus(match)}
                </td>
              </tr>
            </>
          )}
        </>
      );
    }
  };

  const calculateMatchStatus = (match) => {
    if (match.matchStatus === 'complete') {
      return (
        <Badge bg="success" style={{ fontSize: '1em' }}>
          {Lib.capitalize(match.matchStatus)}d&nbsp;on&nbsp;
          <Moment tz={timeZone} format="DD/MM/YYYY">
            {match.matchDateTime}
          </Moment>
        </Badge>
      );
    } else if (match.matchStatus === 'in progress') {
      return (
        <Badge bg="warning" style={{ fontSize: '1em' }}>
          {Lib.capitalize(match.matchStatus)}
        </Badge>
      );
    } else if (match.matchStatus === 'not started') {
      return (
        <Badge style={{ fontSize: '1em', backgroundColor: '#0a66c2' }}>
          Teeing off on&nbsp;
          <Moment tz={timeZone} format="DD/MM/YYYY">
            {match.matchDateTime}
          </Moment>
          &nbsp;@&nbsp;
          <Moment tz={timeZone} format="HH:mm z">
            {match.matchDateTime}
          </Moment>
        </Badge>
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
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          {match.teamOneScore} - {match.teamTwoScore}
        </div>
      );
    }
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
            <Breadcrumb.Item active>{competitionName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </>
    );
  };

  return (
    <>
      <FiltersOffCanvas matches={matchesByCompetition} />
      <Header />
      <Container>
        <div>
          <BreadCrumb />
          <>
            {isCommpetitionNameParamInvalid ? (
              <>
                <div>
                  <h2>Page not found</h2>
                </div>
              </>
            ) : (
              <>
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
                          <div className="py-1">
                            <ShinyBlock height="1.5rem" width="80%" style={{ margin: '0% 10%' }} />
                            <Space height="1rem" />
                            <ShinyBlock height="1.5rem" width="60%" style={{ margin: '0% 20%' }} />
                            <Space height="1rem" />
                            <ShinyBlock height="1rem" width="40%" style={{ margin: '0% 30%' }} />
                            <Space height="1rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="0.5rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="0.5rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="1rem" />
                            <Space height="1rem" />
                            <ShinyBlock height="1rem" width="40%" style={{ margin: '0% 30%' }} />
                            <Space height="1rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="0.5rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="0.5rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="1rem" />
                            <Space height="1rem" />
                            <ShinyBlock height="1rem" width="40%" style={{ margin: '0% 30%' }} />
                            <Space height="1rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="0.5rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="0.5rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="1rem" />
                            <Space height="1rem" />
                            <ShinyBlock height="1rem" width="40%" style={{ margin: '0% 30%' }} />
                            <Space height="1rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="0.5rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="0.5rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="1rem" />
                            <Space height="1rem" />
                            <ShinyBlock height="1rem" width="40%" style={{ margin: '0% 30%' }} />
                            <Space height="1rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="0.5rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="0.5rem" />
                            <ShinyBlock height="1rem" width="100%" />
                            <Space height="1rem" />
                            <Space height="1rem" />
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
                                  <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                    <h4>
                                      {competitionName} {Lib.capitalize(matchYear)}
                                    </h4>
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
              </>
            )}
          </>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default MatchesByCompetition;
