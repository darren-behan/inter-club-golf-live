import React, { useContext, useEffect, useState } from 'react';
import DataAreaContext from '../../../utils/DataAreaContext';
import API from '../../../utils/API';
import MatchForm from '../../Forms/MatchForm';
import { Button, Modal, Spinner, CloseButton } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment-timezone';
let isEmpty = require('lodash.isempty');
const { getToken } = require('firebase/app-check');

function UpdateModal(props) {
  const {
    setUpdateModalShow,
    setMatchObj,
    match,
    setUpdateResponse,
    updateResponse,
    updateMatchObj,
    setUpdateMatchObj,
    setOldUpdateMatchObj,
    appMatchesOnLoad,
    isMatchEdited,
    setIsMatchEdited,
    appCheck,
    timeZone,
  } = useContext(DataAreaContext);
  let history = useHistory();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setUpdateMatchObj(JSON.parse(JSON.stringify({ ...match })));
    setOldUpdateMatchObj(JSON.parse(JSON.stringify({ ...match })));
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
      teamTwoScore: teamTwoOverallScore,
    };
  };

  const handleClose = () => {
    setUpdateModalShow(false);
    setUpdateMatchObj(JSON.parse(JSON.stringify({ ...match })));
    setIsMatchEdited(true);
  };

  const handleUpdateClick = async (event) => {
    event.preventDefault();
    setLoading(true);

    let appCheckTokenResponse;
    try {
      appCheckTokenResponse = await getToken(appCheck, /* forceRefresh= */ false);
    } catch (err) {
      console.log(JSON.stringify(err));
      return;
    }

    const updatedOverallMatchScore = updateOverallMatchScore(updateMatchObj);
    updateMatchObj.teamOneScore = updatedOverallMatchScore.teamOneScore;
    updateMatchObj.teamTwoScore = updatedOverallMatchScore.teamTwoScore;
    API.updateMatch(
      {
        matchId: updateMatchObj.matchId,
        matchDateTime: updateMatchObj.matchDateTime,
        competitionName: updateMatchObj.competitionName,
        matchStatus: updateMatchObj.matchStatus,
        competitionConcatRegion: !isEmpty(updateMatchObj.competitionCounty)
          ? updateMatchObj.competitionRegion
          : !isEmpty(updateMatchObj.competitionRegionArea)
          ? updateMatchObj.competitionRegion + ' ' + updateMatchObj.competitionRegionArea
          : updateMatchObj.competitionRegion,
        competitionRegion: updateMatchObj.competitionRegion,
        competitionRegionArea: !isEmpty(updateMatchObj.competitionRegionArea)
          ? updateMatchObj.competitionRegionArea
          : '',
        competitionCounty: !isEmpty(updateMatchObj.competitionCounty) ? updateMatchObj.competitionCounty : '',
        competitionConcatCounty:
          !isEmpty(updateMatchObj.competitionCounty) && !isEmpty(updateMatchObj.competitionRegionArea)
            ? updateMatchObj.competitionCounty + ' ' + updateMatchObj.competitionRegionArea
            : updateMatchObj.competitionCounty,
        competitionRound: updateMatchObj.competitionRound,
        teamOneName: updateMatchObj.teamOneName,
        teamOneScore: updateMatchObj.teamOneScore,
        teamTwoName: updateMatchObj.teamTwoName,
        teamTwoScore: updateMatchObj.teamTwoScore,
        neutralVenueName: updateMatchObj.neutralVenueName,
        numIndividualMatches: updateMatchObj.numIndividualMatches,
        individualMatch: updateMatchObj.individualMatch,
        createdByUid: updateMatchObj.createdByUid,
        singlePlayer: updateMatchObj.singlePlayer,
        updatedAt: moment().format(),
        createdAt: updateMatchObj.createdAt,
      },
      appCheckTokenResponse.token,
    )
      .then((response) => {
        setUpdateResponse({
          message: response.data.message,
          status: response.status,
        });
        setMatchObj(JSON.parse(JSON.stringify({ ...response.data.match })));
        for (let i = 0; i < appMatchesOnLoad.length; i++) {
          if (appMatchesOnLoad[i].matchId === updateMatchObj.matchId) {
            appMatchesOnLoad[i] = updateMatchObj;
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setUpdateResponse({
          message: error.message,
          status: 400,
        });
      });
  };

  const handleCloseClick = (matchId) => {
    setUpdateModalShow(false);
    setUpdateResponse({});
    setUpdateMatchObj(JSON.parse(JSON.stringify({ ...match })));
    setOldUpdateMatchObj(JSON.parse(JSON.stringify({ ...match })));
    setIsMatchEdited(true);
    history.push(`/match/${matchId}`);
  };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="true"
        onHide={handleClose}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Update match</Modal.Title>
          <CloseButton onClick={handleClose} />
        </Modal.Header>
        <Modal.Body>
          {updateResponse.status === 200 || updateResponse.status === 400 ? (
            `${updateResponse.message}`
          ) : (
            <MatchForm isUpdate={true} />
          )}
        </Modal.Body>
        <Modal.Footer>
          {updateResponse.status === 200 || updateResponse.status === 400 ? (
            <Button onClick={() => handleCloseClick(match.matchId)} variant="outline-success">
              Close
            </Button>
          ) : (
            <Button onClick={(e) => handleUpdateClick(e)} variant="outline-success" disabled={isMatchEdited}>
              {isLoading ? <Spinner animation="border" style={{ color: '#0a66c2' }} /> : 'Update'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateModal;
