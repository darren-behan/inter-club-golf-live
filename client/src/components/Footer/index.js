import React, { useContext } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import DataAreaContext from '../../utils/DataAreaContext';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faGolfBall, faPlus } from '@fortawesome/free-solid-svg-icons';

function Footer() {
  const { isAuthenticated, userDataObj, resetFilterValues } = useContext(DataAreaContext);

  return (
    <Navbar id='navbar-footer' expand="md" variant="light" bg="light" fixed="bottom" className="navbar-light justify-content-center p-0" style={{ backgroundColor: '#ffffff' }}>
      {isAuthenticated ? (
        <Navbar.Brand href="#home" className='mx-3 mx-sm-0' style={{ color: 'green' }}>
          <p>The Creative Dream</p>
        </Navbar.Brand>
      ) : (
        <>
        <Nav justify className="justify-content-center mb-0" style={{ flexDirection: 'row' }}>
          <Nav.Item className="">
            <Nav.Link className='p-3' as={ Link } to={ "/usermatches/" + userDataObj.uid } eventKey={ "/usermatches/" + userDataObj.uid }>
              <Button
                variant="outline-success"
                onClick={() => resetFilterValues()}
              >
                <FontAwesomeIcon icon={ faGolfBall } className='fa-lg'/>
              </Button>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="">
            <Nav.Link className='p-3' as={ Link } to="/creatematch" eventKey="/creatematch">
              <Button
                variant="outline-success"
                onClick={() => resetFilterValues()}
              >
                <FontAwesomeIcon icon={ faPlus } className='fa-lg'/>
              </Button>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="">
            <Nav.Link className='p-3' as={ Link } to="/profile" eventKey="/profile">
              <Button
                variant="outline-success"
                onClick={() => resetFilterValues()}
              >
                <FontAwesomeIcon icon={ faUserCircle } className='fa-lg'/>
              </Button>
            </Nav.Link>
          </Nav.Item> 
        </Nav>
        </>
      )}
    </Navbar>
  );
}

export default Footer;
