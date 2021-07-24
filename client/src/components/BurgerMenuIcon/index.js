import React, { useContext } from 'react';
import styled from 'styled-components';
import DataAreaContext from '../../utils/DataAreaContext';

// https://codepen.io/maximakymenko/pen/aboWJpX/

const StyledBurger = styled.button`
  top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;

  &:focus {
    outline: none;
  }

  div {
    width: 2rem;
    height: 0.25rem;
    background: ${({ open }) => open ? '#0a66c2' : '#0a66c2'};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }

    :nth-child(2) {
      opacity: ${({ open }) => open ? '0' : '1'};
      transform: ${({ open }) => open ? 'translateX(20px)' : 'translateX(0)'};
    }

    :nth-child(3) {
      transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`

function Burger() {
  const { sidebarOpen, setSidebarOpen } = useContext(DataAreaContext);

  return (
    <StyledBurger open={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)}>
      <div />
      <div />
      <div />
    </StyledBurger>
  );
}

export default Burger;