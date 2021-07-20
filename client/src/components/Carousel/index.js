import React, { useContext } from 'react';
import './index.css';
import { IsEmpty, Map } from "react-lodash";
import DataAreaContext from '../../utils/DataAreaContext';
import Cards from '../Cards';
import { Spinner } from 'react-bootstrap';

function Carousel() {
  const { appMatchesOnLoad } = useContext(DataAreaContext);

  return (
    <div className="container px-0 py-3">
      <div className="cards-container">
        <IsEmpty
          value={appMatchesOnLoad}
          yes={() =>
            <Spinner animation="grow" variant="success" />
          }
          no={() => (
            <Map collection={appMatchesOnLoad}
              iteratee={match =>
                <Cards match={ match } />
              }
            />
          )}
        />
      </div>
    </div>
  )
}

export default Carousel;