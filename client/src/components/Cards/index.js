import React from 'react';
import './index.css';
import { Card } from 'react-bootstrap';
import Moment from 'react-moment';

function Cards(props) {

  return (
    <Card key={ props.match.matchId } style={{ boxShadow: '0 0 4px rgba(0,0,0,.1)' }}>
      <Card.Header> { props.match.competitionName } </Card.Header>
      <Card.Body>
        <Card.Title> Competitors </Card.Title>
        <Card.Text>
          { props.match.teamOneName } : { props.match.teamTwoName }
        </Card.Text>
        <Card.Title> Score </Card.Title>
        <Card.Text>
          { props.match.teamOneScore } : { props.match.teamTwoScore } 
        </Card.Text>
        <Card.Title> Match Date &amp; Time </Card.Title>
        <Card.Text>
          { props.match.matchDate } : { props.match.matchTime } 
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Last updated: 
            <Moment format="DD/MM/YYYY - HH:MM">
              { props.match.updatedAt }
            </Moment>
        </small>
      </Card.Footer>
    </Card>
  );
}

export default Cards;
