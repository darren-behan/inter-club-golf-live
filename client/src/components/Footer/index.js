import React, { useContext } from 'react';
import './index.css';
import DataAreaContext from '../../utils/DataAreaContext';
import { Container, Navbar } from 'react-bootstrap';

function Footer() {
  const { isAuthenticated } = useContext(DataAreaContext);

  return (
    <Navbar expand="lg" variant="light" bg="light" fixed="bottom">
      <Container>
        {!isAuthenticated ? (
          <Navbar.Brand href="#">Navbar</Navbar.Brand>
        ) : (
          <div>Logged In</div>
        )}
      </Container>
    </Navbar>
  );
}

export default Footer;
