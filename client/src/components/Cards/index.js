import React from 'react';
import './index.css';
import { useHistory } from 'react-router-dom';
import { Card, Button, Badge } from 'react-bootstrap';
import Moment from 'react-moment';

function Cards(props) {
  const history = useHistory();

  const calculateMatchStatus = (matchStatus) => {
    if (matchStatus === 'complete') {
      return <Badge
        variant="success"
        className="float-right"
      >
        Complete
      </Badge>
    } else if (matchStatus === 'in progress') {
      return <Badge
        variant="warning"
        className="float-right"
      >
        In progress
      </Badge>
    } else {
      return <Badge
        style={{ backgroundColor: "#f3f2ef" }}
        className="float-right"
      >
        Upcoming
      </Badge>
    }         
  }

  var concatDateTime = props.match.matchDate + 'T' + props.match.matchTime + ':00+00:00';

  function handleClick(matchId) {
    const path = "/match/" + matchId;
    history.push(path);
  }

  return (
    <Card key={ props.match.matchId } style={{ boxShadow: '0 0 4px rgba(0,0,0,.1)' }}>
      <Card.Body style={{ borderRadius: '.25rem .25rem 0 0', background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 70%, rgba(0,170,8,1) 100%)' }}>
        <Card.Title> 
          { props.match.teamOneName } v { props.match.teamTwoName }
        </Card.Title>
        <Card.Text>
          {calculateMatchStatus(props.match.matchStatus)}
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
            Match Date:
            <br/>
            <Moment format="DD/MM/YYYY">
              { concatDateTime }
            </Moment>
          </small>
          <br/>
          <small className="text-muted">
            Match Time: 
            <br/>
            <Moment format="HH:MM">
              { concatDateTime }
            </Moment>
          </small>
          <br/>
          <small className="text-muted">
            Last updated at:
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
            handleClick(props.match.matchId)
          }
        >
          View match
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default Cards;
