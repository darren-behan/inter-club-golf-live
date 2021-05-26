import React, { useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import Header from "../components/Header";
import Cards from '../components/Cards';
import { Container, Row, Col } from 'react-bootstrap';

function Matches() {
  const { allMatches } = useContext(DataAreaContext);
  
  return (
    <>
    <Header />
    <Container>
      <Row>
        {allMatches.map(match => 
          <Col lg={{ span: 4 }} md={{ span: 12 }} xs={{ span: 12 }} style={{ marginTop: '15px' }}>
            <Cards match={ match } />
          </Col>
        )}
      </Row>
    </Container>
    </>
  );
}

export default Matches;