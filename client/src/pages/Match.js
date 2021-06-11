import React, { useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import Lib from '../utils/Lib';
import { Map } from "react-lodash";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Row, Table } from 'react-bootstrap';
import Moment from 'react-moment';

function Match() {
  const { match } = useContext(DataAreaContext);

  const concatDateTime = match.matchDate + 'T' + match.matchTime + ':00+00:00';

  const individualMatches = match.individualMatch;
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