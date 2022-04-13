import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Row, Col } from 'react-bootstrap';

function Profile() {
  return (
    <>
    <Header />
    <Container fluid>  
      <Row className="flex-xl-nowrap">
        <Col sm="12" md="3" lg="2" className="d-flex flex-column">
          Left Column
        </Col>
        <Col sm="12" md="9" lg="10" className="d-flex flex-column">
          Right Column
        </Col>
      </Row>
    </Container>
    <Footer />
    </>
  )
}

export default Profile;