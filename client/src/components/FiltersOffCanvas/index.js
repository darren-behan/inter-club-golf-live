import React, { useContext } from 'react';
import './index.css';
import DataAreaContext from '../../utils/DataAreaContext';
import Lib from '../../utils/Lib';
import { Offcanvas, Button, Form, FloatingLabel } from 'react-bootstrap';

function FiltersOffCanvas(props) {
  const { showFilters, setShowFilters, setFilterValue } = useContext(DataAreaContext);
  const handleClose = () => setShowFilters(false);

  function submitHandler(e) {
    e.preventDefault();
  }

  // Handles updating component state when the user types into the input field
  function handleInputChange(event) {
    event.preventDefault();
    setFilterValue(event.target.value);
  };

  function handleApplyFiltersSubmit(event) {
    event.preventDefault();
    setShowFilters(false);
  };

  function handleClearFiltersSubmit(event) {
    event.preventDefault();
    setFilterValue("");
    setShowFilters(false);
  };

  let golfClubsTeamOneName = props.matches.map(({ teamOneName }) => teamOneName);
  let golfClubsTeamTwoName = props.matches.map(({ teamTwoName }) => teamTwoName);
  let golfClubs = golfClubsTeamOneName.concat(golfClubsTeamTwoName);

  const removedDuplicateGolfClubs = Lib.eliminateDuplicates(golfClubs);
  const sortedGolfClubs = removedDuplicateGolfClubs.sort();
  
  return (
    <>
    <Offcanvas show={showFilters} onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={(e) => submitHandler(e)}>
          <FloatingLabel controlId="floatingSelect" label="Filter competition matches by golf club">
            <Form.Select aria-label="Filter competition matches by golf club" onChange={(e) => handleInputChange(e)}>
              <option>{""}</option>
              {sortedGolfClubs.map(function(golfClub) {
                return (
                  <option value={golfClub}>{Lib.capitalize(golfClub)}</option>
                )
              })}
            </Form.Select>
          </FloatingLabel>
          <br />
          <Button variant="outline-primary" onClick={handleApplyFiltersSubmit} className="me-2">
            Apply filters
          </Button>
          <Button variant="outline-danger" onClick={handleClearFiltersSubmit} className="me-2">
            Clear filters
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
    </>
  );
}

export default FiltersOffCanvas;