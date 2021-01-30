import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import DataAreaContext from '../utils/DataAreaContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
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
      <div>
        {allMatches === [] ? (
            <div></div> 
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Team One Score</th>
                  <th>Team Two Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{allMatches[1]?.teamOneScore}</td>
                  <td>{allMatches[1]?.teamTwoScore}</td>
                </tr>
              </tbody>
            </table>
          )
        }
      </div>
    </Container>
  );
}

export default Matches;