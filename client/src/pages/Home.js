import React, { useContext, useEffect } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from '../components/Carousel';
import ComboBox from '../components/ComboBox';
import HeroImage from '../assets/img/home-hero.jpg';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { IsEmpty } from "react-lodash";
import AdSense from 'react-adsense';

function Home() {
  const { appMatchesOnLoad } = useContext(DataAreaContext);
  const RowStyles = {
    backgroundImage: 'url(' + HeroImage + ')',
    height: "70vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    margin: 0,
    borderBottomColor: '1px solid rgba(0,0,0,.1)',
    justifyContent: "center"
  };

  return (
    <>
    <Header />
    <Row style={ RowStyles }>
      <Col className="combo-wrapper p-0">
        <div className="hero-content mx-3">
          <Container className="search-wrapper-container">
            <Row className="search-wrapper" style={{ justifyContent: "center" }}>
              <ComboBox />
            </Row>
          </Container>
        </div>
      </Col>
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
    <IsEmpty
      value={appMatchesOnLoad}
      yes={() =>
        <>
        <br />
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