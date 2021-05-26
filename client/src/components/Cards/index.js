import React, { useContext } from 'react';
import DataAreaContext from '../../utils/DataAreaContext';
import './index.css';
import { CardDeck, Card, Row, Col } from 'react-bootstrap';

function Cards() {
  const { allMatches } = useContext(DataAreaContext);

  return (
    <CardDeck>
      <Row>
        {allMatches.map(match => 
          <Col lg={{ span: 4 }} md={{ span: 12 }} xs={{ span: 12 }} style={{ marginTop: '15px' }}>
            <Card key={ match.matchId } style={{ boxShadow: '0 0 4px rgba(0,0,0,.1)' }}>
              <Card.Header> { match.competitionName } </Card.Header>
              <Card.Body>
                <Card.Title> Competitors </Card.Title>
                <Card.Text>
                  { match.teamOneName } : { match.teamTwoName }
                </Card.Text>
                <Card.Title> Score </Card.Title>
                <Card.Text>
                  { match.teamOneScore } : { match.teamTwoScore } 
                </Card.Text>
                <Card.Title> Match Date &amp; Time </Card.Title>
                <Card.Text>
                  { match.matchDate } : { match.matchTime } 
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Last updated: { match.updatedAt }</small>
              </Card.Footer>
            </Card>
          </Col>
        )}
      </Row>
    </CardDeck>
  );
}

export default Cards;
