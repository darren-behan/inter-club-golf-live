import React, { useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import { IsEmpty, Map } from "react-lodash";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from '../components/Cards';
import FiltersModal from '../components/Modals/FiltersModal';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

function Competition() {
  const { appMatchesOnLoad, filterValue } = useContext(DataAreaContext);
  console.log(appMatchesOnLoad);

  const sortedMatches = appMatchesOnLoad.sort(function(a, b) {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  
  return (
    <>
    <Container fluid={ true } className="p-0">
      <FiltersModal />
      <Header />
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
      <Footer />
    </Container>
    </>
  );
}

export default Competition;