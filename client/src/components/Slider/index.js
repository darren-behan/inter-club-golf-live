import React, { useContext } from 'react';
import './index.css';
import { IsEmpty, Map } from "react-lodash";
import DataAreaContext from '../../utils/DataAreaContext';
import Cards from '../Cards';
import { Col, Spinner } from 'react-bootstrap';

function Slider() {
  const { appMatchesOnLoad } = useContext(DataAreaContext);

  return (
    <IsEmpty
      value={appMatchesOnLoad}
      yes={() =>
        <Spinner animation="grow" variant="success" />
      }
      no={() => (
        <Map collection={appMatchesOnLoad}
          iteratee={match =>
            <Col xs={{ span: 12 }} lg={{ span: 4 }}>
              <Cards match={ match } />
            </Col>
          }
        />
      )}
    />
  )
}

export default Slider;