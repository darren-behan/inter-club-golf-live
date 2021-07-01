import React, { useContext, useState } from 'react';
import API from '../../utils/API';
import DataAreaContext from '../../utils/DataAreaContext';
import Lib from '../../utils/Lib';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function DeleteModal(props) {
  const { setDeleteModalShow, deleteResponse, setDeleteResponse, appMatchesOnLoad, match, userDataObj } = useContext(DataAreaContext);
	let history = useHistory();
  const [isLoading, setLoading] = useState(false);

  function handleDeleteClick(matchId) {
    setLoading(true);
    API.deleteMatch(matchId)
		.then((response) => {
      setDeleteResponse({
        message: response.data.message,
        status: response.status
      });
      Lib.removeByAttr(appMatchesOnLoad, 'matchId', matchId);
      setLoading(false);
		})
		.catch(() => {
      setDeleteResponse({
        message: "Something went wrong. Try again.",
        status: 500
      });
      setLoading(false);
		});
  }

  function handleCloseClick() {
    setDeleteResponse({});
    setDeleteModalShow(false);
    history.push(`/usermatches/${userDataObj.uid}`);
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
          {deleteResponse.status === 200 || deleteResponse.status === 500 ? (
            `${ deleteResponse.message }`
          ) : (
            "Are you sure you want to delete this match?"
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        {deleteResponse.status === 200 || deleteResponse.status === 500 ?
          <Button 
          onClick={ () => handleCloseClick() }
          variant="outline-success"
          >
            Close
          </Button>
        :
          <Button 
          onClick={ () => handleDeleteClick(match.matchId) }
          variant="outline-success"
          >
          {isLoading ?
            <Spinner animation="border" variant="light" /> 
          :
            'Delete'
          }
          </Button>
        }
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default DeleteModal;