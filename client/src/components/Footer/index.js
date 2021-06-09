import React from 'react';
import './index.css';
import { Container, Navbar } from 'react-bootstrap';

function Footer() {

  return (
    <Navbar expand="lg" variant="light" bg="light" fixed="bottom">
      <Container>
        <Navbar.Brand href="#">Navbar</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Footer;
