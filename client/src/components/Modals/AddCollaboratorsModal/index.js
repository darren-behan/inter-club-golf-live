import React, { useContext, useEffect, useState } from 'react';
import DataAreaContext from '../../../utils/DataAreaContext';
import API from '../../../utils/API';
import AddCollaboratorsForm from '../../AddCollaboratorsForm/index.js';
import { Button, Modal, Spinner, CloseButton } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment-timezone';
let isEmpty = require('lodash.isempty');

function AddCollaboratorsModal(props) {
  const { appMatchesOnLoad, match, setMatchObj, collaboratorsUpdateResponse, setCollaboratorsUpdateResponse, setAddCollaboratorsModalShow, collaborators, setCollaborators } = useContext(DataAreaContext);
	let history = useHistory();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setCollaborators([...match.collaborators]);
  }, []);

  const handleClose = () => {
    setAddCollaboratorsModalShow(false);
    setCollaborators([...match.collaborators]);
  }

  const isEmail = (email) => {
    const emailRegEx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true;
    else return false;
  };

  const handleAddCollaboratorsClick = (event) => {
    event.preventDefault();
    setLoading(true);
    
    let requestArr = [];
    let collaboratorsFiltered = collaborators.filter((collab, i) => {
      let emailKey = "email" + (i+1);
      if (collab[emailKey] !== "" && isEmail(collab[emailKey])) {
        requestArr.push(collab[emailKey]);
        return collab;
      };
    });

    API.getUsers({email: requestArr})
    .then((getUsersResult) => {
      collaboratorsFiltered.filter((collab, i) => {
        let emailKey = "email" + (i+1);
        getUsersResult.data.users.filter(users => {
          if (collab[emailKey] === users.email) {
            collab.userId = users.uid;
				    collab["dateUpdated"] = moment().format();
          }
        });


        getUsersResult.data.notFound.filter(users => {
          if (collab[emailKey] === users.email) {
            collaboratorsFiltered.splice(i, 1);
          }
        });
      })
      setCollaborators([...collaboratorsFiltered]);
    })
    .then(() => {
      API.updateMatch({
        matchId: match.matchId,
        collaborators: collaboratorsFiltered,
        updatedAt: moment().format()
      })
      .then((response) => {
        setCollaboratorsUpdateResponse({
          message: response.data.message,
          status: response.status
        });
        setMatchObj({...match, "collaborators": collaboratorsFiltered, "updatedAt": moment().format()});
        for (let i = 0; i < appMatchesOnLoad.length; i++) {
          if(appMatchesOnLoad[i].matchId === match.matchId) {
            appMatchesOnLoad[i].collaborators = collaboratorsFiltered;
            appMatchesOnLoad[i].updatedAt = moment().format();
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setCollaboratorsUpdateResponse({
          message: error.message,
          status: 400
        });
      });
    })
    .catch((error) => {
      setCollaboratorsUpdateResponse({
        message: error.message,
        status: 400
      });
    });
  };

  const handleCloseClick = (matchId) => {
    setAddCollaboratorsModalShow(false);
    setCollaboratorsUpdateResponse({});
    history.push(`/match/${matchId}`);
  }

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
          {collaboratorsUpdateResponse.status === 200 || collaboratorsUpdateResponse.status === 400 ? (
            "Collaborators added"
          ) : (
            "Add up to 5 Collaborators"
          )}
        </Modal.Title>
        <CloseButton onClick={handleClose} />
      </Modal.Header>
      <Modal.Body>
        {collaboratorsUpdateResponse.status === 200 || collaboratorsUpdateResponse.status === 400 ? (
          `${ collaboratorsUpdateResponse.message }`
        ) : (
          <AddCollaboratorsForm 
            matchCollaborators={collaborators}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        {collaboratorsUpdateResponse.status === 200 || collaboratorsUpdateResponse.status === 400 ?
          <Button 
          onClick={ () => handleCloseClick(match.matchId) }
          variant="outline-success"
          >
            Close
          </Button>
          :
          <Button
          onClick={ (e) => handleAddCollaboratorsClick(e) }
          variant="outline-success"
          >
          {isLoading ?
            <Spinner animation="border" style={{ color: "#0a66c2" }} /> 
          :
            'Add Collaborators'
          }
          </Button>
        }
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default AddCollaboratorsModal;