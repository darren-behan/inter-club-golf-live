import React, { useContext } from 'react';
import DataAreaContext from '../../utils/DataAreaContext';
import { Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function DeleteModal(props) {
  const { setDeleteModalShow, userDataObj, deleteResponse } = useContext(DataAreaContext);
	let history = useHistory();

  function handleClick() {
    if (deleteResponse.status === 200) {
      setDeleteModalShow(false);
      history.push(`/usermatches/${userDataObj.uid}`);
    } else {
      setDeleteModalShow(false);
    }
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
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          { deleteResponse.message }
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button 
        onClick={ () => handleClick() }
        variant="outline-success"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default DeleteModal;