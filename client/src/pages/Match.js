import React, { useContext, useEffect } from 'react';
import API from '../utils/API';
import DataAreaContext from '../utils/DataAreaContext';
import Lib from '../utils/Lib';
import { Map } from "react-lodash";
import { useParams } from "react-router-dom";
import { IsEmpty } from "react-lodash";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DeleteModal from "../components/Modals/DeleteModal";
import UpdateModal from "../components/Modals/UpdateModal";
import AddCollaboratorsModal from "../components/Modals/AddCollaboratorsModal";
import { Container, Row, Table, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Moment from 'react-moment';
import 'moment-timezone';
let isEmpty = require('lodash.isempty');

function Match() {
  const { match, setMatchObj, userDataObj, isAuthenticated, deleteModalShow, setDeleteModalShow, timeZone, updateModalShow, setUpdateModalShow, setUpdateMatchObj, addCollaboratorsModalShow, setAddCollaboratorsModalShow } = useContext(DataAreaContext);
  let { id } = useParams();
  let individualMatches;
  let sortedIndividualMatches;

  useEffect(() => {
    setUpdateMatchObj({...match});
    if (!isEmpty(match)) return;
    getMatchOnLoad();
    setUpdateMatchObj({...match});
  }, []);

  async function getMatchOnLoad() {
    await API.getMatch(id)
      .then(res => {
        setMatchObj(res.data);
      })
      .catch(err => console.log(err));
  }

  if (!isEmpty(match)) {
    individualMatches = match.individualMatch;
    sortedIndividualMatches = individualMatches.sort(function(a, b) {
      return a.individualMatchId - b.individualMatchId;
    });
  }

  const getScore = () => {
    if (match.teamOneScore > match.teamTwoScore) {
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          <span style={{ float: 'left' }}><FontAwesomeIcon icon={ faArrowLeft } className='fa-sm' /></span>
          {match.teamOneScore} - {match.teamTwoScore}
          <span style={{ float: 'right', color: '#0a66c2' }}><FontAwesomeIcon icon={ faArrowRight } className='fa-sm' /></span>
        </div>
      )
    } else if (match.teamOneScore < match.teamTwoScore) {
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          <span style={{ float: 'left', color: '#0a66c2' }}><FontAwesomeIcon icon={ faArrowLeft } className='fa-sm' /></span>
          {match.teamOneScore} - {match.teamTwoScore}
          <span style={{ float: 'right' }}><FontAwesomeIcon icon={ faArrowRight } className='fa-sm' /></span>
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

  const getIndividualMatchScore = (match) => {
    if (match.homeMatchScore > match.awayMatchScore) {
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          <span style={{ float: 'left' }}><FontAwesomeIcon icon={ faArrowLeft } className='fa-sm' /></span>
          {match.homeMatchScore} up
          <span style={{ float: 'right', color: '#0a66c2' }}><FontAwesomeIcon icon={ faArrowRight } className='fa-sm' /></span>
        </div>
      )
    } else if (match.homeMatchScore < match.awayMatchScore) {
      return (
        <div style={{ color: '#ffffff', fontWeight: '900' }}>
          <span style={{ float: 'left', color: '#0a66c2' }}><FontAwesomeIcon icon={ faArrowLeft } className='fa-sm' /></span>
          {match.awayMatchScore} up<span style={{ float: 'right' }}>
          <FontAwesomeIcon icon={ faArrowRight } className='fa-sm' /></span>
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

  const getHomePlayerNames = (singleMatch) => {
    if (match.singlePlayer === true) {
      return (
        singleMatch.homeMatchPlayerAName !== "empty" ? (
          <p style={{ margin: "0px", alignItems: "center", fontSize: "0.8rem" }}>
            {Lib.capitalize(singleMatch.homeMatchPlayerAName)}
          </p>
        ) : (
          <p style={{ margin: "0px", alignItems: "center", fontSize: "0.8rem" }}>
            {match.teamOneName}
          </p>
        )
      )
    } else {
      return (
        singleMatch.homeMatchPlayerAName !== "empty" && singleMatch.homeMatchPlayerBName !== "empty" ? (
          <p style={{ margin: "0px", alignItems: "center", fontSize: "0.8rem" }}>
          {Lib.capitalize(singleMatch.homeMatchPlayerAName)}
          <br />
          {Lib.capitalize(singleMatch.homeMatchPlayerBName)}
          </p>
        ) : (
          <p style={{ margin: "0px", alignItems: "center", fontSize: "0.8rem" }}>
            {Lib.capitalize(match.teamOneName)}
          </p>
        )
      )
    }
  }

  const getAwayPlayerNames = (singleMatch) => {
    if (match.singlePlayer === true) {
      return (
        singleMatch.awayMatchPlayerAName !== "empty" ? (
          <p style={{ margin: "0px", alignItems: "center", fontSize: "0.8rem" }}>
            {Lib.capitalize(singleMatch.awayMatchPlayerAName)}
          </p>
        ) : (
          <p style={{ margin: "0px", alignItems: "center", fontSize: "0.8rem" }}>
            {Lib.capitalize(match.teamTwoName)}
          </p>
        )
      )
    } else {
      return (
        singleMatch.awayMatchPlayerAName !== "empty" && singleMatch.awayMatchPlayerBName !== "empty" ? (
          <p style={{ margin: "0px", alignItems: "center", fontSize: "0.8rem" }}>
          {Lib.capitalize(singleMatch.awayMatchPlayerAName)}
          <br />
          {Lib.capitalize(singleMatch.awayMatchPlayerBName)}
          </p>
        ) : (
          <p style={{ margin: "0px", alignItems: "center", fontSize: "0.8rem" }}>
            {Lib.capitalize(match.teamTwoName)}
          </p>
        )
      )
    }
  }

  return (
    <IsEmpty
      value={match}
      yes={() =>
        <Container fluid={ true } style={{ padding: '0 0 70px 0' }}>
          <Header />
          <Container>
            <Row>
              <div style={{ textAlign: "center" }}>
                <br />
                <br />
                <Spinner animation="grow" style={{ color: "#0a66c2" }} />
              </div>
            </Row>
          </Container>
        </Container>
      }
      no={() => (
        <>
        <DeleteModal
          show={deleteModalShow}
          onHide={() => setDeleteModalShow(false)} 
        />
        <UpdateModal
          show={updateModalShow}
          onHide={() => setUpdateModalShow(false)} 
        />
        <AddCollaboratorsModal
          show={addCollaboratorsModalShow}
          onHide={() => setAddCollaboratorsModalShow(false)} 
        />
        <Header />
        <Container>
          <Row style={{ marginTop: '10px'}}>
            <Table size="sm" className="caption-top" style={{ tableLayout: 'fixed' }}>
              <caption style={{ color: '#0a66c2', fontWeight: '900', textAlign: 'center' }}>Match Score</caption>
              <tbody>
                <tr key={match.matchId}>
                  <td style={{ background: '#ffffff' }}>{Lib.capitalize(match.teamOneName)}</td>
                  <td style={{ background: '#0a66c2' }}>
                    {getScore()}
                  </td>
                  <td style={{ background: '#ffffff' }}>{Lib.capitalize(match.teamTwoName)}</td>
                </tr>
              </tbody>
            </Table>
          </Row>
          <Row>
            <div style={{ textAlign: 'left' }}>
              <h6>Competition:&nbsp;<span style={{ color: "#0a66c2" }}>{ Lib.capitalize(match.competitionName) }</span></h6>
              <h6>Competition Round:&nbsp;<span style={{ color: "#0a66c2" }}>{ Lib.capitalize(match.competitionRound.round) }</span></h6>
              <h6>Match Status:&nbsp;<span style={{ color: "#0a66c2" }}>{ Lib.capitalize(match.matchStatus) }</span></h6>
              <h6>
                Match Date:&nbsp;
                <span style={{ color: "#0a66c2" }}>
                  <Moment tz={ timeZone } format="DD/MM/YYYY">
                    { match.matchDateTime }
                  </Moment>
                </span>
              </h6>
              <h6>
                Tee Time:&nbsp;
                <span style={{ color: "#0a66c2" }}>
                  <Moment tz={ timeZone } format="HH:mm z">
                    { match.matchDateTime }
                  </Moment>
                </span>
              </h6>
            </div>
          </Row>
          <br />
          <Row>
            <Table size="sm" className="caption-top" style={{ tableLayout: 'fixed' }}>
              <caption style={{ color: '#0a66c2', fontWeight: '900', textAlign: 'center' }}>Individual Match Scores</caption>
              <thead>
                <tr>
                  <th>{ Lib.capitalize(match.teamOneName) }</th>
                  <th>Score</th>
                  <th>{ Lib.capitalize(match.teamTwoName) }</th>
                </tr>
              </thead>
              <tbody>
                <Map collection={sortedIndividualMatches}
                  iteratee={singleMatch =>
                    <>
                    <tr>
                      <td colSpan="3" style={{ background: "#ffffff", textAlign: "left" }}>
                        {singleMatch.matchDestination === "empty" ?
                          <>
                          Match {singleMatch.individualMatchId} destination not provided
                          </>
                        :
                          <>
                          Match {singleMatch.individualMatchId} contested in&nbsp;
                          <span style={{ color: "#0a66c2", fontWeight: "500" }}>
                            {Lib.capitalize(singleMatch.matchDestination)}
                          </span>
                          </>
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{getHomePlayerNames(singleMatch)}</td>
                      <td style={{ background: '#0a66c2' }}>
                        {getIndividualMatchScore(singleMatch)}
                      </td>
                      <td>{getAwayPlayerNames(singleMatch)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3">Holes played <span style={{ color: "#0a66c2", fontWeight: "500" }}>{singleMatch.holesPlayed}</span></td>
                    </tr>
                    <br />
                    </>
                  }
                />
              </tbody>
            </Table>
          </Row>
          {isAuthenticated ? (
            <>
              {(match.createdByUid === userDataObj.uid) ?
                <>
                <Row className="d-grid gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    className="update-match"
                    onClick={() =>
                      setUpdateModalShow(true)
                    }
                  >
                    Update
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="add-match-collaborators"
                    onClick={() =>
                      setAddCollaboratorsModalShow(true)
                    }
                  >
                    Add Collaborators
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="delete-match"
                    onClick={() =>
                      setDeleteModalShow(true)
                    }
                  >
                    Delete
                  </Button>
                </Row>
                <br />
                </>
                : (match.hasOwnProperty("collaborators") && !isEmpty(match.collaborators)) ?
                  match.collaborators.map(collaborator => {
                    if (collaborator.userId === userDataObj.uid) {
                      return (
                        <>
                        <Row className="d-grid gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            className="update-match"
                            onClick={() =>
                              setUpdateModalShow(true)
                            }
                          >
                            Update
                          </Button>
                        </Row>
                        <br />
                        </>
                      )
                    }
                  })
                :
                null
              }
            </>
          ) : (
            null
          )}
          <Row>
            <h6>
              Last updated on&nbsp;
              <span style={{ color: "#0a66c2" }}>
                <Moment tz={ timeZone } format="DD/MM/YYYY">
                  { match.updatedAt }
                </Moment>
              </span>
              &nbsp;at&nbsp;
              <span style={{ color: "#0a66c2" }}>
                <Moment tz={ timeZone } format="HH:mm">
                  { match.updatedAt }
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
  )
}

export default Match;