import React, { useContext, useEffect } from 'react';
import API from '../utils/API';
import DataAreaContext from '../utils/DataAreaContext';
import Lib from '../utils/Lib';
import { Map } from "react-lodash";
import { useParams } from "react-router-dom";
import { IsEmpty } from "react-lodash";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DeleteModal from "../components/DeleteModal";
import UpdateModal from "../components/UpdateModal";
import { Container, Row, Table, Button, Spinner } from 'react-bootstrap';
import Moment from 'react-moment';
import 'moment-timezone';
let isEmpty = require('lodash.isempty');

function Match() {
  const { appMatchesOnLoad, match, setMatchObj, userDataObj, isAuthenticated, deleteModalShow, setDeleteModalShow, setDeleteResponse, timeZone, updateModalShow, setUpdateModalShow } = useContext(DataAreaContext);
  let { id } = useParams();
  let individualMatches;
  let sortedIndividualMatches;

  useEffect(() => {
    if (!isEmpty(match)) return;
    getMatchOnLoad();
  }, []);

  async function getMatchOnLoad() {
    await API.getMatch(id)
      .then(res => {
        setMatchObj(res.data);
      })
      .catch(err => console.log(err));
  }

  console.log(match);

  if (!isEmpty(match)) {
    individualMatches = match.individualMatch;
    sortedIndividualMatches = individualMatches.sort(function(a, b) {
      return a.id - b.id;
    });
  }

  function handleClick(matchId) {
    API.deleteMatch(matchId)
		.then((response) => {
      setDeleteResponse({
        message: response.data.message,
        status: response.status
      });
			setDeleteModalShow(true);
      Lib.removeByAttr(appMatchesOnLoad, 'matchId', matchId)
		})
		.catch(error => {
      setDeleteResponse({
        message: error.data.message,
        status: error.status
      });
			console.log(error);
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
        />
        <UpdateModal
          show={updateModalShow}
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
                    <td>{ match.competitionName }</td>
                    <td>{ Lib.capitalize(match.matchStatus) }</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
            <Row>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>{ match.teamOneName } (H)</th>
                    <th>{ match.teamTwoName } (A)</th>
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
                    <th>{ match.teamOneName }</th>
                    <th>Thru</th>
                    <th>{ match.teamTwoName }</th>
                  </tr>
                </thead>
                <tbody>
                  <Map collection={sortedIndividualMatches}
                    iteratee={singleMatch =>
                      <tr>
                        <td>{ singleMatch.id }</td>
                        <td>{ singleMatch.teamOneScore }</td>
                        <td>{ singleMatch.holesPlayed }</td>
                        <td>{ singleMatch.teamTwoScore }</td>
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
                      handleClick(match.matchId)
                    }
                  >
                    Delete
                  </Button>
                </Row>
              </>
            ) : (
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
                </Row>
              </>
            )
            }
          </Container>
          <Footer />
        </Container>
        </>
      )}
    />
  )
}

export default Match;