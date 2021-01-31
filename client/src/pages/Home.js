import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import DataAreaContext from '../utils/DataAreaContext';
import Table from '../components/MatchesTable';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

function Home() {
  const { allMatches } = useContext(DataAreaContext);

  console.log(allMatches);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5">
        Home
        </Typography>
        <Link to="/matches">Matches</Link>
        <Link to="/login">Login</Link>
      </div>
      <Table />
    </Container>
  );
}

export default Home;