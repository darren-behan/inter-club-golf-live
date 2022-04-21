import React, { useEffect, useContext, useState } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import Lib from '../utils/Lib';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGolfBall, faUser } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import FiltersOffCanvas from '../components/FiltersOffCanvas';
import { Container, Row, Col } from 'react-bootstrap';

function Profile() {
  const { appMatchesOnLoad, filterValue, setFilterValue, show, userDataObj } = useContext(DataAreaContext);
  const [componentToRender, setComponentToRender] = useState("userMatches");
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

  useEffect(() => {
    setFilterValue({
      year: "",
      region: "",
      round: "",
      golfClub: ""
    });
  }, [componentToRender]);

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
    <Header activeRender={ componentToRender } />
    <Container fluid className="profile-container d-flex flex-column px-0" style={{ boxShadow: "0 0 4px rgba(0,0,0,.1)" }}>
      <Row 
        className={(show) ? 'mt-3 mx-0' : ''}
        style={{ backgroundColor: '#ffffff', boxShadow: '0 0 4px rgba(0,0,0,.1)', borderRadius: '.25rem' }}>
        <FiltersOffCanvas 
          matches={sortedMatchesByMatchDateTime}
        />
      </Row>  
      <Row className="flex-fill mx-0">
        <Col sm="12" md="3" lg="2" className="px-3" style={{ backgroundColor: "rgb(255, 255, 255)", boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px" }}>
          <Row>
            <Navbar expand="md" className="flex-md-column">
              <Navbar.Brand>Hi, { Lib.capitalize(userDataObj.multiFactor.user.displayName) }</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" className="px-0" style={{ fontSize: "1.4rem", padding: "0px!important" }}/>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mb-0 flex-column" defaultActiveKey="userMatches">
                  <Nav.Item className="mx-0">
                    <Nav.Link className='px-0 py-2 pr-md-0' id="userMatches" eventKey="userMatches" onClick={() => setComponentToRender("userMatches")}>
                      <FontAwesomeIcon icon={ faGolfBall } className='fa-lg'/>
                      <span className='mb-0'> My matches</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="mx-0">
                    <Nav.Link className='px-0 py-2 pr-md-0' id="collaboratingMatches" eventKey="collaboratingMatches" onClick={() => setComponentToRender("collaboratingMatches")}>
                      <FontAwesomeIcon icon={ faGolfBall } className='fa-lg'/>
                      <span className='mb-0'> Collaborating matches</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="mx-0">
                    <Nav.Link className='px-0 py-2 pr-md-0' id="myAccount" eventKey="myAccount" onClick={() => setComponentToRender("myAccount")}>
                      <FontAwesomeIcon icon={ faUser } className='fa-lg'/>
                      <span className='mb-0'> My account</span>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Row>
        </Col>
        <Col sm="12" md="9" lg="10" className="">
          {
            componentToRender === "userMatches" ?
              <>
              My Matches
              </>
            : componentToRender === "collaboratingMatches" ?
              <>
              Collaborating Matches
              </>
            : componentToRender === "myAccount" ?
              <>
              My Account
              </>
            : setComponentToRender("userMatches")
          }
        </Col>
      </Row>
    </Container>
    <Footer />
    </>
  )
}

export default Profile;