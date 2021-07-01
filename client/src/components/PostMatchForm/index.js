import React, { useContext, useState } from 'react';
import API from "../../utils/API";
import DataAreaContext from '../../utils/DataAreaContext';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import 'moment-timezone';
// const moment = require('moment-timezone');

const styles = makeStyles({
	paper: {
		marginTop: 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: 1,
		backgroundColor: 'grey'
	},
	form: {
		width: '100%',
		marginTop: 1
	},
	submit: {
		margin: 3
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	progress: {
		position: 'absolute'
	}
});

function PostMatch() {
	const { appMatchesOnLoad, postMatchObj, setPostMatchObj, setAppMatchesOnLoad, timeZone } = useContext(DataAreaContext);
	const classes = styles();
	const [loading, setLoading] = useState( false );

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
		event.preventDefault();
    const { name, value } = event.target;
		setPostMatchObj({...postMatchObj, [name]: value})
  };

	const handleSubmit = (event) => {
		event.preventDefault();
		setLoading(true);
    API.postMatch({
			timeZone: timeZone,
      matchDateTime: moment(`${postMatchObj.matchDate} ${postMatchObj.matchTime}`).format(),
      createdAt: moment().format(),
      updatedAt: moment().format(),
      competitionName: postMatchObj.competitionName,
      numIndividualMatches: parseInt(postMatchObj.numIndividualMatches),
      teamOneName: postMatchObj.teamOneName,
      teamTwoName: postMatchObj.teamTwoName
		})
		.then((response) => {
			setAppMatchesOnLoad([response.data, ...appMatchesOnLoad]);
      setLoading(false);
		})
		.catch(error => {
			console.log(error);
			setLoading(false);
		});
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Create Match
				</Typography>
				<form className={classes.form} noValidate>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="matchDate"
						name="matchDate"
						type="date"
						autoFocus
						onChange={handleInputChange}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="matchTime"
						id="matchTime"
						type="time"
						autoFocus
						onChange={handleInputChange}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="competitionName"
						id="competitionName"
            label="Competition Name"
						autoFocus
						onChange={handleInputChange}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="numIndividualMatches"
						id="numIndividualMatches"
						type="number"
            label="Enter number of individual matches"
						autoFocus
						onChange={handleInputChange}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="teamOneName"
						id="teamOneName"
            label="Home Team Name"
						autoFocus
						onChange={handleInputChange}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="teamTwoName"
						id="teamTwoName"
            label="Away Team Name"
						autoFocus
						onChange={handleInputChange}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={handleSubmit}
						disabled={loading || !postMatchObj.matchDate || !postMatchObj.matchTime}
					>
						Submit
						{loading && <CircularProgress size={30} className={classes.progress} />}
					</Button>
				</form>
			</div>
		</Container>
	);
}

export default PostMatch;