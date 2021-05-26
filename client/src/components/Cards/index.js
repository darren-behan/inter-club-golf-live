import React, { useContext } from 'react';
import DataAreaContext from '../../utils/DataAreaContext';
import './index.css';
import { CardDeck, Card } from 'react-bootstrap';

function Cards() {
  const { allMatches } = useContext(DataAreaContext);

  return (
    <CardDeck>
      {allMatches.map(match => 
        <Card>
          <Card.Body>
            <Card.Title> { match.competitionName } </Card.Title>
            <Card.Text>
              This card has supporting text below as a natural lead-in to additional
              content.{' '}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Last updated: { match.updatedAt }</small>
          </Card.Footer>
        </Card>
      )}
    </CardDeck>
  );
}

export default Cards;
