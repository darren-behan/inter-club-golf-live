import React, { useContext, useState } from 'react';
import DataAreaContext from '../../../utils/DataAreaContext';
import LocalStorage from '../../../services/LocalStorage/LocalStorage.service';
import { Button, Modal, Form, Spinner, CloseButton } from 'react-bootstrap';
import 'moment-timezone';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

function ReauthenticateUserModal(props) {
  const {
    loginDataObj,
    setLoginDataObj,
    userAuthResponse,
    setIsAuthenticated,
    setUserDataObj,
    setUserAuthResponse,
  } = useContext(DataAreaContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsLoading(false);
    setUserAuthResponse({});
    setUserDataObj({});
    setIsAuthenticated(false);
    props.setReauthenticateUserModalShow(false);
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setLoginDataObj({ ...loginDataObj, [name]: value });
  };

  const handleReauthenticationSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const credential = EmailAuthProvider.credential(loginDataObj.email, loginDataObj.password);
    reauthenticateWithCredential(props.user, credential)
      .then((response) => {
        setIsAuthenticated(true);
        setUserDataObj(response.user);
        LocalStorage.set('AuthToken', `Bearer ${response.user.stsTokenManager.accessToken}`);
        setIsLoading(false);
        setLoginDataObj({});
        setUserAuthResponse({
          message: 'You have successfully logged in. Click the close button so you can reset your password.',
          status: 200,
        });
      })
      .catch((error) => {
        setUserAuthResponse({
          message: error.message,
          status: 400,
        });
        setLoginDataObj({});
        setIsLoading(false);
      });
  };

  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header>
          {userAuthResponse.status === 200 ? (
            <Modal.Title id="contained-modal-title-vcenter">Successfully reauthenticated</Modal.Title>
          ) : (
            <>
              <Modal.Title id="contained-modal-title-vcenter">
                We need you to reauthenticate by logging in again in order to update your password
              </Modal.Title>
            </>
          )}
          <CloseButton onClick={handleClose} />
        </Modal.Header>
        <Modal.Body>
          <Form>
            {userAuthResponse.status === 200 ? (
              <Form.Text id="passwordHelpBlock" className="mb-2" style={{ color: '#50C878' }}>
                {userAuthResponse.message}
              </Form.Text>
            ) : (
              <>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" name="password" onChange={handleInputChange} />
                </Form.Group>
              </>
            )}
            {userAuthResponse.status === 400 ? (
              <Form.Text id="passwordHelpBlock" style={{ color: '#EE4B2B' }}>
                {userAuthResponse.message}
              </Form.Text>
            ) : null}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {userAuthResponse.status === 200 ? (
            <Button onClick={() => props.setReauthenticateUserModalShow(false)} variant="outline-success">
              Close
            </Button>
          ) : (
            <Button onClick={(e) => handleReauthenticationSubmit(e)} variant="outline-success">
              {isLoading ? <Spinner animation="border" style={{ color: '#0a66c2' }} /> : 'Login'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReauthenticateUserModal;
