import React from 'react';
import './index.css';
import { Navbar } from 'react-bootstrap';

function Footer() {

  return (
    <Navbar id='navbar-footer' expand="md" variant="light" bg="light" fixed="" className="navbar-light justify-content-center p-0" style={{ backgroundColor: '#ffffff' }}>
      <Navbar.Brand href="#home" className='mx-3 mx-sm-0' style={{ color: 'green' }}>
        <p className='my-0'>The Creative Dream</p>
      </Navbar.Brand>
    </Navbar>
  );
}

export default Footer;
