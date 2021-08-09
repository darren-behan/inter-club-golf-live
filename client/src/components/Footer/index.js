import React from 'react';
import './index.css';
import { Container, Row, Col, ListGroup, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {

  return (
    <>
    <footer style={{ boxShadow: '0 0 4px rgba(0,0,0,.1)' }}>
      <Container className="pt-5">
        <Row>
          <Col className="col-6 px-3 px-md-0 mx-0 text-center">
            <h6 className="mb-4 font-weight-bold text-uppercase">Company</h6>
            <ListGroup>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <NavLink as={ Link } to="/about" className="link p-0">
                  About
                </NavLink>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <NavLink as={ Link } to="/login" className="link p-0">
                  Login
                </NavLink>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <NavLink as={ Link } to="/signup" className="link p-0">
                  Join
                </NavLink>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <NavLink as={ Link } to="/" className="link p-0">
                  Advertising
                </NavLink>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <NavLink as={ Link } to="/" className="link p-0">
                  Site map
                </NavLink>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col className="col-6 px-3 mx-0 text-center">
            <h6 className="mb-4 font-weight-bold text-uppercase">Contact</h6>
            <ListGroup>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <NavLink as={ Link } to="/" className="link p-0">
                  Contact Us
                </NavLink>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <NavLink as={ Link } to="/" className="link p-0">
                  Privacy Policy
                </NavLink>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col className="col-12 px-0">
            <div className="py-4 d-flex justify-content-center align-items-center">
              <a href="https://www.thecreativedream.ie" target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#000000" }}>
                &copy; The Creative Dream
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
    </>
  );
}

export default Footer;
