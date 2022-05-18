import React, { useContext, useRef } from 'react';
import './index.css';
import { useLocation, Link, useParams } from 'react-router-dom';
import DataAreaContext from '../../utils/DataAreaContext';
import Burger from '../BurgerMenuIcon';
import SideBar from '../SideBar';
import { Container, Navbar, Button, NavLink } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

function Header(props) {
  const { setShowFilters, sidebarOpen, setSidebarOpen, userDataObj } = useContext(DataAreaContext);
  const location = useLocation();
  const node = useRef();
  let { competition, status } = useParams();

  return (
    <Navbar
      expand="md"
      sticky="top"
      id="navbar"
      className="navbar-light justify-content-center py-3 px-0"
      style={{ backgroundColor: '#ffffff' }}
    >
      <Container style={{ flexDirection: 'row', padding: '0px' }}>
        <div ref={node} className="mx-3 mx-sm-0">
          <Burger open={sidebarOpen} setOpen={setSidebarOpen} />
          <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>
        <Navbar.Brand className="mx-3 mx-sm-0" style={{ color: '#000000' }}>
          <NavLink as={Link} to="/" className="link p-0" style={{ color: '#0a66c2', fontWeight: '500' }}>
            Inter Club Golf Ireland
          </NavLink>
        </Navbar.Brand>
        {location.pathname === `/competition/${competition}` ||
        location.pathname === `/usermatches/${userDataObj.uid}` ||
        (location.pathname === `/profile/${userDataObj.uid}` &&
          (props.activeRender === 'userMatches' || props.activeRender === 'collaboratingMatches')) ||
        location.pathname === `/matches/status/${status}` ? (
          <Button onClick={() => setShowFilters(true)} variant="outline-light" className="ml-3 ml-sm-0">
            <FontAwesomeIcon icon={faFilter} className="fa-lg" style={{ color: '#0a66c2' }} />
          </Button>
        ) : null}
      </Container>
    </Navbar>
  );
}

export default Header;
