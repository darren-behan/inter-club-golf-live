import React, { useContext, useEffect, useState} from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import API from '../utils/API';
import Lib from '../utils/Lib';
import { IsEmpty } from "react-lodash";
import { useParams, useHistory } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FiltersOffCanvas from '../components/FiltersOffCanvas';
import { Container, Table, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Competition () {
  const { filterValue, setFilterValue, matchesByCompetition, setMatchesByCompetition, setMatchObj } = useContext(DataAreaContext);
  let { competition } = useParams();
  const history = useHistory();
  const competitionName = decodeURIComponent(competition);
  const [response, setResponse] = useState({});
  const [matchesObjByRegion, setMatchesObjByRegion] = useState({});

  useEffect(() => {
    setFilterValue("");
    setMatchesByCompetition([]);
    getMatchesByCompetition();
  }, []);

  async function getMatchesByCompetition() {
    await API.getMatchesByCompetitionOnLoad(competition)
      .then(res => {
        setMatchesByCompetition(res.data);
        setMatchesObjByRegion(matchesByRegion(res.data));
        setResponse({ code: 200 });
      })
      .catch(err => console.log(err));
  }

  const matchesByRegion = (matches) => {
    let matchesByRegion = {};

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      
      const concatRegion = match.competitionConcatRegion;
      const matchId = match.matchId;

      if (!matchesByRegion.hasOwnProperty(concatRegion)) {
        matchesByRegion[concatRegion] = {};
      }

      if (!matchesByRegion[concatRegion].hasOwnProperty(matchId)) {
        matchesByRegion[concatRegion][matchId] = {};
      }
      
      matchesByRegion[concatRegion][matchId] = match;
    }

    return matchesByRegion;
  }

  const concatRegions = matchesByCompetition.map(function(match) {
    return match.competitionConcatRegion;
  });

  const sortedRegions = Lib.eliminateDuplicates(concatRegions).sort();

  const returnMatchesByRegionInArray = (region) => {
    let matches = [];

    for (const key in matchesObjByRegion) {
      if (key === region) {
        for (const key in matchesObjByRegion[region]) {
          matches.push(matchesObjByRegion[region][key]);
        }
      }
    }

    return matches;
  }

  const getRoundsByRegion = (matches) => {
    const rounds = matches.map(function(match) {
      return match.competitionRound;
    });
  
    const sortedRounds = rounds.sort(Lib.compare);
  
    const roundArray = sortedRounds.map(function(round) {
      return round.round;
    });
  
    return Lib.eliminateDuplicates(roundArray);
  }

  const getTableRows = (match) => {
    if (match.teamOneName.includes(filterValue.toLowerCase()) || match.teamTwoName.includes(filterValue.toLowerCase())) {
      return (
        <>
        <tr key={match.matchId} onClick={(e) => onClickRow(e, match)} style={{ cursor: "pointer" }}>
          <td>{Lib.capitalize(match.teamOneName)}</td>
          <td style={{ background: '#0a66c2' }}>
            {getScore(match)}
          </td>
          <td>{Lib.capitalize(match.teamTwoName)}</td>
        </tr>
        <tr>
          <td colSpan="3">{Lib.capitalize(match.matchStatus)}</td>
        </tr>
        </>
      )
    }
  }

  const onClickRow = (e, match) => {
    e.preventDefault();
    setMatchObj(match);
    const path = "/match/" + match.matchId;
    history.push(path);
  }

  const getScore = (match) => {
    if (match.teamOneScore > match.teamTwoScore) {
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          <span style={{ float: 'left' }}><FontAwesomeIcon icon={ faArrowLeft } className='fa-sm' /></span>{match.teamOneScore} - {match.teamTwoScore}
        </div>
      )
    } else if (match.teamOneScore < match.teamTwoScore) {
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          {match.teamOneScore} - {match.teamTwoScore}<span style={{ float: 'right' }}><FontAwesomeIcon icon={ faArrowRight } className='fa-sm' /></span>
        </div>
      )
    } else {
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          A/S
        </div>
      )
    }
  }
  
  return (
    <>
    <Container fluid={ true } className="p-0">
      <FiltersOffCanvas
        matches={matchesByCompetition}
      />
      <Header />
      <div>
        <div style={{ marginTop: '25px', paddingTop: '15px', textAlign: 'center' }}>
          <h4>{competitionName}</h4>
        </div>
        <IsEmpty
          value={matchesByCompetition}
          yes={() =>
            <>
            {response.code === 200 ?
              <div style={{ textAlign: "center" }}>
                <br />
                <br />
                <h5>There are no matches created for this tournament yet 🙁</h5>
              </div>
              :
              <>
              <br />
              <div style={{ textAlign: "center" }}>
                <Spinner animation="grow" style={{ color: "#0a66c2" }} />
              </div>
              <br />
              </>
            }
            </>
          }
          no={() => (
            <>
            {sortedRegions.map(function(region) {
              let matchesArrByRegion = returnMatchesByRegionInArray(region);
              let rounds = getRoundsByRegion(matchesArrByRegion);
              return (
                <>
                <div style={{ marginTop: '25px', paddingTop: '15px', textAlign: 'center' }}>
                  <h4>{Lib.capitalize(region)}</h4>
                </div>
                <div>
                  <>
                  {
                    rounds.map(function(round) {
                      return (
                        <>
                        <Table hover size="sm" className="caption-top" style={{ tableLayout: 'fixed' }}>
                          <caption style={{ color: '#0a66c2', fontWeight: '900', textAlign: 'center' }}>{Lib.capitalize(round)}</caption>
                          <thead>
                            <tr>
                              <th>Home Team</th>
                              <th>Score</th>
                              <th>Away Team</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              matchesArrByRegion.map(function(match) {
                                if (match.competitionRound.round === round) {
                                  return (
                                    getTableRows(match)
                                  )
                                }
                              })
                            }
                          </tbody>
                        </Table>
                        </>
                      )}
                    )
                  }
                  </>
                </div>
                </>
              )}
            )}
            </>
          )}
        />
      </div>
      <Footer />
    </Container>
    </>
  );
}

export default Competition;