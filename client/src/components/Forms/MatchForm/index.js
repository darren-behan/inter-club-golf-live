import React, { useContext, useState, useEffect } from 'react';
import API from '../../../utils/API';
import Lib from '../../../utils/Lib';
import DataAreaContext from '../../../utils/DataAreaContext';
import CreateMatchModal from '../../Modals/CreateMatchModal';
import { Form, Button, Row, Col, Accordion, Spinner } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import 'moment-timezone';
import competition from '../../../assets/data/competitions.json';
import regions from '../../../assets/data/regions.json';
import regionAreas from '../../../assets/data/regionArea.json';
import matchData from '../../../assets/data/matchdata.json';
import rounds from '../../../assets/data/competitionRounds.json';
let isEmpty = require('lodash.isempty');

const styles = makeStyles((theme) => ({
  textField: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0a66c2',
    },
    '& .MuiSvgIcon-root': {
      fill: '#0a66c2',
    },
  },
}));

function MatchForm(props) {
  const {
    appMatchesOnLoad,
    postMatchObj,
    setPostMatchObj,
    userDataObj,
    setAppMatchesOnLoad,
    timeZone,
    createMathModalShow,
    setCreateMatchModalShow,
    setCreateMatchResponse,
    setMatchObj,
    oldPostMatchObj,
    setOldPostMatchObj,
  } = useContext(DataAreaContext);
  const classes = styles();
  let filteredMatchArray = [];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPostMatchObj({});
  }, []);

  useEffect(() => {
    setOldPostMatchObj({ ...postMatchObj });
  }, [postMatchObj]);

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    console.log(name);
    console.log(value);

    if (name === 'neutralVenueName' || name === 'teamOneName' || name === 'teamTwoName') {
      if (!postMatchObj.hasOwnProperty('individualMatchesArray')) {
        postMatchObj['individualMatchesArray'] = [];
      }
      updateIndividualMatchDestination(name, value);
    }

    if (name === 'competitionRound') {
      rounds.map(function (round) {
        if (value === round.round) {
          return setPostMatchObj({ ...postMatchObj, [name]: round });
        }
      });
    } else {
      setPostMatchObj({ ...postMatchObj, [name]: value });
    }
  };

  function updateIndividualMatchDestination(name, value) {
    let oldValue = oldPostMatchObj[name];

    for (let i = 0; i < postMatchObj.individualMatchesArray.length; i++) {
      let individualMatch = postMatchObj.individualMatchesArray[i];
      if (!individualMatch.hasOwnProperty('matchDestination')) continue;
      if (individualMatch.matchDestination.toLowerCase() === oldValue.toLowerCase()) {
        individualMatch.matchDestination = Lib.capitalize(value);
        setPostMatchObj({ ...postMatchObj, individualMatchesArray: postMatchObj.individualMatch });
      }
    }
  }

  const handleIndividualMatchFieldInputChange = (event, id) => {
    event.preventDefault();
    const { name, value } = event.target;
    console.log(name);
    console.log(value);
    // console.log(event.target);
    // console.log(child.props);
    // const id = isEmpty(event.target.id) ? child.props.id : event.target.id;

    for (let i = 0; i < filteredMatchArray.length; i++) {
      if (parseInt(id) === i) {
        let object = filteredMatchArray[i];
        for (const key in object) {
          if (key === name) {
            object[key] = value;
            setPostMatchObj({ ...postMatchObj, individualMatchesArray: filteredMatchArray });
          }
        }
        return;
      }
    }
  };
  console.log(postMatchObj);

  let homeTeamName = postMatchObj['teamOneName'];
  let awayTeamName = postMatchObj['teamTwoName'];
  let neutralVenueName = postMatchObj['neutralVenueName'];
  let competitionName = postMatchObj['competitionName'];

  let competitors = [
    {
      name: homeTeamName,
    },
    {
      name: awayTeamName,
    },
  ];

  let competitionObject;
  let matchDestination = '';

  const getIndividualMatchFields = () => {
    // If the match is being played at a neutral venue, we add this to the competitors array so each individual match has the option to choose the neutral venue for where the match is played
    if (!isEmpty(neutralVenueName)) {
      competitors.push({
        name: neutralVenueName,
      });
    }

    let individualMatchFields = [];
    // We find the competition object in the competition data based on the competition selected
    for (let i = 0; i < competition.length; i++) {
      if (competition[i].name === competitionName) {
        competitionObject = competition[i];
      }
    }

    // If the user hasn't filled in any of the three below fields, we don't display the individual match fields
    if (isEmpty(postMatchObj['matchDate'])) return;
    if (isEmpty(postMatchObj['matchTime'])) return;
    if (isEmpty(competitionObject)) return;
    if (isEmpty(postMatchObj['competitionRegion'])) return;
    if (isEmpty(postMatchObj['competitionRound'])) return;
    if (isEmpty(homeTeamName)) return;
    if (isEmpty(awayTeamName)) return;

    // We set the filtered match array with the necessary amount of individual match data based on the amount of matches in a competition
    // When we handle the individual match input, we overwrite these values for each individual match to submit to the DB
    matchData.filter((value, index, arr) => {
      if (index < competitionObject.matches) {
        filteredMatchArray.push(value);
      }
    });

    for (let i = 0; i < competitionObject.matches; i++) {
      if (postMatchObj.individualMatchesArray.length === 0) {
        matchDestination = '';
      } else if (postMatchObj.individualMatchesArray[i].matchDestination === 'empty') {
        matchDestination = '';
      } else {
        matchDestination = postMatchObj.individualMatchesArray[i].matchDestination;
      }
      /* eslint-disable */
      {
        competitionObject.singlePlayer === true
          ? individualMatchFields.push(
              <>
                <Accordion.Item eventKey={i + 1}>
                  <Accordion.Header>
                    <span style={{ color: 'rgb(10, 102, 194)' }}>Match {i + 1}</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {Lib.capitalize(homeTeamName)} player name (if known)
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="homeMatchPlayerAName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {Lib.capitalize(awayTeamName)} player name (if known)
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="awayMatchPlayerAName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} className="mb-3">
                        <Form.Text className="text-muted">Select the course this match is played at</Form.Text>
                        <Form.Select
                          aria-label="Match destination"
                          name="matchDestination"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                        >
                          <option></option>
                          {competitors.map((clubName, index) => (
                            <option value={clubName.name}>{Lib.capitalize(clubName.name)}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </>,
            )
          : individualMatchFields.push(
              <>
                <Accordion.Item eventKey={i + 1}>
                  <Accordion.Header>
                    <span style={{ color: 'rgb(10, 102, 194)' }}>Match {i + 1}</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {Lib.capitalize(homeTeamName)} player 1 name (if known)
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="homeMatchPlayerAName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {Lib.capitalize(homeTeamName)} player 2 name (if known)
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="homeMatchPlayerBName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {Lib.capitalize(awayTeamName)} player 1 name (if known)
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="awayMatchPlayerAName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {Lib.capitalize(awayTeamName)} player 2 name (if known)
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="awayMatchPlayerBName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} className="mb-3">
                        <Form.Text className="text-muted">Select the course this match is played at</Form.Text>
                        <Form.Select
                          aria-label="Match destination"
                          name="matchDestination"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                        >
                          <option></option>
                          {competitors.map((clubName, index) => (
                            <option value={clubName.name}>{Lib.capitalize(clubName.name)}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </>,
            );
      }
    }
    return individualMatchFields;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    API.postMatch({
      timeZone: timeZone,
      matchDateTime: moment(`${postMatchObj.matchDate} ${postMatchObj.matchTime}`).format(),
      createdAt: moment().format(),
      updatedAt: moment().format(),
      competitionName: postMatchObj.competitionName,
      competitionConcatRegion: !isEmpty(postMatchObj.competitionRegionArea)
        ? postMatchObj.competitionRegion + ' ' + postMatchObj.competitionRegionArea
        : postMatchObj.competitionRegion,
      competitionRegion: postMatchObj.competitionRegion,
      competitionRegionArea: !isEmpty(postMatchObj.competitionRegionArea) ? postMatchObj.competitionRegionArea : '',
      competitionRound: postMatchObj.competitionRound,
      numIndividualMatches: competitionObject.matches,
      individualMatch: !isEmpty(postMatchObj.individualMatchesArray)
        ? postMatchObj.individualMatchesArray
        : filteredMatchArray,
      teamOneName: postMatchObj.teamOneName,
      teamTwoName: postMatchObj.teamTwoName,
      neutralVenueName: !isEmpty(postMatchObj.neutralVenueName) ? postMatchObj.neutralVenueName : '',
      uid: userDataObj.uid,
      singlePlayer: competitionObject.singlePlayer,
    })
      .then((response) => {
        setAppMatchesOnLoad([response.data, ...appMatchesOnLoad]);
        setMatchObj({ ...response.data });
        setCreateMatchResponse({
          matchId: response.data.matchId,
          message: 'Match created successfully',
          status: 200,
        });
        setCreateMatchModalShow(true);
        setPostMatchObj({});
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setCreateMatchResponse({
          message: error.response.data.error,
          status: error.response.status,
        });
        setCreateMatchModalShow(true);
        setLoading(false);
      });
  };

  const formIsValid = () => {
    const isValid =
      postMatchObj.matchDate &&
      postMatchObj.matchTime &&
      postMatchObj.competitionName &&
      postMatchObj.competitionRegion &&
      postMatchObj.competitionRound &&
      postMatchObj.teamOneName &&
      postMatchObj.teamTwoName;

    return isValid;
  };

  /* eslint-enable */
  return (
    <>
      <CreateMatchModal show={createMathModalShow} onHide={() => setCreateMatchModalShow(false)} />
      <Form className="px-3" style={{ backgroundColor: '#ffffff' }}>
        <Row className="py-1">
          <h4 style={{ color: 'rgb(10, 102, 194)' }}>Let's begin</h4>
        </Row>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <span style={{ color: 'rgb(10, 102, 194)' }}>Tell us about the match</span>
            </Accordion.Header>
            <Accordion.Body>
              <Row className="py-1">
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">Select the match date</Form.Text>
                  <TextField
                    key={1}
                    className={classes.textField}
                    variant="outlined"
                    margin="none"
                    size="small"
                    required={true}
                    fullWidth={true}
                    id="matchDate"
                    name="matchDate"
                    type="date"
                    defaultValue={''}
                    select={false}
                    error={''}
                    autoComplete="autoComplete"
                    autoFocus={false}
                    onChange={handleInputChange}
                  ></TextField>
                </Form.Group>
              </Row>
              <Row className="py-1">
                <Form.Group as={Col} className="mb-3" controlId="formBasicPassword">
                  <Form.Text className="text-muted">Select the match time</Form.Text>
                  <TextField
                    key={1}
                    className={classes.textField}
                    variant="outlined"
                    margin="none"
                    size="small"
                    required={true}
                    fullWidth={true}
                    id="matchTime"
                    name="matchTime"
                    type="time"
                    defaultValue="00:00"
                    select={false}
                    error={''}
                    autoComplete="autoComplete"
                    autoFocus={false}
                    onChange={handleInputChange}
                  ></TextField>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">Select the competition</Form.Text>
                  <Form.Select aria-label="Competition name" name="competitionName" onChange={handleInputChange}>
                    <option></option>
                    {competition.map((competition, index) => (
                      <option value={competition.name}>{competition.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">Select the region the match is played in</Form.Text>
                  <Form.Select aria-label="Regions" name="competitionRegion" onChange={handleInputChange}>
                    <option></option>
                    {regions.map((region, index) => (
                      <option value={region.region}>{Lib.capitalize(region.region)}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">
                    Select the area of the region the match is played in (if applicable)
                  </Form.Text>
                  <Form.Select aria-label="Region areas" name="competitionRegionArea" onChange={handleInputChange}>
                    <option></option>
                    {regionAreas.map((regionArea, index) => (
                      <option value={regionArea.regionArea}>{Lib.capitalize(regionArea.regionArea)}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">Select the round of the match</Form.Text>
                  <Form.Select aria-label="Rounds" name="competitionRound" onChange={handleInputChange}>
                    <option></option>
                    {rounds.map((round, index) => (
                      <option value={round.round}>{Lib.capitalize(round.round)}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">Enter the venue for the match if it is neutral</Form.Text>
                  <Form.Control type="text" name="neutralVenueName" onChange={handleInputChange} />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">Enter the home team name</Form.Text>
                  <Form.Control type="text" name="teamOneName" onChange={handleInputChange} />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">Enter the away team name</Form.Text>
                  <Form.Control type="text" name="teamTwoName" onChange={handleInputChange} />
                </Form.Group>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          {getIndividualMatchFields()}
        </Accordion>
        <Row className="py-1">
          <div>
            <Button
              type="submit"
              variant="outline-success"
              value="Submit"
              onClick={handleSubmit}
              disabled={loading || !formIsValid()}
            >
              Submit
              {loading && <Spinner animation="border" style={{ color: '#0a66c2' }} />}
            </Button>
          </div>
        </Row>
      </Form>
    </>
  );
}

export default MatchForm;
