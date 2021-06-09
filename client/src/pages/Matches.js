import React, { useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import { IsEmpty, Map } from "react-lodash";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from '../components/Cards';
import Filters from '../components/Filters';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

function Matches() {
  const { allMatches, filterValue, isActive } = useContext(DataAreaContext);

  const sortedMatches = allMatches.sort(function(a, b) {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  
  return (
    <>
    <Container fluid={ true } style={{ padding: 0}}>
      <Header />
      <Container>
        <Row 
          className={(isActive) ? 'mt-3 mx-0' : ''}
          style={{ backgroundColor: '#ffffff', boxShadow: '0 0 4px rgba(0,0,0,.1)', borderRadius: '.25rem' }}>
          <Filters />
        </Row>
        <Row>
        <IsEmpty
          value={sortedMatches}
          yes={() =>
            <Spinner animation="grow" variant="success" />
          }
          no={() => (
            <Map collection={sortedMatches}
              iteratee={match =>
                (match.competitionName.toLowerCase()).includes(filterValue.toLowerCase())
                ?
                (
                  <Col lg={{ span: 4 }} md={{ span: 12 }} xs={{ span: 12 }}  className='mt-3'>
                    <Cards match={ match } />
                  </Col> 
                ) : 
                null
              }
            />
          )}
        />
        </Row>
      </Container>
      <Footer />
    </Container>
    </>
  );
}

export default Matches;