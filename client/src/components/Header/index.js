import React, { useContext, useState } from 'react';
import './index.css';
import API from "../../utils/API";
import { useLocation, Link } from 'react-router-dom';
import DataAreaContext from '../../utils/DataAreaContext';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Bootstrap } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faGolfBall, faSignInAlt, faUserPlus, faFilter } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const { isAuthenticated, setFilterValue, setShow, userDataObj, setUserDataObj, setIsAuthenticated } = useContext(DataAreaContext);
  const location = useLocation();
	const [errors, setErrors] = useState( [] );

  const onClickSignOutUser = (e) => {
		e.preventDefault();
    API.signOutUser({})
		.then((response) => {
      console.log(response);
			localStorage.setItem('AuthToken', "");
			setUserDataObj({});
			setIsAuthenticated(false);
		})
		.catch(error => {
			setErrors(error.response);
		});
  }

  return (
    <Navbar expand="md" sticky="top" id='navbar' className="navbar-light justify-content-center py-3 py-sm-0 px-0" style={{ backgroundColor: '#ffffff' }}>
      <Container style={{ flexDirection: 'row' }}>
        {(location.pathname === "/matches" || location.pathname === `/usermatches/${userDataObj.uid}`) ? (
          <Button
            onClick={() => setShow(true)}
            variant="outline-success"
            className="mx-3 ml-sm-0"
          >
            <FontAwesomeIcon icon={ faFilter } className='fa-lg'/>
          </Button>
          ) : (
            null
          )
        }
        <Navbar.Brand href="/" className='mx-3 mx-sm-0' style={{ color: 'green' }}>
          <Bootstrap size={38}/>
        </Navbar.Brand>
        <Navbar.Toggle className='mx-3 mx-sm-0'  aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-start">
          <Nav justify className="ml-auto mb-0" activeKey={location.pathname}>
            <Nav.Item className="mx-1 mx-sm-0">
              <Nav.Link className='p-3' as={ Link } to="/" eventKey="/" onClick={() => setFilterValue("")}>
                <FontAwesomeIcon icon={ faHome } className='fa-lg'/>
                <p className='mb-0'>Home</p>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-1 mx-sm-0">
              <Nav.Link className='p-3' as={ Link } to="/matches" eventKey="/matches" onClick={() => setFilterValue("")}>
                <FontAwesomeIcon icon={ faGolfBall } className='fa-lg'/>
                <p className='mb-0'>Matches</p>
              </Nav.Link>
            </Nav.Item>
            {!isAuthenticated ? (
              <>
              <Nav.Item className="mx-1 mx-sm-0">
                <Nav.Link className='p-3' as={ Link } to="/login" eventKey="/login" onClick={() => setFilterValue("")}>
                  <FontAwesomeIcon icon={ faSignInAlt } className='fa-lg'/>
                  <p className='mb-0'>Login</p>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mx-1 mx-sm-0">
                <Nav.Link className='p-3 pr-md-0' as={ Link } to="/signup" eventKey="/signup" id="sign-up" onClick={() => setFilterValue("")}>
                  <FontAwesomeIcon icon={ faUserPlus } className='fa-lg'/>
                  <p className='mb-0'>Signup</p>
                </Nav.Link>
              </Nav.Item>
              </>
            ) : (
              <>
              <Nav.Item className="mx-1 mx-sm-0">
                <Nav.Link className='p-3 pr-md-0' as={ Link } to="/login" eventKey="/login" onClick={(e) => onClickSignOutUser(e)}>
                  <FontAwesomeIcon icon={ faSignInAlt } className='fa-lg'/>
                  <p className='mb-0'>Logout</p>
                </Nav.Link>
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
