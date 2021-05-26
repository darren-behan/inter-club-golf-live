import React from 'react';
import Header from "../components/Header";
import Cards from '../components/Cards';
import Container from '@material-ui/core/Container';

function Home() {

  return (
    <>
    <Header />
    <Container component="main" maxWidth="xs">
      <Cards />
    </Container>
    </>
  );
}

export default Home;