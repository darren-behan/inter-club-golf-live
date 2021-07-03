import React, { useContext } from 'react';
import DataAreaContext from '../../../utils/DataAreaContext';
import {
  BrowserRouter as Link,
  useHistory
} from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import 'moment-timezone';

function SignUpModal(props) {
	let history = useHistory();
  const { signUpRequestErrors, setSignUpModalShow } = useContext(DataAreaContext);
  
  const onClick = (e) => {
    e.preventDefault();
    history.push('/login');
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
        { signUpRequestErrors.message }
      </Modal.Body>
      <Modal.Footer>
        <Button
        variant="outline-success"
        onClick={onClick}
        >
          Login
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default SignUpModal;