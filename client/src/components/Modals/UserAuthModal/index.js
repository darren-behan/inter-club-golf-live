import React, { useContext } from 'react';
import DataAreaContext from '../../../utils/DataAreaContext';
import {
  useHistory
} from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import 'moment-timezone';

function SignUpModal(props) {
	let history = useHistory();
  const { userAuthResponse, setSignUpObj, setUserAuthModalShow, setLoginDataObj, setForm } = useContext(DataAreaContext);
  
  const onClick = (e) => {
    e.preventDefault();
    history.push('/login');
    setUserAuthModalShow(false);
    setSignUpObj({});
    setLoginDataObj({
      email: "",
      password: ""});
    setForm(true);
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
        { userAuthResponse.message }
      </Modal.Body>
      <Modal.Footer>
        <Button 
        onClick={onClick}
        variant="outline-success"
        >
          {userAuthResponse.status === 400 ? "Close" : "Login"}
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default SignUpModal;