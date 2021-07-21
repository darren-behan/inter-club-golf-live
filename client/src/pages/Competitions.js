import React, { useContext, useEffect } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import API from '../utils/API';
import { IsEmpty, Map } from "react-lodash";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from '../components/Cards';
import FiltersModal from '../components/Modals/FiltersModal';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

function Competition () {
  const { appMatchesOnLoad, filterValue, matchesByCompetition, setMatchesByCompetition } = useContext(DataAreaContext);
  let { competition } = useParams();
  console.log(appMatchesOnLoad);

  useEffect(() => {
    getMatchesByCompetition();
  }, []);

  async function getMatchesByCompetition() {
    await API.getMatchesByCompetitionOnLoad(competition)
      .then(res => {
        setMatchesByCompetition(res.data);
      })
      .catch(err => console.log(err));
  }
  
  return (
    <>
    <Container fluid={ true } className="p-0">
      <FiltersModal />
      <Header />
      <Row>
      <IsEmpty
        value={matchesByCompetition}
        yes={() =>
          <Spinner animation="grow" variant="success" />
        }
        no={() => (
          <Map collection={matchesByCompetition}
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