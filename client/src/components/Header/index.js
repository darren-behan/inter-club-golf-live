import React, { useContext } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import HeaderAuthenticated from './isAuthenticated';
import DataAreaContext from '../../utils/DataAreaContext';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

function Header() {
  const { isAuthenticated } = useContext(DataAreaContext);

  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand href="#home">Inter-club Golf Live</Navbar.Brand>
      <Nav variant="tabs" defaultActiveKey="/home">
        <Nav.Item>
          <Nav.Link href="/home">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/matches">Matches</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/signup">Signup</Nav.Link>
        </Nav.Item>
      </Nav>
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-primary">Search</Button>
      </Form>
      {!isAuthenticated ? (
        <>
        <div className='welcome-div'>Not logged in</div>
        </>
      ) : (
        <HeaderAuthenticated className='hero-header-authenticated'/>
      )}
    </Navbar>
  );
}

export default Header;
