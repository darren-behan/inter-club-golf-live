import React, { useContext, useState } from 'react';
import './index.css';
import DataAreaContext from '../../utils/DataAreaContext';
import Lib from '../../utils/Lib';
import { Offcanvas, Button, Form, FloatingLabel } from 'react-bootstrap';
import { orderBy } from "lodash";
import moment from 'moment';
let isEmpty = require('lodash.isempty');

function FiltersOffCanvas(props) {
  const { showFilters, setShowFilters, setFilterValue, filterValue } = useContext(DataAreaContext);
  const [filterObject, setFilterObject] = useState({
    year: moment().format('YYYY'),
    region: "",
    round: "",
    golfClub: ""
  });
  let golfClubListByYear;

  if (filterValue.year === filterObject.year) {
    golfClubListByYear = props.matches.filter(function(match) {
      if (filterValue.year === moment(match.matchDateTime).format('YYYY')) {
        return match;
      }
    });
  } else {
    golfClubListByYear = props.matches.filter(function(match) {
      if (filterObject.year === moment(match.matchDateTime).format('YYYY')) {
        return match;
      }
    });
  };

  let golfClubsTeamOneName = golfClubListByYear.map(({ teamOneName }) => teamOneName);
  let golfClubsTeamTwoName = golfClubListByYear.map(({ teamTwoName }) => teamTwoName);
  let golfClubs = golfClubsTeamOneName.concat(golfClubsTeamTwoName);
  let removedDuplicateGolfClubs = Lib.eliminateDuplicates(golfClubs);
  let sortedGolfClubs = removedDuplicateGolfClubs.sort();

  let matchYears = Lib.eliminateDuplicates(orderBy(props.matches, "matchDateTime", "asc").map(({ matchDateTime }) => moment(matchDateTime).format('YYYY'))).sort(function(a, b) {
    return b - a;
  });

  let matchRegions = golfClubListByYear.map(({ competitionConcatRegion }) => competitionConcatRegion);
  let removedDuplicateMatchRegions = Lib.eliminateDuplicates(matchRegions);
  let sortedMatchRegions = removedDuplicateMatchRegions.sort();

  let matchRounds = golfClubListByYear.map(({ competitionRound }) => competitionRound.round);
  let removedDuplicateMatchRounds = Lib.eliminateDuplicates(matchRounds);
  let sortedMatchRounds = removedDuplicateMatchRounds.sort();

  // Handles updating component state when the user types into the input field
  function handleInputChange(event, key) {
    event.preventDefault();

    if (key === "year") {
      setFilterValue({...filterValue,
        "golfClub": "",
        "region": "",
        "round": ""
      });
      setFilterObject({
        year: event.target.value,
        region: "",
        round: "",
        golfClub: ""
      });
    } else {
      setFilterObject({...filterObject, [key]: event.target.value});
    }
  };

  function handleApplyFiltersSubmit(event) {
    event.preventDefault();
    setFilterValue({...filterObject});
    setShowFilters(false);
  };

  const handleClose = () => {
    setFilterValue({
      year: moment().format('YYYY'),
      region: "",
      round: "",
      golfClub: ""
    });
    setFilterObject({
      year: moment().format('YYYY'),
      region: "",
      round: "",
      golfClub: ""
    });
    setShowFilters(false);
  };

  function handleClearFiltersSubmit(event) {
    event.preventDefault();
    setFilterValue({
      year: moment().format('YYYY'),
      region: "",
      round: "",
      golfClub: ""
    });
    setFilterObject({
      year: moment().format('YYYY'),
      region: "",
      round: "",
      golfClub: ""
    });
    setShowFilters(false);
  };
  
  return (
    <>
    <Offcanvas show={showFilters} onHide={handleClose}>
      <Offcanvas.Header>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form>
          <FloatingLabel controlId="floatingSelect" label="Filter by year">
            <Form.Select aria-label="Filter by year" onChange={(e) => handleInputChange(e, "year")}>
              <option>{filterValue.year}</option>
              {matchYears.map(function(year) {
                if (filterValue.year !== year) {
                  return (
                    <option value={year}>{year}</option>
                  )
                }
              })}
            </Form.Select>
          </FloatingLabel>
          <br />
          <FloatingLabel controlId="floatingSelect" label="Filter by region">
            <Form.Select aria-label="Filter by region" onChange={(e) => handleInputChange(e, "region")}>
              {filterValue.year === filterObject.year ? (
                <>
                {!isEmpty(filterValue.region) ?
                  <>
                  <option>{Lib.capitalize(filterValue.region)}</option>
                  <option>{""}</option>
                  </>
                  :
                  <option>{""}</option>
                }
                {sortedMatchRegions.map(function(region) {
                  if (filterValue.region !== region) {
                    return (
                      <option value={region}>{Lib.capitalize(region)}</option>
                    )
                  }
                })}
                </>
              ) : (
                <>
                {!isEmpty(filterObject.region) ?
                  <>
                  <option>{Lib.capitalize(filterObject.region)}</option>
                  <option>{""}</option>
                  </>
                  :
                  <option>{""}</option>
                }
                {sortedMatchRegions.map(function(region) {
                  if (filterObject.region !== region) {
                    return (
                      <option value={region}>{Lib.capitalize(region)}</option>
                    )
                  }
                })}
                </>
              )}
            </Form.Select>
          </FloatingLabel>
          <br />
          <FloatingLabel controlId="floatingSelect" label="Filter by round">
            <Form.Select aria-label="Filter by round" onChange={(e) => handleInputChange(e, "round")}>
              {filterValue.year === filterObject.year ? (
                <>
                {!isEmpty(filterValue.round) ?
                  <>
                  <option>{Lib.capitalize(filterValue.round)}</option>
                  <option>{""}</option>
                  </>
                  :
                  <option>{""}</option>
                }
                {sortedMatchRounds.map(function(round) {
                  if (filterValue.round !== round) {
                    return (
                      <option value={round}>{Lib.capitalize(round)}</option>
                    )
                  }
                })}
                </>
              ) : (
                <>
                {!isEmpty(filterObject.round) ?
                  <>
                  <option>{Lib.capitalize(filterObject.round)}</option>
                  <option>{""}</option>
                  </>
                  :
                  <option>{""}</option>
                }
                {sortedMatchRounds.map(function(round) {
                  if (filterObject.round !== round) {
                    return (
                      <option value={round}>{Lib.capitalize(round)}</option>
                    )
                  }
                })}
                </>
              )}
            </Form.Select>
          </FloatingLabel>
          <br />
          <FloatingLabel controlId="floatingSelect" label="Filter matches by golf club">
            <Form.Select aria-label="Filter matches by golf club" onChange={(e) => handleInputChange(e, "golfClub")}>
              {filterValue.year === filterObject.year ? (
                <>
                {!isEmpty(filterValue.golfClub) ?
                  <>
                  <option>{Lib.capitalize(filterValue.golfClub)}</option>
                  <option>{""}</option>
                  </>
                  :
                  <option>{""}</option>
                }
                {sortedGolfClubs.map(function(golfClub) {
                  if (filterValue.golfClub !== golfClub) {
                    return (
                      <option value={golfClub}>{Lib.capitalize(golfClub)}</option>
                    )
                  }
                })}
                </>
              ) : (
                <>
                {!isEmpty(filterObject.golfClub) ?
                  <>
                  <option>{Lib.capitalize(filterObject.golfClub)}</option>
                  <option>{""}</option>
                  </>
                  :
                  <option>{""}</option>
                }
                {sortedGolfClubs.map(function(golfClub) {
                  if (filterObject.golfClub !== golfClub) {
                    return (
                      <option value={golfClub}>{Lib.capitalize(golfClub)}</option>
                    )
                  }
                })}
                </>
              )}
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