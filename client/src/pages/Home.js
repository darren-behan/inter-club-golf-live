import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../components/MatchesTable';
import PostMatch from '../components/PostMatchForm';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

function Home() {

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
      <PostMatch />
    </Container>
  );
}

export default Home;