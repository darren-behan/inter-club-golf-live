import React, { useState, useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';

const styles = (theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	progess: {
		position: 'absolute'
	}
});

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
        <form noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="teamOneScore"
            defaultValue={allMatches[0].teamOneScore}
            label={allMatches[0].teamOneScore}
            name="teamOneScore"
            disabled={textFieldDisabled}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="teamTwoScore"
            label={allMatches[0].teamTwoScore}
            name="teamTwoScore"
            disabled={textFieldDisabled}
          />
        </form>
      </div>
    </Container>
  );
}

export default withStyles(styles)(Matches);