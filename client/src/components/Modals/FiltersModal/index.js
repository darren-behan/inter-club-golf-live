import React, { useContext } from 'react';
import './index.css';
import DataAreaContext from '../../../utils/DataAreaContext';
import { Modal, Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlasses } from '@fortawesome/free-solid-svg-icons';

function FiltersModal() {
  const { show, setShow, setFilterValue } = useContext(DataAreaContext);
  const handleClose = () => setShow(false);

  // Handles updating component state when the user types into the input field
  function handleInputChange(event) {
    setFilterValue(event.target.value);
  };
  
  return (
    <>
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form inline className="navbar-form" id="form-inline">
          <InputGroup className="search-box">
            <FormControl type="text" className="m-3 m-sm-0" id="search" placeholder="Filter by competition" style={{ backgroundColor: '#eef3f8', border: 'none' }} onChange={ handleInputChange }/>
            <span className="input-group-addon m-3 m-sm-0"><FontAwesomeIcon icon={ faGlasses } style={{ color: 'green' }}/></span>
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default FiltersModal;