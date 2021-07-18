import React, { useContext } from 'react';
import DataAreaContext from '../../../utils/DataAreaContext';
import {
  useHistory
} from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import 'moment-timezone';

function CreateMatchModal(props) {
	let history = useHistory();
  const { createMatchResponse, setCreateMatchModalShow } = useContext(DataAreaContext);
  
  const onClick = (e) => {
    e.preventDefault();
    if (createMatchResponse.status === 200) {
      const path = "/match/" + createMatchResponse.matchId;
      history.push(path);
      setCreateMatchModalShow(false);
    } else {
      setCreateMatchModalShow(false);
    }
  };

  return (
    <>
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header />
      <Modal.Body>
        { createMatchResponse.message }
      </Modal.Body>
      <Modal.Footer>
        {createMatchResponse.status === 200 ?
          <Button 
          onClick={onClick}
          variant="outline-success"
          >
            Close
          </Button>
          :
          <Button
          variant="outline-danger"
          onClick={onClick}
          >
            Close
          </Button>
        }
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default CreateMatchModal;