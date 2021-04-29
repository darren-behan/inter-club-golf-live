import React, { useContext } from 'react';
import './index.css';
import { useLocation } from 'react-router-dom';
import HeaderAuthenticated from './isAuthenticated';
import DataAreaContext from '../../utils/DataAreaContext';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Bootstrap } from 'react-bootstrap-icons';

function Header() {
  const { isAuthenticated } = useContext(DataAreaContext);
  const location = useLocation();

  return (
    <header>
      <Navbar sticky="top" className='navbar justify-content-between'>
        <Col sm={4} lg={4}>
          <Navbar.Brand href="#home">
            <Bootstrap color="green" size={40}/>
            Inter-club Golf Live
          </Navbar.Brand>
        </Col>
        <Col sm={4} lg={4}>
          <Nav justify variant="tabs" activeKey={location.pathname} className="justify-content-center">
            <Nav.Item>
              <Nav.Link href="/">Home</Nav.Link>
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
        </Col>
        <Col sm={4} lg={4}>
          {!isAuthenticated ? (
            <>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text className='welcome-div justify-content-end'>
                Not logged in
              </Navbar.Text>
            </Navbar.Collapse>
            </>
          ) : (
            <HeaderAuthenticated className='hero-header-authenticated'/>
          )}
        </Col>
      </Navbar>
    </header>
  );
}

export default Header;
