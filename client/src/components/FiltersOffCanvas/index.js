import React, { useContext } from 'react';
import './index.css';
import DataAreaContext from '../../utils/DataAreaContext';
import { Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlasses } from '@fortawesome/free-solid-svg-icons';

function FiltersOffCanvas() {
  const { showFilters, setShowFilters, setFilterValue } = useContext(DataAreaContext);
  const handleClose = () => setShowFilters(false);

  // Handles updating component state when the user types into the input field
  function handleInputChange(event) {
    setFilterValue(event.target.value);
  };
  
  return (
    <>
    <Offcanvas show={showFilters} onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        No filters available yet
      </Offcanvas.Body>
    </Offcanvas>
    </>
  );
}

export default FiltersOffCanvas;