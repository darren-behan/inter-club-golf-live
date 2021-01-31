import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import DataAreaContext from '../utils/DataAreaContext';
import Table from '../components/MatchesTable';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

function Matches() {
  const { allMatches } = useContext(DataAreaContext);
  const [textFieldDisabled, setTextFieldDisabled] = useState(true);

  console.log(allMatches);
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5">
        Home
        </Typography>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </div>
      <Table />
    </Container>
  );
}

export default Matches;