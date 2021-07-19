import React, { useContext, useState } from 'react';
import Burger from '../BurgerMenuIcon';
import styled from 'styled-components';
import DataAreaContext from '../../utils/DataAreaContext';
import LocalStorage from '../../services/LocalStorage/LocalStorage.service';
import { useLocation, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faGolfBall, faSignInAlt, faUserPlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import firebase from "firebase/app";
import "firebase/auth";

const StyledMenu = styled.nav`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f3f2ef;
  transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
  height: 100vh;
  text-align: left;
  padding: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 576px) {
      width: 100%;
    }

  a {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5rem;
    text-decoration: none;
    transition: color 0.3s linear;

    @media (max-width: 576px) {
      font-size: 1.25rem;
      text-align: left;
    }
  }
`

function SideBar() {
  const { isAuthenticated, setFilterValue, userDataObj, setUserDataObj, setIsAuthenticated, sidebarOpen, setSidebarOpen } = useContext(DataAreaContext);
  const location = useLocation();
	const [errors, setErrors] = useState( [] );

  const onClickSignOutUser = (e) => {
		e.preventDefault();
    firebase.auth().signOut()
		.then((response) => {
			LocalStorage.remove('AuthToken');
			setUserDataObj({});
      setSidebarOpen(false);
			setIsAuthenticated(false);
		})
		.catch(error => {
			setErrors(error.response);
		});
  }

  const onClick = () => {
    setFilterValue("");
    setSidebarOpen(false);
  }

  return (
    <>
    <StyledMenu open={sidebarOpen}>
      <Burger open={sidebarOpen} setOpen={setSidebarOpen} style={{ float: "right" }}/>
      <Nav justify className="mb-0 flex-column" activeKey={location.pathname}>
        <Nav.Item className="mx-0">
          <Nav.Link className='px-0 py-4' as={ Link } to="/" eventKey="/" onClick={() => onClick()}>
            <FontAwesomeIcon icon={ faHome } className='fa-lg'/>
            <span className='mb-0'> Home</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="mx-0">
          <Nav.Link className='px-0 py-4' as={ Link } to="/matches" eventKey="/matches" onClick={() => onClick()}>
            <FontAwesomeIcon icon={ faGolfBall } className='fa-lg'/>
            <span className='mb-0'> Matches</span>
          </Nav.Link>
        </Nav.Item>
        {!isAuthenticated ? (
          <>
          <Nav.Item className="mx-0">
            <Nav.Link className='px-0 py-4' as={ Link } to="/login" eventKey="/login" onClick={() => onClick()}>
              <FontAwesomeIcon icon={ faSignInAlt } className='fa-lg'/>
              <span className='mb-0'> Login</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="mx-0">
            <Nav.Link className='px-0 py-4 pr-md-0' as={ Link } to="/signup" eventKey="/signup" id="sign-up" onClick={() => onClick()}>
              <FontAwesomeIcon icon={ faUserPlus } className='fa-lg'/>
              <span className='mb-0'> Signup</span>
            </Nav.Link>
          </Nav.Item>
          </>
        ) : (
          <>
          <Nav.Item className="mx-0">
            <Nav.Link className='px-0 py-4 pr-md-0' as={ Link } to={ "/usermatches/" + userDataObj.uid } eventKey={ "/usermatches/" + userDataObj.uid } id="usermatches" onClick={() => onClick()}>
              <FontAwesomeIcon icon={ faGolfBall } className='fa-lg'/>
              <span className='mb-0'> My matches</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="mx-0">
            <Nav.Link className='px-0 py-4 pr-md-0' as={ Link } to="/creatematch" eventKey="/creatematch" id="creatematch" onClick={() => onClick()}>
              <FontAwesomeIcon icon={ faPlus } className='fa-lg'/>
              <span className='mb-0'> Create match</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="mx-0">
            <Nav.Link className='px-0 py-4 pr-md-0' as={ Link } to="/login" eventKey="/login" onClick={(e) => onClickSignOutUser(e)}>
              <FontAwesomeIcon icon={ faSignInAlt } className='fa-lg'/>
              <span className='mb-0'> Logout</span>
            </Nav.Link>
          </Nav.Item>
          </>
        )}
      </Nav>
    </StyledMenu>
    </>
  );
}

export default SideBar;