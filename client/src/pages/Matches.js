import React from 'react';
import Header from "../components/Header";
import Table from '../components/MatchesTable';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

function Matches() {
  
  return (
    <>
    <Header />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Table />
    </Container>
		</>
  );
}

export default Matches;