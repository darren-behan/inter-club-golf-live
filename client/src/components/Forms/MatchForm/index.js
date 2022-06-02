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
import counties from '../../../assets/data/counties.json';
import matchData from '../../../assets/data/matchdata.json';
import rounds from '../../../assets/data/competitionRounds.json';
let isEmpty = require('lodash.isempty');
const { getToken } = require('firebase/app-check');

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
    setOldPostMatchObj,
    updateMatchObj,
    setUpdateMatchObj,
    setOldUpdateMatchObj,
    setIsMatchEdited,
    appCheck,
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

  useEffect(() => {
    setOldUpdateMatchObj(JSON.parse(JSON.stringify({ ...updateMatchObj })));
  }, [updateMatchObj]);

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    if (name === 'competitionName' && postMatchObj.hasOwnProperty('competitionName') && value !== 'JB Carr') {
      setPostMatchObj({ ...postMatchObj, [name]: value, competitionCounty: '' });
      return;
    }

    if (name === 'competitionRound') {
      rounds.map((round) => {
        if (value.toLowerCase() === round.round.toLowerCase()) {
          if (props.isUpdate) {
            setUpdateMatchObj({ ...updateMatchObj, [name]: { ...round } });
            setIsMatchEdited(false);
          } else {
            setPostMatchObj({ ...postMatchObj, [name]: { ...round } });
          }
        }
      });
      return;
    }

    if (props.isUpdate && (name === 'matchDate' || name === 'matchTime')) {
      let key = 'matchDateTime';
      let valueDateTime;

      if (name === 'matchDate') {
        let matchTime = moment(updateMatchObj.matchDateTime).format('HH:mm');
        valueDateTime = moment(`${value} ${matchTime}`).format();
      }

      if (name === 'matchTime') {
        let matchDate = moment(updateMatchObj.matchDateTime).format('yyyy-MM-DD');
        valueDateTime = moment(`${matchDate} ${value}`).format();
      }

      setUpdateMatchObj({ ...updateMatchObj, [key]: valueDateTime });
      setIsMatchEdited(false);
      return;
    }

    if (!props.isUpdate) setPostMatchObj({ ...postMatchObj, [name]: value });
    if (props.isUpdate) {
      setUpdateMatchObj({ ...updateMatchObj, [name]: value });
      setIsMatchEdited(false);
    }
  };

  const handleIndividualMatchFieldInputChange = (event, id) => {
    event.preventDefault();
    const { name, value } = event.target;

    if (!props.isUpdate) {
      for (let i = 0; i < filteredMatchArray.length; i++) {
        if (parseInt(id) === i) {
          let object = filteredMatchArray[i];
          for (const key in object) {
            if (key === name) {
              object[key] = value.toLowerCase();
              setPostMatchObj({ ...postMatchObj, individualMatchesArray: filteredMatchArray });
            }
          }
          return;
        }
      }
    } else {
      updateMatchObj.individualMatch.map((object, i) => {
        if (parseInt(id) === i) {
          if (value !== '' && (name === 'awayMatchScore' || name === 'homeMatchScore')) {
            object[name] = parseInt(value);
            return object;
          }

          object[name] = value.toLowerCase();
          return object;
        }
      });
      setUpdateMatchObj(JSON.parse(JSON.stringify({ ...updateMatchObj })));
      setIsMatchEdited(false);
    }
  };

  let homeTeamName = props.isUpdate ? updateMatchObj['teamOneName'] : postMatchObj['teamOneName'];
  let awayTeamName = props.isUpdate ? updateMatchObj['teamTwoName'] : postMatchObj['teamTwoName'];
  let competitionName = props.isUpdate ? updateMatchObj['competitionName'] : postMatchObj['competitionName'];

  let competitionObject;
  let numberOfHomeMatches;
  let individualMatch;

  const getIndividualMatchFields = () => {
    let individualMatchFields = [];
    // We find the competition object in the competition data based on the competition selected
    for (let i = 0; i < competition.length; i++) {
      if (competition[i].name === competitionName) {
        competitionObject = competition[i];
        numberOfHomeMatches = !props.isUpdate
          ? Math.ceil(parseInt(competition[i].matches) / 2)
          : Math.ceil(parseInt(updateMatchObj.numIndividualMatches) / 2);
      }
    }

    // If the user hasn't filled in any of the three below fields, we don't display the individual match fields
    if (!props.isUpdate && isEmpty(postMatchObj['matchDate'])) return;
    if (!props.isUpdate && isEmpty(postMatchObj['matchTime'])) return;
    if (isEmpty(competitionObject)) return;
    if (!props.isUpdate && isEmpty(postMatchObj['competitionRegion'])) return;
    if (!props.isUpdate && isEmpty(postMatchObj['competitionRound'])) return;
    if (isEmpty(homeTeamName)) return;
    if (isEmpty(awayTeamName)) return;

    // We set the filtered match array with the necessary amount of individual match data based on the amount of matches in a competition
    // When we handle the individual match input, we overwrite these values for each individual match to submit to the DB
    if (!props.isUpdate) {
      matchData.filter((value, index, arr) => {
        if (index < competitionObject.matches) {
          filteredMatchArray.push(value);
        }
      });
    }

    for (let i = 0; i < competitionObject.matches; i++) {
      if (props.isUpdate) {
        individualMatch = updateMatchObj.individualMatch[i];
      }
      /* eslint-disable */
      {
        competitionObject.singlePlayer === true
          ? individualMatchFields.push(
              <>
                <Accordion.Item eventKey={i + 1}>
                  <Accordion.Header>
                    <>
                      {!isEmpty(postMatchObj.neutralVenueName) || !isEmpty(updateMatchObj.neutralVenueName) ? (
                        <span style={{ color: 'rgb(10, 102, 194)' }}>Match {i + 1}</span>
                      ) : i + 1 <= numberOfHomeMatches ? (
                        <span style={{ color: 'rgb(10, 102, 194)' }}>
                          {Lib.capitalize(homeTeamName)} match {i + 1}
                        </span>
                      ) : (
                        <span style={{ color: 'rgb(10, 102, 194)' }}>
                          {Lib.capitalize(awayTeamName)} match {i + 1 - numberOfHomeMatches}
                        </span>
                      )}
                    </>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {props.isUpdate
                            ? `Update ${Lib.capitalize(homeTeamName)} player name (if unknown, leave empty)`
                            : `${Lib.capitalize(homeTeamName)} player name (if unknown, leave empty)`}
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="homeMatchPlayerAName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                          value={
                            props.isUpdate
                              ? individualMatch.homeMatchPlayerAName === 'empty'
                                ? ''
                                : Lib.capitalize(individualMatch.homeMatchPlayerAName)
                              : null
                          }
                        />
                      </Form.Group>
                    </Row>
                    <>
                      {props.isUpdate ? (
                        <>
                          <Row className="py-1">
                            <Form.Group as={Col}>
                              <Form.Text className="text-muted">
                                If the {Lib.capitalize(homeTeamName)} player is winning, enter the number of holes they
                                are up by, otherwise, enter 0
                              </Form.Text>
                              <Form.Control
                                type="text"
                                className="mb-3"
                                name="homeMatchScore"
                                onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                                value={individualMatch.homeMatchScore}
                              />
                            </Form.Group>
                          </Row>
                        </>
                      ) : null}
                    </>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {props.isUpdate
                            ? `Update ${Lib.capitalize(awayTeamName)} player name (if unknown, leave empty)`
                            : `${Lib.capitalize(awayTeamName)} player name (if unknown, leave empty)`}
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="awayMatchPlayerAName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                          value={
                            props.isUpdate
                              ? individualMatch.awayMatchPlayerAName === 'empty'
                                ? ''
                                : Lib.capitalize(individualMatch.awayMatchPlayerAName)
                              : null
                          }
                        />
                      </Form.Group>
                    </Row>
                    <>
                      {props.isUpdate ? (
                        <>
                          <Row className="py-1">
                            <Form.Group as={Col}>
                              <Form.Text className="text-muted">
                                If the {Lib.capitalize(awayTeamName)} player is winning, enter the number of holes they
                                are up by, otherwise, enter 0
                              </Form.Text>
                              <Form.Control
                                type="text"
                                className="mb-3"
                                name="awayMatchScore"
                                onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                                value={individualMatch.awayMatchScore}
                              />
                            </Form.Group>
                          </Row>
                          <Row className="py-1">
                            <Form.Group as={Col}>
                              <Form.Text className="text-muted">Update the number of holes played</Form.Text>
                              <Form.Control
                                type="text"
                                className="mb-3"
                                name="holesPlayed"
                                onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                                value={individualMatch.holesPlayed}
                              />
                            </Form.Group>
                          </Row>
                        </>
                      ) : null}
                    </>
                  </Accordion.Body>
                </Accordion.Item>
              </>,
            )
          : individualMatchFields.push(
              <>
                <Accordion.Item eventKey={i + 1}>
                  <Accordion.Header>
                    <>
                      {!isEmpty(postMatchObj.neutralVenueName) || !isEmpty(updateMatchObj.neutralVenueName) ? (
                        <span style={{ color: 'rgb(10, 102, 194)' }}>Match {i + 1}</span>
                      ) : i + 1 <= numberOfHomeMatches ? (
                        <span style={{ color: 'rgb(10, 102, 194)' }}>
                          {Lib.capitalize(homeTeamName)} match {i + 1}
                        </span>
                      ) : (
                        <span style={{ color: 'rgb(10, 102, 194)' }}>
                          {Lib.capitalize(awayTeamName)} match {i + 1 - numberOfHomeMatches}
                        </span>
                      )}
                    </>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {props.isUpdate
                            ? `Update ${Lib.capitalize(homeTeamName)} player 1 name (if unknown, leave empty)`
                            : `${Lib.capitalize(homeTeamName)} player 1 name (if unknown, leave empty)`}
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="homeMatchPlayerAName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                          value={
                            props.isUpdate
                              ? individualMatch.homeMatchPlayerAName === 'empty'
                                ? ''
                                : Lib.capitalize(individualMatch.homeMatchPlayerAName)
                              : null
                          }
                        />
                      </Form.Group>
                    </Row>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {props.isUpdate
                            ? `Update ${Lib.capitalize(homeTeamName)} player 2 name (if unknown, leave empty)`
                            : `${Lib.capitalize(homeTeamName)} player 2 name (if unknown, leave empty)`}
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="homeMatchPlayerBName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                          value={
                            props.isUpdate
                              ? individualMatch.homeMatchPlayerBName === 'empty'
                                ? ''
                                : Lib.capitalize(individualMatch.homeMatchPlayerBName)
                              : null
                          }
                        />
                      </Form.Group>
                    </Row>
                    <>
                      {props.isUpdate ? (
                        <>
                          <Row className="py-1">
                            <Form.Group as={Col}>
                              <Form.Text className="text-muted">
                                If the {Lib.capitalize(homeTeamName)} players are winning, enter the number of holes
                                they are up by, otherwise, enter 0
                              </Form.Text>
                              <Form.Control
                                type="text"
                                className="mb-3"
                                name="homeMatchScore"
                                onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                                value={individualMatch.homeMatchScore}
                              />
                            </Form.Group>
                          </Row>
                        </>
                      ) : null}
                    </>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {props.isUpdate
                            ? `Update ${Lib.capitalize(awayTeamName)} player 1 name (if unknown, leave empty)`
                            : `${Lib.capitalize(awayTeamName)} player 1 name (if unknown, leave empty)`}
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="awayMatchPlayerAName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                          value={
                            props.isUpdate
                              ? individualMatch.awayMatchPlayerAName === 'empty'
                                ? ''
                                : Lib.capitalize(individualMatch.awayMatchPlayerAName)
                              : null
                          }
                        />
                      </Form.Group>
                    </Row>
                    <Row className="py-1">
                      <Form.Group as={Col}>
                        <Form.Text className="text-muted">
                          {props.isUpdate
                            ? `Update ${Lib.capitalize(awayTeamName)} player 2 name (if unknown, leave empty)`
                            : `${Lib.capitalize(awayTeamName)} player 2 name (if unknown, leave empty)`}
                        </Form.Text>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          name="awayMatchPlayerBName"
                          onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                          value={
                            props.isUpdate
                              ? individualMatch.awayMatchPlayerBName === 'empty'
                                ? ''
                                : Lib.capitalize(individualMatch.awayMatchPlayerBName)
                              : null
                          }
                        />
                      </Form.Group>
                    </Row>
                    <>
                      {props.isUpdate ? (
                        <>
                          <Row className="py-1">
                            <Form.Group as={Col}>
                              <Form.Text className="text-muted">
                                If the {Lib.capitalize(awayTeamName)} players are winning, enter the number of holes
                                they are up by, otherwise, enter 0
                              </Form.Text>
                              <Form.Control
                                type="text"
                                className="mb-3"
                                name="awayMatchScore"
                                onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                                value={individualMatch.awayMatchScore}
                              />
                            </Form.Group>
                          </Row>
                          <Row className="py-1">
                            <Form.Group as={Col}>
                              <Form.Text className="text-muted">Update the number of holes played</Form.Text>
                              <Form.Control
                                type="text"
                                className="mb-3"
                                name="holesPlayed"
                                onChange={(e) => handleIndividualMatchFieldInputChange(e, i)}
                                value={individualMatch.holesPlayed}
                              />
                            </Form.Group>
                          </Row>
                        </>
                      ) : null}
                    </>
                  </Accordion.Body>
                </Accordion.Item>
              </>,
            );
      }
    }
    return individualMatchFields;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let appCheckTokenResponse;
    try {
      appCheckTokenResponse = await getToken(appCheck, /* forceRefresh= */ false);
    } catch (err) {
      console.log(JSON.stringify(err));
      return;
    }

    API.postMatch(
      {
        timeZone: timeZone,
        matchDateTime: moment(`${postMatchObj.matchDate} ${postMatchObj.matchTime}`).format(),
        createdAt: moment().format(),
        updatedAt: moment().format(),
        competitionName: postMatchObj.competitionName,
        competitionConcatRegion: !isEmpty(postMatchObj.competitionCounty)
          ? postMatchObj.competitionRegion
          : !isEmpty(postMatchObj.competitionRegionArea)
          ? postMatchObj.competitionRegion + ' ' + postMatchObj.competitionRegionArea
          : postMatchObj.competitionRegion,
        competitionRegion: postMatchObj.competitionRegion,
        competitionRegionArea: !isEmpty(postMatchObj.competitionRegionArea) ? postMatchObj.competitionRegionArea : '',
        competitionCounty: !isEmpty(postMatchObj.competitionCounty) ? postMatchObj.competitionCounty : '',
        competitionConcatCounty:
          !isEmpty(postMatchObj.competitionCounty) && !isEmpty(postMatchObj.competitionRegionArea)
            ? postMatchObj.competitionCounty + ' ' + postMatchObj.competitionRegionArea
            : !isEmpty(postMatchObj.competitionCounty)
            ? postMatchObj.competitionCounty
            : '',
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
      },
      appCheckTokenResponse.token,
    )
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
                  <Form.Text className="text-muted">
                    {props.isUpdate ? 'Update the match date' : 'Select the match date'}
                  </Form.Text>
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
                    value={props.isUpdate ? moment(updateMatchObj.matchDateTime).format('yyyy-MM-DD') : null}
                  ></TextField>
                </Form.Group>
              </Row>
              <Row className="py-1">
                <Form.Group as={Col} className="mb-3" controlId="formBasicPassword">
                  <Form.Text className="text-muted">
                    {props.isUpdate ? 'Update the match time' : 'Select the match time'}
                  </Form.Text>
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
                    value={props.isUpdate ? moment(updateMatchObj.matchDateTime).tz(timeZone).format('HH:mm') : null}
                  ></TextField>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">
                    {props.isUpdate
                      ? 'If you have chosen the wrong competition, please delete this match & create a new match'
                      : 'Select the competition'}
                  </Form.Text>
                  <Form.Select
                    aria-label="Competition name"
                    name="competitionName"
                    onChange={handleInputChange}
                    disabled={props.isUpdate ? true : false}
                  >
                    <option>
                      {props.isUpdate
                        ? !isEmpty(updateMatchObj.competitionName)
                          ? updateMatchObj.competitionName
                          : ''
                        : ''}
                    </option>
                    {competition.map((competition, index) => (
                      <option value={competition.name}>{competition.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">
                    {props.isUpdate ? 'Update competition region' : 'Select the region the match is played in'}
                  </Form.Text>
                  <Form.Select aria-label="Regions" name="competitionRegion" onChange={handleInputChange}>
                    <option>
                      {props.isUpdate
                        ? !isEmpty(updateMatchObj.competitionRegion)
                          ? Lib.capitalize(updateMatchObj.competitionRegion)
                          : ''
                        : ''}
                    </option>
                    {regions.map((region, index) =>
                      props.isUpdate ? (
                        !isEmpty(updateMatchObj.competitionRegion) ? (
                          updateMatchObj.competitionRegion.toLowerCase() === region.region.toLowerCase() ? null : (
                            <option value={region.region}>{Lib.capitalize(region.region)}</option>
                          )
                        ) : (
                          <option value={region.region}>{Lib.capitalize(region.region)}</option>
                        )
                      ) : (
                        <option value={region.region}>{Lib.capitalize(region.region)}</option>
                      ),
                    )}
                  </Form.Select>
                </Form.Group>
              </Row>
              <>
                {competitionName === 'JB Carr' ? (
                  <>
                    <Row>
                      <Form.Group as={Col} className="mb-3">
                        <Form.Text className="text-muted">
                          {props.isUpdate ? 'Update competition county' : 'Select the county the match is played in'}
                        </Form.Text>
                        <Form.Select aria-label="Counties" name="competitionCounty" onChange={handleInputChange}>
                          <option>
                            {props.isUpdate
                              ? !isEmpty(updateMatchObj.competitionCounty)
                                ? Lib.capitalize(updateMatchObj.competitionCounty)
                                : ''
                              : ''}
                          </option>
                          {counties.map((county) =>
                            props.isUpdate ? (
                              !isEmpty(updateMatchObj.competitionCounty) ? (
                                updateMatchObj.competitionCounty.toLowerCase() === county.toLowerCase() ? null : (
                                  <option value={county}>{Lib.capitalize(county)}</option>
                                )
                              ) : (
                                <option value={county}>{Lib.capitalize(county)}</option>
                              )
                            ) : (
                              <option value={county}>{Lib.capitalize(county)}</option>
                            ),
                          )}
                        </Form.Select>
                      </Form.Group>
                    </Row>
                  </>
                ) : null}
              </>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">
                    {props.isUpdate
                      ? 'Update the area of the region the competition is played in (if applicable)'
                      : 'Select the area of the region the match is played in (if applicable)'}
                  </Form.Text>
                  <Form.Select aria-label="Region areas" name="competitionRegionArea" onChange={handleInputChange}>
                    <option>
                      {props.isUpdate
                        ? !isEmpty(updateMatchObj.competitionRegionArea)
                          ? Lib.capitalize(updateMatchObj.competitionRegionArea)
                          : ''
                        : ''}
                    </option>
                    <option value=""></option>
                    {regionAreas.map((regionArea, index) =>
                      props.isUpdate ? (
                        !isEmpty(updateMatchObj.competitionRegionArea) ? (
                          updateMatchObj.competitionRegionArea.toLowerCase() ===
                          regionArea.regionArea.toLowerCase() ? null : (
                            <option value={regionArea.regionArea}>{Lib.capitalize(regionArea.regionArea)}</option>
                          )
                        ) : (
                          <option value={regionArea.regionArea}>{Lib.capitalize(regionArea.regionArea)}</option>
                        )
                      ) : (
                        <option value={regionArea.regionArea}>{Lib.capitalize(regionArea.regionArea)}</option>
                      ),
                    )}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">
                    {props.isUpdate ? 'Update the round of the match' : 'Select the round of the match'}
                  </Form.Text>
                  <Form.Select aria-label="Rounds" name="competitionRound" onChange={handleInputChange}>
                    <option>
                      {props.isUpdate
                        ? !isEmpty(updateMatchObj.competitionRound.round)
                          ? Lib.capitalize(updateMatchObj.competitionRound.round)
                          : ''
                        : ''}
                    </option>
                    {rounds.map((round, index) =>
                      props.isUpdate ? (
                        !isEmpty(updateMatchObj.competitionRound.round) ? (
                          updateMatchObj.competitionRound.round.toLowerCase() === round.round.toLowerCase() ? null : (
                            <option value={round.round}>{Lib.capitalize(round.round)}</option>
                          )
                        ) : (
                          <option value={round.round}>{Lib.capitalize(round.round)}</option>
                        )
                      ) : (
                        <option value={round.round}>{Lib.capitalize(round.round)}</option>
                      ),
                    )}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">Enter the venue for the match if it is neutral</Form.Text>
                  <Form.Control
                    type="text"
                    name="neutralVenueName"
                    onChange={handleInputChange}
                    value={props.isUpdate ? Lib.capitalize(updateMatchObj.neutralVenueName) : null}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">
                    {props.isUpdate ? 'Update the home team name' : 'Enter the home team name'}
                  </Form.Text>
                  <Form.Control
                    type="text"
                    name="teamOneName"
                    onChange={handleInputChange}
                    value={props.isUpdate ? Lib.capitalize(updateMatchObj.teamOneName) : null}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Text className="text-muted">
                    {props.isUpdate ? 'Update the away team name' : 'Enter the away team name'}
                  </Form.Text>
                  <Form.Control
                    type="text"
                    name="teamTwoName"
                    onChange={handleInputChange}
                    value={props.isUpdate ? Lib.capitalize(updateMatchObj.teamTwoName) : null}
                  />
                </Form.Group>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          {getIndividualMatchFields()}
        </Accordion>
        {!props.isUpdate ? (
          <>
            <Row className="py-1">
              <div>
                <Button
                  type="submit"
                  variant="outline-success"
                  value="Submit"
                  onClick={handleSubmit}
                  disabled={loading || !formIsValid()}
                >
                  {loading ? <Spinner animation="border" style={{ color: '#0a66c2' }} /> : 'Create match'}
                </Button>
              </div>
            </Row>
          </>
        ) : null}
      </Form>
    </>
  );
}

export default MatchForm;
