import React, { useContext } from 'react';
import './index.css';
import { useLocation, Link } from 'react-router-dom';
import DataAreaContext from '../../utils/DataAreaContext';
import { Container, Navbar, Button, Nav, NavDropdown } from 'react-bootstrap';
import { Bootstrap } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faGolfBall, faSignInAlt, faUserPlus, faUserCircle } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const { isAuthenticated, isActive, setActive } = useContext(DataAreaContext);
  const location = useLocation();

  return (
    <Navbar expand="md" sticky="top" id='navbar' className="navbar-light justify-content-center" style={{ backgroundColor: '#ffffff' }}>
      <Container>
        <Navbar.Brand href="#home" style={{ color: 'green' }}>
          <Bootstrap size={38}/>
        </Navbar.Brand>
        <Button
          onClick={() => setActive(!isActive)}
          aria-controls="filters-collapse"
          aria-expanded={isActive}
          variant="outline-success"
          style={{ margin: '0 0.5rem 0 0.5rem' }}
        >
          Filters
        </Button>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-start">
          <Nav justify className="ml-auto" activeKey={location.pathname} style={{ borderBottom: '0' }}>
            <Nav.Item>
              <Nav.Link as={ Link } to="/" eventKey="/">
                <FontAwesomeIcon icon={ faHome } className='fa-lg'/>
                <p style={{ marginBottom: '0' }}>Home</p>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={ Link } to="/matches" eventKey="/matches">
                <FontAwesomeIcon icon={ faGolfBall } className='fa-lg'/>
                <p style={{ marginBottom: '0' }}>Matches</p>
              </Nav.Link>
            </Nav.Item>
            {!isAuthenticated ? (
              <>
              <Nav.Item>
                <Nav.Link as={ Link } to="/login" eventKey="/login">
                  <FontAwesomeIcon icon={ faSignInAlt } className='fa-lg'/>
                  <p style={{ marginBottom: '0' }}>Login</p>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={ Link } to="/signup" eventKey="/signup" id="sign-up">
                  <FontAwesomeIcon icon={ faUserPlus } className='fa-lg'/>
                  <p style={{ marginBottom: '0' }}>Signup</p>
                </Nav.Link>
              </Nav.Item>
              </>
            ) : (
              <>
              <Nav.Item>
                <NavDropdown title={
                  <div style={{display: "inline-block"}}>
                    <FontAwesomeIcon icon={ faUserCircle } className='fa-lg'/>
                    <p style={{ marginBottom: '0' }}> Me </p>
                  </div>
                } id="collasible-nav-dropdown">
                  <NavDropdown.Item as={ Link } to="/profile" eventKey="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={ Link } to="/settings" eventKey="/settings">
                    Settings
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
