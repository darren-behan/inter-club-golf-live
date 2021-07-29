import React, { useContext, useEffect } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import { IsEmpty, Map } from "react-lodash";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from '../components/Cards';
import FiltersOffCanvas from '../components/FiltersOffCanvas';
import { Container, Row, Col } from 'react-bootstrap';
import AdSense from 'react-adsense';

function Matches() {
  const { appMatchesOnLoad, filterValue, setFilterValue, show, userDataObj } = useContext(DataAreaContext);
  let filterMatchesByUid;

  useEffect(() => {
    setFilterValue("");
  }, []);

  if (Object.keys(userDataObj).length > 0) {
    filterMatchesByUid = appMatchesOnLoad.filter(match => match.createdByUid === userDataObj.uid)
  } else {
    filterMatchesByUid = []
  }

  const sortedMatches = filterMatchesByUid.sort(function(a, b) {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  
  return (
    <>
    <Header />
    <Container>
      <Row 
        className={(show) ? 'mt-3 mx-0' : ''}
        style={{ backgroundColor: '#ffffff', boxShadow: '0 0 4px rgba(0,0,0,.1)', borderRadius: '.25rem' }}>
        <FiltersOffCanvas 
          matches={sortedMatches}
        />
      </Row>
      <Row className="ads-row mx-3">
        <AdSense.Google
          client={process.env.REACT_APP_GOOGLE_ADSENSE}
          slot='4238602370'
          style={{ display: 'block' }}
          format='auto'
          responsive='true'
          layoutKey='-gw-1+2a-9x+5c'
        />
      </Row>
      <Row>
      <IsEmpty
        value={sortedMatches}
        yes={() =>
          <div>
            <p>
              You have not matches created 🤨
            </p>
          </div>
        }
        no={() => (
          <Map collection={sortedMatches}
            iteratee={match =>
              (match.teamOneName.includes(filterValue.toLowerCase()) || match.teamTwoName.includes(filterValue.toLowerCase()))
              ?
              (
                <Col lg={{ span: 4 }} md={{ span: 12 }} xs={{ span: 12 }}  className='mt-2 mb-3 px-0 user-match-col'>
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
    </>
  );
}

export default Matches;