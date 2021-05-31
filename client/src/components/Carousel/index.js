import React, { useContext } from 'react';
import './index.css';
import DataAreaContext from '../../utils/DataAreaContext';
import Cards from '../Cards';
import { Carousel } from 'react-bootstrap';

function CardCarousel() {
  const { allMatches } = useContext(DataAreaContext);

  return (
    <>
    <Carousel fade>
      {allMatches.map(match =>
          <Carousel.Item style={{ marginTop: '15px' }}>
            <Cards match={ match } />
          </Carousel.Item>
        )
      }
    </Carousel>
    </>
  );
}

export default CardCarousel;