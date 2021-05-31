import React, { useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import Header from "../components/Header";
import Cards from '../components/Cards';
import Filters from '../components/Filters';
import { Container, Row, Col } from 'react-bootstrap';

function Matches() {
  const { allMatches, filterValue } = useContext(DataAreaContext);

  const sortedMatches = allMatches.sort(function(a, b) {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  
  sortedMatches.map(match =>
    console.log(match.competitionName)
  );
  
  return (
    <>
    <Container fluid={ true } style={{ padding: 0}}>
      <Header />
      <Container>
        <Row style={{ backgroundColor: '#ffffff', margin: '1rem 0 0 0', boxShadow: '0 0 4px rgba(0,0,0,.1)' }}>
          <Filters />
        </Row>
        <Row>
        {sortedMatches.map(match =>
          (match.competitionName.toLowerCase()).includes(filterValue.toLowerCase())
          ?
          (
            <Col lg={{ span: 4 }} md={{ span: 12 }} xs={{ span: 12 }} style={{ marginTop: '15px' }}>
              <Cards match={ match } />
            </Col> 
          ) : 
          null
          )
        }
        </Row>
      </Container>
    </Container>
    </>
  );
}

export default Matches;