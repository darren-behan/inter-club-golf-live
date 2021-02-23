import React from 'react';
import Header from "../components/Header";
import Table from '../components/MatchesTable';
import PostMatch from '../components/PostMatchForm';
import Container from '@material-ui/core/Container';

function Home() {

  return (
    <>
    <Header />
    <Container component="main" maxWidth="xs">
      <Table />
      <PostMatch />
    </Container>
    </>
  );
}

export default Home;