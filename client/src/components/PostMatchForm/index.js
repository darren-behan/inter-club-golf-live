import React, { useContext, useState } from 'react';
import API from "../../utils/API";
import Lib from "../../utils/Lib";
import DataAreaContext from '../../utils/DataAreaContext';
import CreateMatchModal from '../Modals/CreateMatchModal';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import 'moment-timezone';
import competition from '../../assets/competitions.json';
import matchData from '../../assets/matchdata.json';
let isEmpty = require('lodash.isempty');

const styles = makeStyles((theme) => ({
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
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
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
}));

const rounds = [
  {
    round: '1'
  },
  {
    round: '2'
  },
  {
    round: '3'
  },
  {
    round: '4'
  },
  {
    round: '5'
  },
  {
    round: '6'
  },
  {
    round: 'last 32'
  },
  {
    round: 'last 16'
  },
  {
    round: 'quarter finals'
  },
  {
    round: 'semi finals'
  },
  {
    round: 'final'
  },
];

const regions = [
  {
    region: 'leinster'
  },
  {
    region: 'ulster'
  },
  {
    region: 'munster'
  },
  {
    region: 'connacht'
  },
  {
    region: 'all ireland'
  }
];

const inputFieldValues = [
	{
		name: "matchDate",
		label: "",
		id: "matchDate",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: "date",
		select: false,
		helperText: "Choose the match date"
	},
	{
		name: "matchTime",
		label: "",
		id: "matchTime",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: "time",
		select: false,
		helperText: "Choose the match time"
	},
	{
		name: "competitionName",
		label: "",
		id: "competitionName",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: "",
		select: true,
		helperText: "Choose the name of the competition"
	},
	{
		name: "competitionRegion",
		label: "",
		id: "competitionRegion",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: "",
		select: true,
		helperText: "Choose the region the competition is located"
	},
	{
		name: "competitionRound",
		label: "",
		id: "competitionRound",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: "",
		select: true,
		helperText: "Choose the round of the competition"
	},
	{
		name: "teamOneName",
		label: "",
		id: "teamOneName",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: "",
		select: false,
		helperText: "Choose the home team name"
	},
	{
		name: "teamTwoName",
		label: "",
		id: "teamTwoName",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: "",
		select: false,
		helperText: "Choose the away team name"
	}
	// {
	// 	name: "numIndividualMatches",
	// 	label: "",
	// 	id: "numIndividualMatches",
	// 	required: true,
	// 	fullWidth: true,
	// 	autoComplete: "autoComplete",
	// 	autoFocus: false,
	// 	type: "number",
	// 	select: false,
	// 	helperText: "Choose the number of individual matches"
	// }
];

