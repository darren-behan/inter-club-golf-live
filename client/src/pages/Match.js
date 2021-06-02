import React from 'react';
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Container from '@material-ui/core/Container';

function Match() {
  const { id } = useParams()

  return (
    <>
    <Header />
    <Container component="main" maxWidth="xs">  
      <div>
        <h2>Match - { id } </h2>
      </div>
    </Container>
    </>
  )
}

export default Match;