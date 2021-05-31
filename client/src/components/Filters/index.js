import React, { useContext } from 'react';
import './index.css';
import DataAreaContext from '../../utils/DataAreaContext';
import { Collapse, Form, FormControl, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlasses } from '@fortawesome/free-solid-svg-icons';

function Filters() {
  const { isActive, setFilterValue } = useContext(DataAreaContext);

  // Handles updating component state when the user types into the input field
  function handleInputChange(event) {
    setFilterValue(event.target.value);
  };
  
  return (
    <>
    <Collapse in={isActive} style={{ margin: '1rem 1rem' }}>
      <Form inline className="navbar-form" id="form-inline">
        <InputGroup className="search-box">
          <FormControl type="text" id="search" placeholder="Filter by competition" style={{ backgroundColor: '#eef3f8', border: 'none' }} onChange={ handleInputChange }/>
          <span className="input-group-addon"><FontAwesomeIcon icon={ faGlasses } style={{ color: 'green' }}/></span>
        </InputGroup>
      </Form>
    </Collapse>
    </>
  );
}

export default Filters;