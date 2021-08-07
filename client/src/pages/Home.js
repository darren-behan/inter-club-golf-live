import React, { useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from '../components/Carousel';
import ComboBox from '../components/ComboBox';
import { Row, Col, Spinner } from 'react-bootstrap';
import { IsEmpty } from "react-lodash";
import AdSense from 'react-adsense';

function Home() {
  const { appMatchesOnLoad } = useContext(DataAreaContext);
  const RowStyles = {
    height: "71vh",
    margin: 0,
    justifyContent: "center"
  };

  return (
    <>
    <Header />
    <Row style={ RowStyles }>
      <Col className="pt-4" xs={{ span: 12 }}>
        <p className="mx-1" style={{ fontSize: "2rem", fontWeight: "900" }}>
          Support your
          <br />
          club on the
          <br />
          inter club
          <br />
          stage
        </p>
        <p className="m-0 mx-1" style={{ fontSize: "1rem" }}>
          Know your clubs upcoming, in progress &amp; completed inter club matches across various golf tournaments.
        </p>
        <br />
        <div className="mx-1">
          <ComboBox />
        </div>
      </Col>
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
    <IsEmpty
      value={appMatchesOnLoad}
      yes={() =>
        <>
        <Row style={{ justifyContent: "center" }}>
          <Spinner animation="grow" style={{ color: "#0a66c2" }} />
        </Row>
        <br />
        </>
      }
      no={() => (
        <Carousel className='mt-3 pb-4'/>
      )}
    />
    <Footer />
    </>
  );
}

export default Home;