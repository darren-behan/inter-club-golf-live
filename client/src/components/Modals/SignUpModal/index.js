import React, { useContext } from 'react';
import DataAreaContext from '../../../utils/DataAreaContext';
import {
  useHistory
} from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import 'moment-timezone';

function SignUpModal(props) {
	let history = useHistory();
  const { signUpResponse, setSignUpModalShow, setSignUpObj } = useContext(DataAreaContext);
  
  const onClick = (e) => {
    e.preventDefault();
    if (signUpResponse.status === 400) {
      history.push('/login');
    } else {
      history.push('/');
    }
    setSignUpModalShow(false);
    setSignUpObj({});
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