import React, { useContext } from 'react';
import DataAreaContext from '../../../utils/DataAreaContext';
import {
  useHistory
} from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import 'moment-timezone';

function SignUpModal(props) {
	let history = useHistory();
  const { signUpResponse, setSignUpModalShow } = useContext(DataAreaContext);
  
  const onClick = (e) => {
    e.preventDefault();
    if (signUpResponse === 400) {
      history.push('/login');
    } else {
      history.push('/');
    }
    setSignUpModalShow(false);
  };

  return (
    <>
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="true"
    >
      <Modal.Header closeButton />
      <Modal.Body>
        { signUpResponse.message }
      </Modal.Body>
      <Modal.Footer>
        {signUpResponse.status === 200 ?
          <Button 
          onClick={onClick}
          variant="outline-success"
          >
            Close
          </Button>
          :
          <Button
          variant="outline-success"
          onClick={onClick}
          >
            Login
          </Button>
        }
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default SignUpModal;