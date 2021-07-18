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
import { Container, Row, Table, Button, Spinner } from 'react-bootstrap';
import Moment from 'react-moment';
import 'moment-timezone';
let isEmpty = require('lodash.isempty');

function Match() {
  const { match, setMatchObj, userDataObj, isAuthenticated, deleteModalShow, setDeleteModalShow, timeZone, updateModalShow, setUpdateModalShow, setUpdateMatchObj, updateMatchObj } = useContext(DataAreaContext);
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

  return (
    <IsEmpty
      value={match}
      yes={() =>
        <Container fluid={ true } style={{ padding: '0 0 70px 0' }}>
          <Header />
          <Container>
            <Row>
              <Spinner animation="grow" variant="success" />
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
        <Container fluid={ true } style={{ padding: '0 0 70px 0' }}>
          <Header />
          <Container>
            <Row>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Tee Time</th>
                    <th>Competition</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Moment tz={ timeZone } format="DD/MM/YYYY">
                        { match.matchDateTime }
                      </Moment>
                    </td>
                    <td>
                      <Moment tz={ timeZone } format="HH:mm z">
                        { match.matchDateTime }
                      </Moment>
                    </td>
                    <td>{ Lib.capitalize(match.competitionName) }</td>
                    <td>{ Lib.capitalize(match.matchStatus) }</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
            <Row>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>{ Lib.capitalize(match.teamOneName) } (H)</th>
                    <th>{ Lib.capitalize(match.teamTwoName) } (A)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{ match.teamOneScore }</td>
                    <td>{ match.teamTwoScore }</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
            <Row>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Individual Match Scores</th>
                  </tr>
                </thead>
              </Table>
            </Row>
            <Row>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th></th>
                    <th>{ Lib.capitalize(match.teamOneName) }</th>
                    <th>Thru</th>
                    <th>{ Lib.capitalize(match.teamTwoName) }</th>
                  </tr>
                </thead>
                <tbody>
                  <Map collection={sortedIndividualMatches}
                    iteratee={singleMatch =>
                      <tr>
                        <td>{ singleMatch.individualMatchId }</td>
                        <td>{ singleMatch.homeMatchScore }</td>
                        <td>{ singleMatch.holesPlayed }</td>
                        <td>{ singleMatch.awayMatchScore }</td>
                      </tr>
                    }
                  />
                </tbody>
              </Table>
            </Row>
            <Row>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>
                      Last updated at:
                      <Moment tz={ timeZone } format="DD/MM/YYYY HH:mm z">
                        { match.updatedAt }
                      </Moment>
                      </th>
                  </tr>
                </thead>
              </Table>
            </Row>
            {(isAuthenticated) && (match.createdByUid === userDataObj.uid) ? (
              <>
                <Row>
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="float-left"
                    onClick={() =>
                      setUpdateModalShow(true)
                    }
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="float-right"
                    onClick={() =>
			                setDeleteModalShow(true)
                    }
                  >
                    Delete
                  </Button>
                </Row>
              </>
            ) : (
              null
            )
            }
          </Container>
          {/* <Footer /> */}
        </Container>
        </>
      )}
    />
  )
}

export default Match;