function PostMatch() {
	const { appMatchesOnLoad, postMatchObj, setPostMatchObj, userDataObj, setAppMatchesOnLoad, timeZone, createMathModalShow, setCreateMatchModalShow, setCreateMatchResponse } = useContext(DataAreaContext);
  const [errors, setErrors] = useState({});
	const classes = styles();
	const [loading, setLoading] = useState( false );
	let filteredMatchArray = [];

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
		event.preventDefault();
    const { name, value } = event.target;
		setPostMatchObj({...postMatchObj, [name]: value})
  };

  const handleIndividualMatchFieldInputChange = (event) => {
		event.preventDefault();
    const { name, value } = event.target;

		for (let i = 0; i < filteredMatchArray.length; i++) {
			let match = filteredMatchArray[i];
			let keys = Object.keys(filteredMatchArray[i]);
			for (let i = 0; i < keys.length; i++) {
				if (name === keys[i]) {
					match[name] = value;
					setPostMatchObj({...postMatchObj, "individualMatchesArray": filteredMatchArray})
					return;
				}
			}
		}
  };

	let homeTeamName = postMatchObj['teamOneName'];
	let awayTeamName = postMatchObj['teamTwoName'];
	let competitionName = postMatchObj['competitionName'];
	
	const competitors = [
		{
			name: homeTeamName
		},
		{
			name: awayTeamName
		}
	];
	let competitionObject;

	const getIndividualMatchFields = () => {
		let textFields = [];
		for(let i = 0; i < competition.length; i++) {
			if (competition[i].name == competitionName) {
				competitionObject = competition[i];
			}
		}

		if (isEmpty(competitionObject)) return;
		if (isEmpty(homeTeamName)) return;
		if (isEmpty(awayTeamName)) return;

		matchData.filter(function(value, index, arr){ 
			if (index < competitionObject.matches) {
				filteredMatchArray.push(value);
			}
		});
		
		for (let i = 0; i < competitionObject.matches; i++) {
			{competitionObject.singlePlayer === true ? 
				textFields.push(
					<>
					<TextField
						key={i+1}
						variant="outlined"
						margin="normal"
						fullWidth
						id={'homeMatch' + (i + 1) + 'PlayerAName'}
						label=''
						name={'homeMatch' + (i + 1) + 'PlayerAName'}
						type=''
						select={false}
						error={errors['homeMatch' + (i + 1) + 'PlayerAName']}
						autoComplete={'autoComplete'}
						autoFocus={false}
						onChange={handleIndividualMatchFieldInputChange}
						helperText={`Match ${(i + 1)}: ${Lib.capitalize(homeTeamName)} player name (if known)`}
					/>
					<TextField
						key={i+1}
						variant="outlined"
						margin="normal"
						fullWidth
						id={'awayMatch' + (i + 1) + 'PlayerAName'}
						label=''
						name={'awayMatch' + (i + 1) + 'PlayerAName'}
						type=''
						select={false}
						error={errors['awayMatch' + (i + 1) + 'PlayerAName']}
						autoComplete={'autoComplete'}
						autoFocus={false}
						onChange={handleIndividualMatchFieldInputChange}
						helperText={`Match ${(i + 1)}: ${Lib.capitalize(awayTeamName)} player name (if known)`}
					/>
					<TextField
						key={i+1}
						variant="outlined"
						margin="normal"
						fullWidth
						id={'match' + (i + 1) + 'Destination'}
						label=''
						name={'match' + (i + 1) + 'Destination'}
						type=''
						select={true}
						error={errors['match' + (i + 1) + 'Destination']}
						autoComplete={'autoComplete'}
						autoFocus={false}
						onChange={handleIndividualMatchFieldInputChange}
						helperText={'Choose the course the match is played at'}
					>
						{competitors.map((clubName, index) => (
							<MenuItem key={index} value={clubName.name}>
								{Lib.capitalize(clubName.name)}
							</MenuItem>
						))}
					</TextField>
					</>
				) :
				textFields.push(
					<>
					<TextField
						key={i+1}
						variant="outlined"
						margin="normal"
						fullWidth
						id={'homeMatch' + (i + 1) + 'PlayerAName'}
						label=''
						name={'homeMatch' + (i + 1) + 'PlayerAName'}
						type=''
						select={false}
						error={errors['homeMatch' + (i + 1) + 'PlayerAName']}
						autoComplete={'autoComplete'}
						autoFocus={false}
						onChange={handleIndividualMatchFieldInputChange}
						helperText={`Match ${(i + 1)}: ${Lib.capitalize(homeTeamName)} player A name (if known)`}
					/>
					<TextField
						key={i+1}
						variant="outlined"
						margin="normal"
						fullWidth
						id={'homeMatch' + (i + 1) + 'PlayerBName'}
						label=''
						name={'homeMatch' + (i + 1) + 'PlayerBName'}
						type=''
						select={false}
						error={errors['homeMatch' + (i + 1) + 'PlayerBName']}
						autoComplete={'autoComplete'}
						autoFocus={false}
						onChange={handleIndividualMatchFieldInputChange}
						helperText={`Match ${(i + 1)}: ${Lib.capitalize(homeTeamName)} player B name (if known)`}
					/>
					<TextField
						key={i+1}
						variant="outlined"
						margin="normal"
						fullWidth
						id={'awayMatch' + (i + 1) + 'PlayerAName'}
						label=''
						name={'awayMatch' + (i + 1) + 'PlayerAName'}
						type=''
						select={false}
						error={errors['awayMatch' + (i + 1) + 'PlayerAName']}
						autoComplete={'autoComplete'}
						autoFocus={false}
						onChange={handleIndividualMatchFieldInputChange}
						helperText={`Match ${(i + 1)}: ${Lib.capitalize(awayTeamName)} player A name (if known)`}
					/>
					<TextField
						key={i+1}
						variant="outlined"
						margin="normal"
						fullWidth
						id={'awayMatch' + (i + 1) + 'PlayerBName'}
						label=''
						name={'awayMatch' + (i + 1) + 'PlayerBName'}
						type=''
						select={false}
						error={errors['awayMatch' + (i + 1) + 'PlayerBName']}
						autoComplete={'autoComplete'}
						autoFocus={false}
						onChange={handleIndividualMatchFieldInputChange}
						helperText={`Match ${(i + 1)}: ${Lib.capitalize(awayTeamName)} player B name (if known)`}
					/>
					<TextField
						key={i+1}
						variant="outlined"
						margin="normal"
						fullWidth
						id={'match' + (i + 1) + 'Destination'}
						label=''
						name={'match' + (i + 1) + 'Destination'}
						type=''
						select={true}
						error={errors['match' + (i + 1) + 'Destination']}
						autoComplete={'autoComplete'}
						autoFocus={false}
						onChange={handleIndividualMatchFieldInputChange}
						helperText={'Choose the course the match is played at'}
					>
						{competitors.map((clubName, index) => (
							<MenuItem key={index} value={clubName.name}>
								{Lib.capitalize(clubName.name)}
							</MenuItem>
						))}
					</TextField>
					</>
				)
			}
		}
		return textFields;
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		setLoading(true);
    API.postMatch({
			timeZone: timeZone,
      matchDateTime: moment(`${postMatchObj.matchDate} ${postMatchObj.matchTime}`).format(),
      createdAt: moment().format(),
      updatedAt: moment().format(),
      competitionName: postMatchObj.competitionName,
      competitionRegion: postMatchObj.competitionRegion,
      competitionRound: postMatchObj.competitionRound,
      numIndividualMatches: competitionObject.matches,
			individualMatch: postMatchObj.individualMatchesArray,
      teamOneName: postMatchObj.teamOneName,
      teamTwoName: postMatchObj.teamTwoName,
			uid: userDataObj.uid
		})
		.then((response) => {
			setAppMatchesOnLoad([response.data, ...appMatchesOnLoad]);
			setCreateMatchResponse({
				matchId: response.data.matchId,
				message: "Match created successfully",
				status: 200
			});
			setCreateMatchModalShow(true);
      setLoading(false);
		})
		.catch(error => {
			console.log(error);
			setCreateMatchResponse({
				message: error.response.data.error,
				status: error.response.status
			});
			setCreateMatchModalShow(true);
			setLoading(false);
		});
	};

	const formIsValid = () => {
		const isValid =
			postMatchObj.matchDate &&
			postMatchObj.matchTime &&
			postMatchObj.competitionName &&
			postMatchObj.competitionRegion &&
			postMatchObj.competitionRound &&
			postMatchObj.teamOneName &&
			postMatchObj.teamTwoName &&
			Object.values(errors).every((x) => x === "");

		return isValid;
	};

	return (
		<>
		<CreateMatchModal
			show={createMathModalShow}
			onHide={() => setCreateMatchModalShow(false)} 
		/>
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Create Match
				</Typography>
				<form className={classes.form} noValidate>
					{inputFieldValues.map((inputFieldValue, index) => {
						return (
							<TextField
								key={index}
								variant="outlined"
								margin="normal"
								required={inputFieldValue.required}
								fullWidth={inputFieldValue.fullWidth}
								id={inputFieldValue.id}
								label={inputFieldValue.label}
								name={inputFieldValue.name}
								type={inputFieldValue.type}
								select={inputFieldValue.select}
								error={errors[inputFieldValue.name]}
								autoComplete={inputFieldValue.autoComplete}
								autoFocus={inputFieldValue.autoFocus}
								onChange={handleInputChange}
								helperText={inputFieldValue.helperText}
							>
								{inputFieldValue.id === 'competitionName' ? 
									competition.map((competition, index) => (
										<MenuItem key={index} value={competition.name}>
											{competition.name}
										</MenuItem>
									))
									:
									null
								}
								{inputFieldValue.id === 'competitionRegion' ? 
									regions.map((region, index) => (
										<MenuItem key={index} value={region.region}>
											{Lib.capitalize(region.region)}
										</MenuItem>
									))
									:
									null
								}
								{inputFieldValue.id === 'competitionRound' ? 
									rounds.map((round, index) => (
										<MenuItem key={index} value={round.round}>
											{Lib.capitalize(round.round)}
										</MenuItem>
									))
									:
									null
								}
							</TextField>
						)
					})}
					{getIndividualMatchFields()}
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={handleSubmit}
						disabled={loading || !formIsValid()}
					>
						Submit
						{loading && <CircularProgress size={30} className={classes.progress} />}
					</Button>
				</form>
			</div>
		</Container>
		</>
	);
}

export default PostMatch;