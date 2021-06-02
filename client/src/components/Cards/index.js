import React from 'react';
import './index.css';
import { useHistory } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import Moment from 'react-moment';

function Cards(props) {
  const history = useHistory();

  const matchId = props.match.matchId;

  function handleClick(matchId) {
    const path = "/match/" + matchId;
    history.push(path);
  }

  return (
    <Card key={ props.match.matchId } style={{ boxShadow: '0 0 4px rgba(0,0,0,.1)' }}>
      <Card.Body style={{ borderRadius: '.25rem .25rem 0 0', background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 70%, rgba(0,170,8,1) 100%)' }}>
        <Card.Title> { props.match.teamOneName } v { props.match.teamTwoName } </Card.Title>
        <Card.Text>
          <small className="text-muted" style={{ fontStyle: 'italic' }}>
            Match Score:
          </small>
          <br/>
          { props.match.teamOneScore } - { props.match.teamTwoScore }
        </Card.Text>
        <Card.Text>
          <small className="text-muted">
            Competition: { props.match.competitionName }
          </small>
          <br/>
          <small className="text-muted">
            Match Date: { props.match.matchDate }
          </small>
          <br/>
          <small className="text-muted">
            Match Time: { props.match.matchTime }
          </small>
          <br/>
          <small className="text-muted">Last updated: 
            <br/>          
            <Moment format="DD/MM/YYYY - HH:MM">
              { props.match.updatedAt }
            </Moment>
          </small>
        </Card.Text>
      </Card.Body>
      <Card.Footer style={{ backgroundColor: '#ffffff' }}>
        <Button
          variant="outline-dark"
          size="sm"
          className="float-right"
          onClick={() =>
            handleClick(matchId)
          }
        >
          View match
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default Cards;
