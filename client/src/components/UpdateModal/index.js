import React, { useContext, useEffect } from 'react';
import DataAreaContext from '../../utils/DataAreaContext';
import Lib from '../../utils/Lib';
import API from '../../utils/API';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Map } from "react-lodash";
import TextField from '@material-ui/core/TextField';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import 'moment-timezone';

function UpdateModal(props) {
  const { setUpdateModalShow, match, updateResponse, updateMatchObj, setUpdateMatchObj } = useContext(DataAreaContext);
	let history = useHistory();

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
          }
        }
        return;
      }
    }
  };
  console.log(updateMatchObj);

  const handleUpdateClick = (event) => {
    event.preventDefault();
    API.updateMatch({
      matchId: updateMatchObj.matchId,
      individualMatch: updateMatchObj.individualMatch,
      updatedAt: moment().format()
    })
    .then((response) => {
      console.log(response.data);
      // setMatchObj([response.data, ...match]);
      setUpdateModalShow(false);
    })
    .catch(error => {
      console.log(error);
      // setLoading(false);
    });
  };

  function handleCloseClick(matchId) {
    setUpdateModalShow(false);
    history.push(`/match/${matchId}`);
  }

  return (
    <>
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Modal
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer>
        {updateResponse.status === 200 ?
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
            Update
          </Button>
        }
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default UpdateModal;