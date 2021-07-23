import React, { useContext, useEffect } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import API from '../utils/API';
import Lib from '../utils/Lib';
import { IsEmpty, Map } from "react-lodash";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FiltersModal from '../components/Modals/FiltersModal';
import competitionRounds from '../assets/competitionRounds.json';
import { Container, Table, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Competition () {
  const { filterValue, matchesByCompetition, setMatchesByCompetition } = useContext(DataAreaContext);
  let { competition } = useParams();
  const competitionName = decodeURIComponent(competition);

  useEffect(() => {
    getMatchesByCompetition();
  }, []);

  async function getMatchesByCompetition() {
    await API.getMatchesByCompetitionOnLoad(competition)
      .then(res => {
        setMatchesByCompetition(res.data);
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
  console.log(removedDuplicateRounds);

  const getTableRows = () => {
    for (let i = 0; i < matchesByCompetition.length; i++) {
      // return (
        <>
        <tr>
          <td>{Lib.capitalize(matchesByCompetition[i].teamOneName)}</td>
          <td style={{ background: '#0a66c2' }}>
            {getScore(matchesByCompetition[i])}
          </td>
          <td>{Lib.capitalize(matchesByCompetition[i].teamTwoName)}</td>
        </tr>
        <tr>
          <td colspan="3">{Lib.capitalize(matchesByCompetition[i].matchStatus)}</td>
        </tr>
        </>
      // )
    }
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
      <FiltersModal />
      <Header />
      <div>
        <div style={{ paddingTop: '15px', textAlign: 'center' }}>
          <h4>{competitionName}</h4>
        </div>
        <IsEmpty
          value={matchesByCompetition}
          yes={() =>
            <Spinner animation="grow" variant="success" />
          }
          no={() => (
            <>
            {removedDuplicateRounds.length === 1 ?
              <Table hover size="sm" className="table-hover caption-top">
                <caption style={{ color: '#0a66c2', fontWeight: '900' }}>{Lib.capitalize(removedDuplicateRounds[0])}</caption>
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
                    <>
                    <tr>
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
                  )}
                )}
                </tbody>
              </Table>
              :
              <>
              {removedDuplicateRounds.map(function(round) {
                return (
                  <Table hover size="sm" className="table-hover caption-top">
                    <caption style={{ color: '#0a66c2', fontWeight: '900' }}>{Lib.capitalize(round)}</caption>
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
                          <>
                          <tr>
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