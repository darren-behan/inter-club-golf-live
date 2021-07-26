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

  useEffect(() => {
    setFilterValue("");
    setMatchesByCompetition([]);
    getMatchesByCompetition();
  }, []);

  async function getMatchesByCompetition() {
    await API.getMatchesByCompetitionOnLoad(competition)
      .then(res => {
        setMatchesByCompetition(res.data);
        setResponse({ code: 200 });
      })
      .catch(err => console.log(err));
  }

  const rounds = matchesByCompetition.map(function(match) {
    return match.competitionRound;
  });

  const sortedRounds = rounds.sort(Lib.compare);

  const roundArray = sortedRounds.map(function(round) {
    return round.round;
  });

  const removedDuplicateRounds = Lib.eliminateDuplicates(roundArray);

  const getTableRows = (match) => {
    if (match.teamOneName.includes(filterValue.toLowerCase()) || match.teamTwoName.includes(filterValue.toLowerCase())) {
      return (
        <>
        <tr key={match.matchId} onClick={(e) => onClickRow(e, match)}>
          <td>{Lib.capitalize(match.teamOneName)}</td>
          <td style={{ background: '#0a66c2' }}>
            {getScore(match)}
          </td>
          <td>{Lib.capitalize(match.teamTwoName)}</td>
        </tr>
        <tr>
          <td colspan="3">{Lib.capitalize(match.matchStatus)}</td>
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
        <div style={{ paddingTop: '15px', textAlign: 'center' }}>
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
            {removedDuplicateRounds.length === 1 ?
              <Table hover size="sm" className="table-hover caption-top">
                <caption style={{ color: '#0a66c2', fontWeight: '900', textAlign: 'center' }}>{Lib.capitalize(removedDuplicateRounds[0])}</caption>
                <thead>
                  <tr>
                    <th>Home Team</th>
                    <th>Score</th>
                    <th>Away Team</th>
                  </tr>
                </thead>
                <tbody>
                {matchesByCompetition.map(function(match) {
                  return (
                    getTableRows(match)
                  )}
                )}
                </tbody>
              </Table>
              :
              <>
              {removedDuplicateRounds.map(function(round) {
                return (
                  <Table hover size="sm" className="table-hover caption-top">
                    <caption style={{ color: '#0a66c2', fontWeight: '900', textAlign: 'center' }}>{Lib.capitalize(round)}</caption>
                    <thead>
                      <tr>
                        <th>Home Team</th>
                        <th>Score</th>
                        <th>Away Team</th>
                      </tr>
                    </thead>
                    <tbody>
                    {matchesByCompetition.map(function(match) {
                      if (match.competitionRound.round === round) {
                        return (
                          getTableRows(match)
                        )
                      }}
                    )}
                    </tbody>
                  </Table>
                )}
              )}
              </>
            }
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