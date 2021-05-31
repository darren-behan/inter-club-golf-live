import React, { useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import Header from "../components/Header";
import Cards from '../components/Cards';
import Filters from '../components/Filters';
import { Container, Row, Col } from 'react-bootstrap';

function Matches() {
  const { allMatches } = useContext(DataAreaContext);

  const sortedMatches = allMatches.sort(function(a, b) {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  
  return (
    <>
    <Container fluid={ true } style={{ padding: 0}}>
      <Header />
      <Container>
        <Filters />
        <Row>
        {sortedMatches.map(match => 
          <Col lg={{ span: 4 }} md={{ span: 12 }} xs={{ span: 12 }} style={{ marginTop: '15px' }}>
            <Cards match={ match } />
          </Col>
        )}
        </Row>
      </Container>
    </Container>
    </>
  );
}

export default Matches;