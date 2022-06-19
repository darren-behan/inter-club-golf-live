import React, { useContext, useEffect, useState } from 'react';
import DataAreaContext from '../../../utils/DataAreaContext';
import API from '../../../utils/API';
import AddCollaboratorsForm from '../../AddCollaboratorsForm/index.js';
import { Button, Modal, Spinner, CloseButton } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment-timezone';
let isEmpty = require('lodash.isempty');
const { getToken } = require('firebase/app-check');

function AddCollaboratorsModal(props) {
  const {
    appMatchesOnLoad,
    match,
    setMatchObj,
    collaboratorsUpdateResponse,
    setCollaboratorsUpdateResponse,
    setAddCollaboratorsModalShow,
    collaborators,
    setCollaborators,
    isCollaboratorsEdited,
    setIsCollaboratorsEdited,
    appCheck,
  } = useContext(DataAreaContext);
  let history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [collaboratorsNotFound, setCollaboratorsNotFound] = useState('');

  useEffect(() => {
    setCollaborators(JSON.parse(JSON.stringify({ ...match })));
  }, []);

  const handleClose = () => {
    setAddCollaboratorsModalShow(false);
    setCollaboratorsUpdateResponse({});
    setCollaboratorsNotFound('');
    setIsCollaboratorsEdited(true);
    setCollaborators(JSON.parse(JSON.stringify({ ...match })));
  };

  const isEmail = (email) => {
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true;
    else return false;
  };

  const handleAddCollaboratorsClick = async (event) => {
    event.preventDefault();
    setLoading(true);

    let appCheckTokenResponse;
    try {
      appCheckTokenResponse = await getToken(appCheck, /* forceRefresh= */ false);
    } catch (err) {
      console.log(JSON.stringify(err));
      return;
    }

    let requestArr = [];
    collaborators.collaborators.map((collab, i) => {
      if (collab['email'] !== '' && isEmail(collab['email'])) {
        requestArr.push(collab['email']);
      }
    });

    if (!isEmpty(requestArr)) {
      API.getUsers({ email: requestArr }, appCheckTokenResponse.token)
        .then((getUsersResult) => {
          let collabsNotFound = '';

          collaborators.collaborators.filter((collab, i) => {
            if (!isEmpty(getUsersResult.data.users)) {
              getUsersResult.data.users.filter((users) => {
                if (collab['email'] === users.email) {
                  collab.userId = users.uid;
                  collab['dateUpdated'] = moment().format();
                }
              });
            }

            if (!isEmpty(getUsersResult.data.notFound)) {
              getUsersResult.data.notFound.filter((users) => {
                if (collab['email'] === users.email) {
                  collabsNotFound += users.email + ', ';
                  collab['dateUpdated'] = moment().format();
                  collab['email'] = '';
                  collab['userId'] = '';
                }
              });
            }

            if (isEmpty(collab['email'])) {
              collab['dateUpdated'] = moment().format();
              collab['email'] = '';
              collab['userId'] = '';
            }
          });

          setCollaborators(JSON.parse(JSON.stringify({ ...collaborators })));
          setCollaboratorsNotFound(collabsNotFound);
        })
        .then(() => {
          API.updateMatch(
            {
              matchId: match.matchId,
              collaborators: collaborators.collaborators,
              updatedAt: moment().format(),
            },
            appCheckTokenResponse.token,
          )
            .then((response) => {
              setCollaboratorsUpdateResponse({
                message: response.data.message,
                status: response.status,
              });
              setMatchObj({ ...match, collaborators: collaborators.collaborators, updatedAt: moment().format() });
              for (let i = 0; i < appMatchesOnLoad.length; i++) {
                if (appMatchesOnLoad[i].matchId === match.matchId) {
                  appMatchesOnLoad[i].collaborators = collaborators.collaborators;
                  appMatchesOnLoad[i].updatedAt = moment().format();
                }
              }
              setLoading(false);
            })
            .catch((error) => {
              setCollaboratorsUpdateResponse({
                message: error.message,
                status: 400,
              });
            });
        })
        .catch((error) => {
          setCollaboratorsUpdateResponse({
            message: error.message,
            status: 400,
          });
        });
    } else {
      API.updateMatch(
        {
          matchId: match.matchId,
          collaborators: [],
          updatedAt: moment().format(),
        },
        appCheckTokenResponse.token,
      )
        .then((response) => {
          setCollaboratorsUpdateResponse({
            message: response.data.message,
            status: response.status,
          });
          setMatchObj({ ...match, collaborators: [], updatedAt: moment().format() });
          for (let i = 0; i < appMatchesOnLoad.length; i++) {
            if (appMatchesOnLoad[i].matchId === match.matchId) {
              appMatchesOnLoad[i].collaborators = collaborators;
              appMatchesOnLoad[i].updatedAt = moment().format();
            }
          }
          setCollaborators({ ...collaborators, collaborators: [], updatedAt: moment().format() });
          setLoading(false);
        })
        .catch((error) => {
          setCollaboratorsUpdateResponse({
            message: error.message,
            status: 400,
          });
        });
    }
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
          <Modal.Title id="contained-modal-title-vcenter">
            {collaboratorsUpdateResponse.status === 200
              ? 'Collaborators added'
              : collaboratorsUpdateResponse.status === 400
              ? 'Something went wrong'
              : 'Add up to 5 Collaborators'}
          </Modal.Title>
          <CloseButton onClick={handleClose} />
        </Modal.Header>
        <Modal.Body>
          {collaboratorsUpdateResponse.status === 200 ? (
            <>
              {isEmpty(collaboratorsNotFound)
                ? `${collaboratorsUpdateResponse.message}.`
                : `${collaboratorsUpdateResponse.message}.\n
              The following email/s ${collaboratorsNotFound} are not registered user/s & are unable to be added as collaborators at this stage.\n
              To be eligible to be added as a collaborator, the email is required to be a registered user.`}
            </>
          ) : collaboratorsUpdateResponse.status === 400 ? (
            'Something went wrong, please refresh the page and try again'
          ) : (
            <AddCollaboratorsForm matchCollaborators={collaborators} />
          )}
        </Modal.Body>
        {collaboratorsUpdateResponse.status === 200 || collaboratorsUpdateResponse.status === 400 ? null : (
          <Modal.Footer>
            <Button
              onClick={(e) => handleAddCollaboratorsClick(e)}
              variant="outline-success"
              disabled={isCollaboratorsEdited}
            >
              {isLoading ? <Spinner animation="border" style={{ color: '#0a66c2' }} /> : 'Add Collaborators'}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default AddCollaboratorsModal;
