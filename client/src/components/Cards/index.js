import React, { useContext } from 'react';
import './index.css';
import { useHistory } from 'react-router-dom';
import DataAreaContext from '../../utils/DataAreaContext';
import Lib from '../../utils/Lib';
import { Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Moment from 'react-moment';
import 'moment-timezone';

function Cards(props) {
  const history = useHistory();
  const { setMatchObj, timeZone } = useContext(DataAreaContext);

  const calculateMatchStatus = (matchStatus) => {
    if (matchStatus === 'complete') {
      return (
        <Badge bg="success" className="float-right">
          {Lib.capitalize(matchStatus)}d&nbsp;on&nbsp;
          <Moment tz={timeZone} format="DD/MM/YYYY">
            {props.match.matchDateTime}
          </Moment>
        </Badge>
      );
    } else if (matchStatus === 'in progress') {
      return (
        <Badge bg="warning" className="float-right">
          {Lib.capitalize(matchStatus)}
        </Badge>
      );
    } else {
      return (
        <Badge className="float-right" style={{ backgroundColor: '#0a66c2' }}>
          Teeing off on&nbsp;
          <Moment tz={timeZone} format="DD/MM/YYYY">
            {props.match.matchDateTime}
          </Moment>
          &nbsp;@&nbsp;
          <Moment tz={timeZone} format="HH:mm z">
            {props.match.matchDateTime}
          </Moment>
        </Badge>
      );
    }
  };

  const getScore = () => {
    if (props.match.teamOneScore > props.match.teamTwoScore) {
      return (
        <>
          {Lib.capitalize(props.match.teamOneName)}&nbsp;
          <span>
            <FontAwesomeIcon icon={faArrowLeft} className="fa-sm" />
          </span>
          &nbsp;{props.match.teamOneScore} - {props.match.teamTwoScore}&nbsp;{Lib.capitalize(props.match.teamTwoName)}
        </>
      );
    } else if (props.match.teamOneScore < props.match.teamTwoScore) {
      return (
        <>
          {Lib.capitalize(props.match.teamOneName)}&nbsp;{props.match.teamOneScore} - {props.match.teamTwoScore}&nbsp;
          <span>
            <FontAwesomeIcon icon={faArrowRight} className="fa-sm" />
          </span>
          &nbsp;{Lib.capitalize(props.match.teamTwoName)}
        </>
      );
    } else {
      return (
        <>
          {Lib.capitalize(props.match.teamOneName)}&nbsp;{props.match.teamOneScore} - {props.match.teamTwoScore}
          &nbsp;
          {Lib.capitalize(props.match.teamTwoName)}
        </>
      );
    }
  };

  function handleClick(matchId) {
    setMatchObj({
      ...props.match,
      competitionRound: { ...props.match.competitionRound },
      individualMatch: [...props.match.individualMatch],
      collaborators: [...props.match.collaborators],
    });
    const path = '/match/' + matchId;
    history.push(path);
  }

  return (
    <Card key={props.match.matchId} style={{ boxShadow: '0 0 4px rgba(0,0,0,.1)' }} className="ms-sm-0">
      <Card.Body className="p-0" style={{ borderRadius: '.25rem .25rem 0 0' }}>
        <Card.Header style={{ backgroundColor: '#0a66c2', color: '#ffffff', fontWeight: '600' }}>
          {props.match.matchStatus === 'not started'
            ? `${Lib.capitalize(props.match.teamOneName)} v ${Lib.capitalize(props.match.teamTwoName)}`
            : getScore()}
        </Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>{calculateMatchStatus(props.match.matchStatus)}</ListGroup.Item>
          <ListGroup.Item>{Lib.capitalize(props.match.competitionName)}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
      <Card.Footer style={{ backgroundColor: '#ffffff' }}>
        <Button
          variant="outline-primary"
          size="sm"
          className="float-right"
          onClick={() => handleClick(props.match.matchId)}
        >
          View match
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default Cards;
