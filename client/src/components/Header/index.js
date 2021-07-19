import React, { useContext, useRef } from 'react';
import './index.css';
import { useLocation, Link } from 'react-router-dom';
import DataAreaContext from '../../utils/DataAreaContext';
import Burger from '../BurgerMenuIcon';
import SideBar from '../SideBar';
import { Container, Navbar, Button, NavLink } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const { setShow, userDataObj, sidebarOpen, setSidebarOpen } = useContext(DataAreaContext);
  const location = useLocation();
  const node = useRef();

  return (
    <Navbar expand="md" sticky="top" id='navbar' className="navbar-light justify-content-center py-3 px-0" style={{ backgroundColor: '#ffffff' }}>
      <Container style={{ flexDirection: 'row', padding: "0px" }}>
        <Navbar.Brand className='mx-3 mx-sm-0' style={{ color: '#000000' }}>
          <NavLink as={ Link } to="/" className="link p-0" style={{ color: '#000000' }}>
            Inter Club Golf Live
          </NavLink>
        </Navbar.Brand>
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
        <div ref={node} className="mx-3 mx-sm-0">
          <Burger open={sidebarOpen} setOpen={setSidebarOpen} />
          <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
