import React, { useContext } from 'react';
import './index.css';
import { Map } from "react-lodash";
import DataAreaContext from '../../utils/DataAreaContext';
import Cards from '../Cards';

function Carousel() {
  const { appMatchesOnLoad } = useContext(DataAreaContext);

  return (
    <div className="container px-0 py-3">
      <div className="cards-container">
        <Map collection={appMatchesOnLoad}
          iteratee={match =>
            <Cards match={ match } />
          }
        />
      </div>
    </div>
  )
}

export default Carousel;