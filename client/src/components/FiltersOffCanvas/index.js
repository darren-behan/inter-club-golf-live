import React, { useContext, useEffect } from 'react';
import './index.css';
import DataAreaContext from '../../utils/DataAreaContext';
import Lib from '../../utils/Lib';
import { Offcanvas, Button, Form, FloatingLabel } from 'react-bootstrap';
import { orderBy } from 'lodash';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
let isEmpty = require('lodash.isempty');

function FiltersOffCanvas(props) {
  const { showFilters, setShowFilters, setFilterValue, filterValue, setIsShowTooltip } = useContext(DataAreaContext);
  let location = useLocation();
  let matchYears;
  let matchListByYear;
  let sortedMatchRegions;
  let sortedMatchRounds;
  let sortedGolfClubs;

  useEffect(() => {
    setIsShowTooltip(false);
    setFilterValue({
      year: moment().format('YYYY'),
      region: '',
      round: '',
      golfClub: '',
    });
  }, []);

  // building data points for each filter when only year is set
  // populate the year filter with current year (even if there are no matches for that year) and years where matches exist

  if (isEmpty(props.matches)) props.matches = [];
  // populate the regions where matches were played in the selected year
  matchYears = Lib.eliminateDuplicates(
    orderBy(props.matches, 'matchDateTime', 'asc').map(({ matchDateTime }) => moment(matchDateTime).format('YYYY')),
  ).sort(function (a, b) {
    return b - a;
  });
  if (!matchYears.includes(moment().format('YYYY'))) matchYears.push(moment().format('YYYY'));
  matchListByYear = props.matches.filter(function (match) {
    if (filterValue.year === moment(match.matchDateTime).format('YYYY')) {
      return match;
    }
  });

  let matchRegions = matchListByYear.map(({ competitionConcatRegion }) => competitionConcatRegion);
  let removedDuplicateMatchRegions = Lib.eliminateDuplicates(matchRegions);
  sortedMatchRegions = removedDuplicateMatchRegions.sort();

  let matchRounds = matchListByYear
    .filter((match) => {
      // filter by region, round, & golf club - show rounds available for the region selected
      if (!isEmpty(filterValue.region) && !isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
        if (match.competitionConcatRegion === filterValue.region) {
          return true;
        }
      }

      // filter by region & golf club with no round selected - we still want to show all rounds for the region & golf club selected
      if (!isEmpty(filterValue.region) && isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
        if (
          match.competitionConcatRegion === filterValue.region &&
          (filterValue.golfClub === match.teamOneName.toLowerCase() ||
            filterValue.golfClub === match.teamTwoName.toLowerCase())
        ) {
          return true;
        }
      }

      // filter by region & round with no golf club selected - we still want to show all rounds for the region selected
      if (!isEmpty(filterValue.region) && !isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) {
        if (match.competitionConcatRegion === filterValue.region) {
          return true;
        }
      }

      // filter by round & golf club with no region selected - we still want to show all rounds for the golf club selected
      if (isEmpty(filterValue.region) && !isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
        if (
          filterValue.golfClub === match.teamOneName.toLowerCase() ||
          filterValue.golfClub === match.teamTwoName.toLowerCase()
        ) {
          return true;
        }
      }

      // filter by region
      if (!isEmpty(filterValue.region) && isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) {
        if (match.competitionConcatRegion === filterValue.region) {
          return true;
        }
      }

      // filter by round
      if (isEmpty(filterValue.region) && !isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) {
        return true;
      }

      // filter by golf club
      if (isEmpty(filterValue.region) && isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
        if (
          filterValue.golfClub === match.teamOneName.toLowerCase() ||
          filterValue.golfClub === match.teamTwoName.toLowerCase()
        ) {
          return true;
        }
      }

      // no filters
      if (isEmpty(filterValue.region) && isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) {
        return true;
      }
    })
    .map((match) => match.competitionRound.round);
  let removedDuplicateMatchRounds = Lib.eliminateDuplicates(matchRounds);
  sortedMatchRounds = removedDuplicateMatchRounds.sort();

  let golfClubsByRegionRound = matchListByYear.filter((match) => {
    // if all 3 filters are selected, we return all golf clubs available for the region and round
    if (!isEmpty(filterValue.region) && !isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
      if (match.competitionConcatRegion === filterValue.region && match.competitionRound.round === filterValue.round) {
        return true;
      }
    }

    // filter by region & round
    if (!isEmpty(filterValue.region) && !isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) {
      if (match.competitionConcatRegion === filterValue.region && match.competitionRound.round === filterValue.round) {
        return true;
      }
    }

    // filter by region or by region & golf club
    if (
      (!isEmpty(filterValue.region) && isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) ||
      (!isEmpty(filterValue.region) && isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub))
    ) {
      if (match.competitionConcatRegion === filterValue.region) {
        return true;
      }
    }

    // filter by round or by round & golf club
    if (
      (isEmpty(filterValue.region) && !isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) ||
      (isEmpty(filterValue.region) && !isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub))
    ) {
      if (match.competitionRound.round === filterValue.round) {
        return true;
      }
    }

    // filter by golf club
    if (isEmpty(filterValue.region) && isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
      return true;
    }

    // no filters
    if (isEmpty(filterValue.region) && isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) {
      return true;
    }
  });
  let golfClubsTeamOneName = golfClubsByRegionRound.map(({ teamOneName }) => teamOneName.toLowerCase());
  let golfClubsTeamTwoName = golfClubsByRegionRound.map(({ teamTwoName }) => teamTwoName.toLowerCase());
  let golfClubs = golfClubsTeamOneName.concat(golfClubsTeamTwoName);
  let removedDuplicateGolfClubNames = Lib.eliminateDuplicates(golfClubs);
  sortedGolfClubs = removedDuplicateGolfClubNames.sort();

  const isFilterRoundInNewFilterRegion = (newRegionFilterValue) => {
    let roundsByNewRegionFilterValue = matchListByYear
      .filter((match) => {
        if (match.competitionConcatRegion === newRegionFilterValue) {
          return true;
        }
      })
      .map((match) => match.competitionRound.round);

    if (!roundsByNewRegionFilterValue.includes(filterValue.round)) {
      return false;
    } else {
      return true;
    }
  };

  const isFilterGolfClubInNewFilterRegion = (newRegionFilterValue) => {
    let matchesByNewRegionFilterValue = matchListByYear.filter((match) => {
      if (match.competitionConcatRegion === newRegionFilterValue) {
        return true;
      }
    });
    let matchTeamOneName = matchesByNewRegionFilterValue.map(({ teamOneName }) => teamOneName.toLowerCase());
    let matchTeamTwoName = matchesByNewRegionFilterValue.map(({ teamTwoName }) => teamTwoName.toLowerCase());
    let golfClubs = matchTeamOneName.concat(matchTeamTwoName);
    let removedDuplicateGolfClubNames = Lib.eliminateDuplicates(golfClubs);

    if (!removedDuplicateGolfClubNames.includes(filterValue.golfClub)) {
      return false;
    } else {
      return true;
    }
  };

  const isFilterGolfClubInNewFilterRegionRound = (newRegionRoundFilterValue, key) => {
    let matchesByNewRegionRoundFilterValue;
    if (key === 'region') {
      matchesByNewRegionRoundFilterValue = matchListByYear.filter((match) => {
        if (
          match.competitionConcatRegion === newRegionRoundFilterValue &&
          match.competitionRound.round === filterValue.round
        ) {
          return true;
        }
      });
    } else if (key === 'round') {
      matchesByNewRegionRoundFilterValue = matchListByYear.filter((match) => {
        if (
          match.competitionConcatRegion === filterValue.region &&
          match.competitionRound.round === newRegionRoundFilterValue
        ) {
          return true;
        }
      });
    }
    let matchTeamOneName = matchesByNewRegionRoundFilterValue.map(({ teamOneName }) => teamOneName.toLowerCase());
    let matchTeamTwoName = matchesByNewRegionRoundFilterValue.map(({ teamTwoName }) => teamTwoName.toLowerCase());
    let golfClubs = matchTeamOneName.concat(matchTeamTwoName);
    let removedDuplicateGolfClubNames = Lib.eliminateDuplicates(golfClubs);

    if (!removedDuplicateGolfClubNames.includes(filterValue.golfClub)) {
      return false;
    } else {
      return true;
    }
  };

  function handleInputChange(event, key) {
    event.preventDefault();
    let eventValue = event.target.value.toLowerCase();

    switch (key) {
      case 'year':
        setFilterValue({ ...filterValue, year: eventValue, golfClub: '', region: '', round: '' });
        break;
      case 'region':
        filterValue.region = eventValue;

        // On change of region where region, round & golf club are selected, and the golf club is not in that region, we need to clear the golf club filter value
        if (!isEmpty(filterValue.region) && !isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
          if (!isFilterRoundInNewFilterRegion(eventValue)) filterValue.round = '';
          if (!isFilterGolfClubInNewFilterRegion(eventValue)) filterValue.golfClub = '';
          if (!isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
            if (!isFilterGolfClubInNewFilterRegionRound(eventValue, key)) filterValue.golfClub = '';
          }
        }

        // On change of region where region and round are selected, and the round is not in that region, we need to clear the round filter value
        if (!isEmpty(filterValue.region) && !isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) {
          if (!isFilterRoundInNewFilterRegion(eventValue)) filterValue.round = '';
        }

        // On change of region where region and golf club are selected, and the golf club is not in that region, we need to clear the round filter value
        if (!isEmpty(filterValue.region) && isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
          if (!isFilterGolfClubInNewFilterRegion(eventValue)) filterValue.golfClub = '';
        }

        setFilterValue({ ...filterValue, region: eventValue });
        break;
      case 'round':
        filterValue.round = eventValue;

        // On change of round where region, round and golf club are selected, and the golf club is not in that region and round, we need to clear the golf club filter value
        if (!isEmpty(filterValue.region) && !isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
          if (!isFilterGolfClubInNewFilterRegionRound(eventValue, key)) filterValue.golfClub = '';
        }

        setFilterValue({ ...filterValue, round: eventValue });
        break;
      case 'golfClub':
        setFilterValue({ ...filterValue, golfClub: eventValue });
        break;
      default:
        setFilterValue({ ...filterValue, [key]: event.target.value });
        break;
    }
  }

  function handleApplyFiltersSubmit(event) {
    event.preventDefault();
    setShowFilters(false);
  }

  const handleClose = () => {
    setShowFilters(false);
  };

  function handleClearFiltersSubmit(event) {
    event.preventDefault();

    if (location.pathname.startsWith('/competition')) {
      setFilterValue({
        year: moment().format('YYYY'),
        region: '',
        round: '',
        golfClub: '',
      });
    } else {
      setFilterValue({
        year: '',
        region: '',
        round: '',
        golfClub: '',
      });
    }
    setShowFilters(false);
  }

  return (
    <>
      <Offcanvas show={showFilters} onHide={handleClose}>
        <Offcanvas.Header>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <>
              <FloatingLabel controlId="floatingSelect" label="Filter by year">
                <Form.Select aria-label="Filter by year" onChange={(e) => handleInputChange(e, 'year')}>
                  <>
                    {!isEmpty(filterValue.year) ? <option selected>{filterValue.year}</option> : null}
                    <option value="">{''}</option>
                    {matchYears.map(function (year) {
                      if (filterValue.year !== year) {
                        return <option value={year}>{year}</option>;
                      }
                    })}
                  </>
                </Form.Select>
              </FloatingLabel>
              <br />
              <FloatingLabel controlId="floatingSelect" label="Filter by region">
                <Form.Select aria-label="Filter by region" onChange={(e) => handleInputChange(e, 'region')}>
                  <>
                    {!isEmpty(filterValue.region) ? (
                      <option selected>{Lib.capitalize(filterValue.region)}</option>
                    ) : null}
                    <option value="">{''}</option>
                    {sortedMatchRegions.map(function (region) {
                      if (filterValue.region !== region) {
                        return <option value={Lib.capitalize(region)}>{Lib.capitalize(region)}</option>;
                      }
                    })}
                  </>
                </Form.Select>
              </FloatingLabel>
              <br />
              <FloatingLabel controlId="floatingSelect" label="Filter by round">
                <Form.Select aria-label="Filter by round" onChange={(e) => handleInputChange(e, 'round')}>
                  <>
                    {sortedMatchRounds.includes(filterValue.round) ? (
                      <option selected>{Lib.capitalize(filterValue.round)}</option>
                    ) : null}
                    <option value="">{''}</option>
                    {sortedMatchRounds.map(function (round) {
                      if (filterValue.round !== round) {
                        return <option value={Lib.capitalize(round)}>{Lib.capitalize(round)}</option>;
                      }
                    })}
                  </>
                </Form.Select>
              </FloatingLabel>
              <br />
              <FloatingLabel controlId="floatingSelect" label="Filter matches by golf club">
                <Form.Select
                  aria-label="Filter matches by golf club"
                  onChange={(e) => handleInputChange(e, 'golfClub')}
                >
                  <>
                    {sortedGolfClubs.includes(filterValue.golfClub) ? (
                      <option selected>{Lib.capitalize(filterValue.golfClub)}</option>
                    ) : null}
                    <option value="">{''}</option>
                    {sortedGolfClubs.map(function (golfClub) {
                      if (filterValue.golfClub !== golfClub) {
                        return <option value={Lib.capitalize(golfClub)}>{Lib.capitalize(golfClub)}</option>;
                      }
                    })}
                  </>
                </Form.Select>
              </FloatingLabel>
            </>
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
