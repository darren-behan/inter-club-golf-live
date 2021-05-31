import React, { useContext } from 'react';
import './index.css';
import DataAreaContext from '../../utils/DataAreaContext';
import Cards from '../Cards';
import { Col } from 'react-bootstrap';

function CardCarousel() {
  const { allMatches } = useContext(DataAreaContext);

  return (
    <>
    {allMatches.map(match =>
      <Col lg={{ span: 4 }}>
        <Cards match={ match } />
      </Col>
      )
    }
    </>
  );
}

export default CardCarousel;