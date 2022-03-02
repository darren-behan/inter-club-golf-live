import React, { useContext, useEffect } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import { IsEmpty } from "react-lodash";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from '../components/Cards';
import FiltersOffCanvas from '../components/FiltersOffCanvas';
import { Container, Row, Col } from 'react-bootstrap';
import AdSense from 'react-adsense';
import { isEmpty } from 'lodash';
import moment from 'moment';

function Matches() {
  const { appMatchesOnLoad, filterValue, setFilterValue, show, userDataObj } = useContext(DataAreaContext);
  let filterMatchesByUid;
  let matchYears = [];

  useEffect(() => {
    setFilterValue({
      year: "",
      region: "",
      round: "",
      golfClub: ""
    });
  }, []);

  if (Object.keys(userDataObj).length > 0) {
    filterMatchesByUid = appMatchesOnLoad.filter(match => match.createdByUid === userDataObj.uid)
  } else {
    filterMatchesByUid = []
  }

  const sortedMatchesByMatchDateTime = filterMatchesByUid.sort(function(a, b) {
    return new Date(b.matchDateTime) - new Date(a.matchDateTime);
  });
  
  return (
    <>
    <Header />
    <Container>
      <Row 
        className={(show) ? 'mt-3 mx-0' : ''}
        style={{ backgroundColor: '#ffffff', boxShadow: '0 0 4px rgba(0,0,0,.1)', borderRadius: '.25rem' }}>
        <FiltersOffCanvas 
          matches={sortedMatchesByMatchDateTime}
        />
      </Row>
      {/* <Row className="ads-row mx-3">
        <AdSense.Google
          client={process.env.REACT_APP_GOOGLE_ADSENSE}
          slot='4238602370'
          style={{ display: 'block' }}
          format='auto'
          responsive='true'
          layoutKey='-gw-1+2a-9x+5c'
        />
      </Row> */}
      <Row>
      <IsEmpty
        value={sortedMatchesByMatchDateTime}
        yes={() =>
          <div style={{ textAlign: "center" }}>
            <br />
            <br />
            <h5>You haven't created any matches 🙁</h5>
          </div>
        }
        no={() => (
          <>
          {!isEmpty(sortedMatchesByMatchDateTime) ?
            <>
            {sortedMatchesByMatchDateTime.map((match, i) => {
              matchYears.push(moment(match.matchDateTime).format('YYYY'));

              if (!isEmpty(filterValue.year) && !isEmpty(filterValue.region) && !isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) {
                if (moment(match.matchDateTime).format('YYYY') === filterValue.year &&
                    match.competitionConcatRegion === filterValue.region &&
                    match.competitionRound.round === filterValue.round &&
                    (match.teamOneName.toLowerCase() === filterValue.golfClub || match.teamTwoName.toLowerCase() === filterValue.golfClub)) {
                  return (
                    <>
                    <Col lg={{ span: 4 }} md={{ span: 12 }} xs={{ span: 12 }}  className='mt-2 mb-3 px-0 user-match-col'>
                      <Cards match={ match } />
                    </Col>
                    </>
                  )
                }
              }

              if ((!isEmpty(filterValue.year) && !isEmpty(filterValue.region) && !isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) ||
                  (!isEmpty(filterValue.year) && !isEmpty(filterValue.region) && isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub)) ||
                  (!isEmpty(filterValue.year) && isEmpty(filterValue.region) && !isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub))) {
                if ((moment(match.matchDateTime).format('YYYY') === filterValue.year && match.competitionConcatRegion === filterValue.region && match.competitionRound.round === filterValue.round) ||
                    (moment(match.matchDateTime).format('YYYY') === filterValue.year && match.competitionConcatRegion === filterValue.region && (match.teamOneName.toLowerCase() === filterValue.golfClub || match.teamTwoName.toLowerCase() === filterValue.golfClub)) ||
                    (moment(match.matchDateTime).format('YYYY') === filterValue.year && match.competitionRound.round === filterValue.round && (match.teamOneName.toLowerCase() === filterValue.golfClub || match.teamTwoName.toLowerCase() === filterValue.golfClub))) {

                  return (
                    <>
                    <Col lg={{ span: 4 }} md={{ span: 12 }} xs={{ span: 12 }}  className='mt-2 mb-3 px-0 user-match-col'>
                      <Cards match={ match } />
                    </Col>
                    </>
                  )
                }
              }

              if ((!isEmpty(filterValue.year) && !isEmpty(filterValue.region) && isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) ||
                  (!isEmpty(filterValue.year) && isEmpty(filterValue.region) && !isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) ||
                  (!isEmpty(filterValue.year) && isEmpty(filterValue.region) && isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub))) {
                if ((moment(match.matchDateTime).format('YYYY') === filterValue.year && match.competitionConcatRegion === filterValue.region) ||
                    (moment(match.matchDateTime).format('YYYY') === filterValue.year && match.competitionRound.round === filterValue.round) ||
                    (moment(match.matchDateTime).format('YYYY') === filterValue.year && (match.teamOneName.toLowerCase() === filterValue.golfClub || match.teamTwoName.toLowerCase() === filterValue.golfClub))) {

                  return (
                    <>
                    <Col lg={{ span: 4 }} md={{ span: 12 }} xs={{ span: 12 }}  className='mt-2 mb-3 px-0 user-match-col'>
                      <Cards match={ match } />
                    </Col>
                    </>
                  )
                }
              }
          
              if ((!isEmpty(filterValue.year) && isEmpty(filterValue.region) && isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) ||
                  (isEmpty(filterValue.year) && !isEmpty(filterValue.region) && isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) ||
                  (isEmpty(filterValue.year) && isEmpty(filterValue.region) && !isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) ||
                  (isEmpty(filterValue.year) && isEmpty(filterValue.region) && isEmpty(filterValue.round) && !isEmpty(filterValue.golfClub))) {
                if ((moment(match.matchDateTime).format('YYYY') === filterValue.year) ||
                  (match.competitionConcatRegion === filterValue.region) ||
                  (match.competitionRound.round === filterValue.round) ||
                  (match.teamOneName.toLowerCase() === filterValue.golfClub || match.teamTwoName.toLowerCase() === filterValue.golfClub)) {

                  return (
                    <>
                    <Col lg={{ span: 4 }} md={{ span: 12 }} xs={{ span: 12 }}  className='mt-2 mb-3 px-0 user-match-col'>
                      <Cards match={ match } />
                    </Col>
                    </>
                  )
                }
              }
          
              if (isEmpty(filterValue.year) && isEmpty(filterValue.region) && isEmpty(filterValue.round) && isEmpty(filterValue.golfClub)) {
                return (
                  <>
                  <Col lg={{ span: 4 }} md={{ span: 12 }} xs={{ span: 12 }}  className='mt-2 mb-3 px-0 user-match-col'>
                    <Cards match={ match } />
                  </Col>
                  </>
                )
              }

              if ((i+1) === sortedMatchesByMatchDateTime.length) {
                if (!matchYears.includes(filterValue.year)) {
                  return (
                    <div style={{ textAlign: "center" }}>
                      <br />
                      <br />
                      <h5>You haven't created any matches for {filterValue.year} 🙁</h5>
                    </div>
                  )
                }
              }
            })}
            </>
          :
            null
          }
          </>
        )}
      />
      </Row>
    </Container>
    <Footer />
    </>
  );
}

export default Matches;