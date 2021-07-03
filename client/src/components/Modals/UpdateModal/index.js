import React, { useContext, useEffect, useState } from 'react';
import DataAreaContext from '../../../utils/DataAreaContext';
import Lib from '../../../utils/Lib';
import API from '../../../utils/API';
import { Button, Modal, Form, Col, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Map } from "react-lodash";
import moment from 'moment';
import 'moment-timezone';

function UpdateModal(props) {
  const { setUpdateModalShow, setMatchObj, match, setUpdateResponse, updateResponse, updateMatchObj, setUpdateMatchObj, appMatchesOnLoad } = useContext(DataAreaContext);
	let history = useHistory();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setUpdateMatchObj({...match});
  }, []);

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
    event.preventDefault();
    const { id, name, value } = event.target;

    for (let object of updateMatchObj.individualMatch) {
      if (parseInt(id) === object.id) {
        for (const key in object) {
          if (key === name) {
            object[key] = value;
            updateMatchObj.updatedAt = moment().format();
          }
        }
        return;
      }
    }
  };

  const updateOverallMatchScore = (object) => {
    let array = object.individualMatch;
    let teamOneOverallScore = 0;
    let teamTwoOverallScore = 0;
    for (const i of array) {
      if (i.teamOneScore === i.teamTwoScore) {
        teamOneOverallScore += 0.5;
        teamTwoOverallScore += 0.5;
      } else if (i.teamOneScore < i.teamTwoScore) {
        teamTwoOverallScore += 1;
      } else if (i.teamOneScore > i.teamTwoScore) {
        teamOneOverallScore += 1;
      }
    }
    return {
      teamOneScore: teamOneOverallScore,
      teamTwoScore: teamTwoOverallScore
    }
  }

  const handleUpdateClick = (event) => {
    event.preventDefault();
    setLoading(true);
    const updatedOverallMatchScore = updateOverallMatchScore(updateMatchObj);
    updateMatchObj.teamOneScore = updatedOverallMatchScore.teamOneScore;
    updateMatchObj.teamTwoScore = updatedOverallMatchScore.teamTwoScore;
    API.updateMatch({
      matchId: updateMatchObj.matchId,
      individualMatch: updateMatchObj.individualMatch,
      updatedAt: moment().format()
    })
    .then((response) => {
      setUpdateResponse({
        message: response.data.message,
        status: response.status
      });
      setMatchObj({...updateMatchObj});
      for (let i = 0; i < appMatchesOnLoad.length; i++) {
        if(appMatchesOnLoad[i].matchId === updateMatchObj.matchId) {
          appMatchesOnLoad[i] = updateMatchObj;
        }
      }
      setLoading(false);
    })
    .catch(() => {
      setUpdateResponse({
        message: "Something went wrong. Try again.",
        status: 500
      });
    });
  };

  function handleCloseClick(matchId) {
    setUpdateModalShow(false);
    setUpdateResponse({});
    history.push(`/match/${matchId}`);
  }

  return (
    <>
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="true"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Modal
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {updateResponse.status === 200 || updateResponse.status === 500 ? (
          `${ updateResponse.message }`
        ) : (
          <Form>
            <Form.Row>
              <Col>
                <Form.Label>
                  Home Team: { Lib.capitalize(match.teamOneName) }
                </Form.Label>
                <br/>
                <Form.Label>
                  Away Team: { Lib.capitalize(match.teamTwoName) }
                </Form.Label>
                <br/>
                <Form.Label>
                  Competition: { Lib.capitalize(match.competitionName) }
                </Form.Label>
                <br/>
                <Map collection={match.individualMatch}
                  iteratee={singleMatch =>
                    <>
                    <br/>
                    <Form.Label>Match #{ singleMatch.id }</Form.Label>
                    <br/>
                    <Form.Label># of holes played</Form.Label>
                    <Form.Control
                      id={ singleMatch.id }
                      defaultValue={ singleMatch.holesPlayed }
                      name="holesPlayed"
                      onChange={handleInputChange}
                    />
                    <Form.Label>
                      { Lib.capitalize(singleMatch.teamOneName) } Score
                    </Form.Label>
                    <Form.Control 
                      id={ singleMatch.id }
                      defaultValue={ singleMatch.teamOneScore }
                      name="teamOneScore"
                      onChange={handleInputChange}
                    />
                    <Form.Label>
                      { Lib.capitalize(singleMatch.teamTwoName) } Score
                    </Form.Label>
                    <Form.Control 
                      id={ singleMatch.id }
                      defaultValue={ singleMatch.teamTwoScore }
                      name="teamTwoScore"
                      onChange={handleInputChange}
                    />
                    </>
                  }
                />
                {/* <Form.Label>Match Date</Form.Label>
                <TextField
                  disabled
                  defaultValue={ match.matchDateTime }
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="matchDate"
                  name="matchDate"
                  type="date"
                  autoFocus
                  onChange={handleInputChange}
                />
                <Form.Label>Match Time</Form.Label>
                <TextField
                  disabled
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="matchTime"
                  id="matchTime"
                  type="time"
                  autoFocus
                  onChange={handleInputChange}
                /> */}
              </Col>
            </Form.Row>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {updateResponse.status === 200 || updateResponse.status === 500 ?
          <Button 
          onClick={ () => handleCloseClick(match.matchId) }
          variant="outline-success"
          >
            Close
          </Button>
          :
          <Button
          onClick={ (e) => handleUpdateClick(e) }
          variant="outline-success"
          >
          {isLoading ?
            <Spinner animation="border" variant="light" /> 
          :
            'Update'
          }
          </Button>
        }
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default UpdateModal;