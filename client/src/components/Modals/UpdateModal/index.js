import React, { useContext, useEffect, useState } from 'react';
import DataAreaContext from '../../../utils/DataAreaContext';
import API from '../../../utils/API';
import UpdateMatchForm from '../../UpdateMatchForm/index.js';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment-timezone';

function UpdateModal(props) {
  const { setUpdateModalShow, setMatchObj, match, setUpdateResponse, updateResponse, updateMatchObj, setUpdateMatchObj, appMatchesOnLoad } = useContext(DataAreaContext);
	let history = useHistory();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setUpdateMatchObj({...match});
  }, []);

  const updateOverallMatchScore = (object) => {
    let array = object.individualMatch;
    let teamOneOverallScore = 0;
    let teamTwoOverallScore = 0;
    for (const i of array) {
      if (i.homeMatchScore === i.awayMatchScore) {
        teamOneOverallScore += 0.5;
        teamTwoOverallScore += 0.5;
      } else if (i.homeMatchScore < i.awayMatchScore) {
        teamTwoOverallScore += 1;
      } else if (i.homeMatchScore > i.awayMatchScore) {
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
      matchStatus: updateMatchObj.matchStatus,
      competitionRegion: updateMatchObj.competitionRegion,
      competitionRound: updateMatchObj.competitionRound,
      teamOneName: updateMatchObj.teamOneName,
      teamOneScore: updateMatchObj.teamOneScore,
      teamTwoName: updateMatchObj.teamTwoName,
      teamTwoScore: updateMatchObj.teamTwoScore,
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
    .catch((error) => {
      setUpdateResponse({
        message: error.message,
        status: 400
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
          Update match
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {updateResponse.status === 200 || updateResponse.status === 400 ? (
          `${ updateResponse.message }`
        ) : (
          <UpdateMatchForm />
        )}
      </Modal.Body>
      <Modal.Footer>
        {updateResponse.status === 200 || updateResponse.status === 400 ?
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
            <Spinner animation="border" style={{ color: "#0a66c2" }} /> 
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