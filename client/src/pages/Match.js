import React, { useContext } from 'react';
import { useParams } from "react-router-dom";
import DataAreaContext from '../utils/DataAreaContext';
import { Map } from "react-lodash";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Row, Table } from 'react-bootstrap';
import Moment from 'react-moment';

function Match() {
  const { id } = useParams()
  const { allMatches } = useContext(DataAreaContext);

  const match = allMatches.filter(match => match.matchId === id);

  const concatDateTime = match[0].matchDate + 'T' + match[0].matchTime + ':00+00:00';

  const individualMatches = match[0].individualMatch;
  const sortedIndividualMatches = individualMatches.sort(function(a, b) {
    return a.id - b.id;
  });

  return (
    <>
    <Container fluid={ true } style={{ padding: 0}}>
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
                  <Moment format="DD/MM/YYYY">
                    { concatDateTime }
                  </Moment>
                </td>
                <td>
                  <Moment format="HH:MM">
                    { concatDateTime }
                  </Moment>
                </td>
                <td>{ match[0].competitionName }</td>
                <td>{ match[0].matchStatus }</td>
              </tr>
            </tbody>
          </Table>
        </Row>
        <Row>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>{ match[0].teamOneName } (H)</th>
                <th>{ match[0].teamTwoName } (A)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{ match[0].teamOneScore }</td>
                <td>{ match[0].teamTwoScore }</td>
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
                <th>{ match[0].teamOneName }</th>
                <th>Thru</th>
                <th>{ match[0].teamTwoName }</th>
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
                  Last updated:
                  <Moment format="DD/MM/YYYY - HH:MM">
                    { concatDateTime }
                  </Moment>
                  </th>
              </tr>
            </thead>
          </Table>
        </Row>
      </Container>
      <Footer />
    </Container>
    </>
  )
}

export default Match;