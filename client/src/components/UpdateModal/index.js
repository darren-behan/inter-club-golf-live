import React, { useContext } from 'react';
import DataAreaContext from '../../utils/DataAreaContext';
import { Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function UpdateModal(props) {
  const { setUpdateModalShow, userDataObj, deleteResponse } = useContext(DataAreaContext);
	let history = useHistory();

  function handleClick() {
    if (deleteResponse.status === 200) {
      setUpdateModalShow(false);
      history.push(`/usermatches/${userDataObj.uid}`);
    } else {
      setUpdateModalShow(false);
    }
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

export default UpdateModal;