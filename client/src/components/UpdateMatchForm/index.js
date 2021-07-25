import React, { useContext, useState } from 'react';
import Lib from "../../utils/Lib";
import DataAreaContext from '../../utils/DataAreaContext';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';
import 'moment-timezone';
import competition from '../../assets/data/competitions.json';
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
    }
  },
	textField: {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0a66c2"
    },
    "& .MuiSvgIcon-root": {
      fill: "#0a66c2"
    }
	},
	notchedOutline: {
    borderColor: '#0a66c2 !important'
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

function UpdateMatch() {
	const { updateMatchObj, setUpdateMatchObj, timeZone } = useContext(DataAreaContext);
  const [errors, setErrors] = useState({});
	const classes = styles();

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
	
	const matchStatuses = [
		{
			status: 'not started'
		},
		{
			status: 'in progress'
		},
		{
			status: 'complete'
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
			disabled: true,
			type: "",
			select: false,
			helperText: "If you've entered the match date incorrectly, please delete this match & create a new match",
			value: moment(updateMatchObj.matchDateTime).format('dddd, MMMM Do YYYY')
		},
		{
			name: "matchTime",
			label: "",
			id: "matchTime",
			required: true,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			disabled: true,
			type: "",
			select: false,
			helperText: "If you've entered the match time incorrectly, please delete this match & create a new match",
			value: moment(updateMatchObj.matchDateTime).tz(timeZone).format('HH:mm z')
		},
		{
			name: "competitionName",
			label: "",
			id: "competitionName",
			required: true,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			value: updateMatchObj.competitionName,
			disabled: true,
			type: "",
			select: false,
			helperText: "If you've chosen the wrong competition, please delete this match & create a new match"
		},
		{
			name: "matchStatus",
			label: "",
			id: "matchStatus",
			required: true,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			value: updateMatchObj.matchStatus,
			disabled: false,
			type: "",
			select: true,
			helperText: "Update the status of the match"
		},
		{
			name: "competitionRegion",
			label: "",
			id: "competitionRegion",
			required: true,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			value: updateMatchObj.competitionRegion,
			disabled: false,
			type: "",
			select: true,
			helperText: "Update competition region"
		},
		{
			name: "competitionRound",
			label: "",
			id: "competitionRound",
			required: true,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			value: updateMatchObj.competitionRound,
			disabled: false,
			type: "",
			select: true,
			helperText: "Update competition round"
		},
		{
			name: "teamOneName",
			label: "",
			id: "teamOneName",
			required: true,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			value: updateMatchObj.teamOneName,
			disabled: false,
			type: "",
			select: false,
			helperText: "Update the home team name"
		},
		{
			name: "teamTwoName",
			label: "",
			id: "teamTwoName",
			required: true,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			value: updateMatchObj.teamTwoName,
			disabled: false,
			type: "",
			select: false,
			helperText: "Update the away team name"
		}
	];

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
		event.preventDefault();
    const { name, value } = event.target;
		setUpdateMatchObj({...updateMatchObj, [name]: value})
  };

  // Handles updating component state when the user types into the input field
	const handleIndividualMatchFieldInputChange = (event, child) => {
    event.preventDefault();
    const { name, value } = event.target;
		const id = isEmpty(event.target.id) ? child.props.id : event.target.id;

    for (let i = 0; i < updateMatchObj.individualMatch.length; i++) {
      if (parseInt(id) === i) {
				let object = updateMatchObj.individualMatch[i];
        for (const key in object) {
          if (key === name) {
            object[key] = value;
						setUpdateMatchObj({...updateMatchObj, "individualMatch": updateMatchObj.individualMatch});
          }
        }
        return;
      }
    }
  };

	let homeTeamName = updateMatchObj['teamOneName'];
	let awayTeamName = updateMatchObj['teamTwoName'];
	let competitionName = updateMatchObj['competitionName'];
	
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
		
		for (let i = 0; i < updateMatchObj.individualMatch.length; i++) {
			let individualMatch = updateMatchObj.individualMatch[i];
			{competitionObject.singlePlayer === true ? 
				textFields.push(
					<>
					<div 
						id={i}
					>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'homeMatchPlayerAName'}
							type=''
							select={false}
							error={errors['homeMatchPlayerAName']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.homeMatchPlayerAName === "empty" ? "" : Lib.capitalize(individualMatch.homeMatchPlayerAName)}
							helperText={`Match ${individualMatch.individualMatchId}: Update ${Lib.capitalize(homeTeamName)} player name`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'homeMatchScore'}
							type=''
							select={false}
							error={errors['homeMatchScore']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.homeMatchScore}
							helperText={`Match ${individualMatch.individualMatchId}: If the ${Lib.capitalize(homeTeamName)} player is winning, enter the number of holes they are up by, otherwise, enter 0`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'holesPlayed'}
							type=''
							select={false}
							error={errors['holesPlayed']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.holesPlayed}
							helperText={`Match ${individualMatch.individualMatchId}: Update the number of holes played`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'awayMatchPlayerAName'}
							type=''
							select={false}
							error={errors['awayMatchPlayerAName']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.awayMatchPlayerAName === "empty" ? "" : Lib.capitalize(individualMatch.awayMatchPlayerAName)}
							helperText={`Match ${individualMatch.individualMatchId}: Update ${Lib.capitalize(awayTeamName)} player name`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'awayMatchScore'}
							type=''
							select={false}
							error={errors['awayMatchScore']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.awayMatchScore}
							helperText={`Match ${individualMatch.individualMatchId}: If the ${Lib.capitalize(awayTeamName)} player is winning, enter the number of holes they are up by, otherwise, enter 0`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={`${i}`}
							label=''
							name={'matchDestination'}
							type=''
							select={true}
							error={errors['matchDestination']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.matchDestination === "empty" ? "" : individualMatch.matchDestination}
							helperText={'Update the course the match is played at'}
						>
							{competitors.map((clubName, index) => (
								<MenuItem id={i} key={index} value={clubName.name}>
									{Lib.capitalize(clubName.name)}
								</MenuItem>
							))}
						</TextField>
						<Divider fullWidth light={false} />
					</div>
					</>
				) :
				textFields.push(
					<>
					<div 
						id={i}
					>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'homeMatchPlayerAName'}
							type=''
							select={false}
							error={errors['homeMatchPlayerAName']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.homeMatchPlayerAName === "empty" ? "" : Lib.capitalize(individualMatch.homeMatchPlayerAName)}
							helperText={`Match ${individualMatch.individualMatchId}: Update ${Lib.capitalize(homeTeamName)} player A name`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'homeMatchPlayerBName'}
							type=''
							select={false}
							error={errors['homeMatchPlayerBName']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.homeMatchPlayerBName === "empty" ? "" : Lib.capitalize(individualMatch.homeMatchPlayerBName)}
							helperText={`Match ${individualMatch.individualMatchId}: Update ${Lib.capitalize(homeTeamName)} player B name`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'homeMatchScore'}
							type=''
							select={false}
							error={errors['homeMatchScore']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.homeMatchScore}
							helperText={`Match ${individualMatch.individualMatchId}: If the ${Lib.capitalize(homeTeamName)} players are winning, enter the number of holes they are up by, otherwise, enter 0`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'holesPlayed'}
							type=''
							select={false}
							error={errors['holesPlayed']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.holesPlayed}
							helperText={`Match ${individualMatch.individualMatchId}: Update the number of holes played`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'awayMatchPlayerAName'}
							type=''
							select={false}
							error={errors['awayMatchPlayerAName']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.awayMatchPlayerAName === "empty" ? "" : Lib.capitalize(individualMatch.awayMatchPlayerAName)}
							helperText={`Match ${individualMatch.individualMatchId}: Update ${Lib.capitalize(awayTeamName)} player A name`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'awayMatchPlayerBName'}
							type=''
							select={false}
							error={errors['awayMatchPlayerBName']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.awayMatchPlayerBName === "empty" ? "" : Lib.capitalize(individualMatch.awayMatchPlayerBName)}
							helperText={`Match ${individualMatch.individualMatchId}: Update ${Lib.capitalize(awayTeamName)} player B name`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'awayMatchScore'}
							type=''
							select={false}
							error={errors['awayMatchScore']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.awayMatchScore}
							helperText={`Match ${individualMatch.individualMatchId}: If the ${Lib.capitalize(awayTeamName)} players are winning, enter the number of holes they are up by, otherwise, enter 0`}
						/>
						<TextField
							className={classes.textField}
							key={i+1}
							variant="outlined"
							margin="normal"
							fullWidth
							id={i}
							label=''
							name={'matchDestination'}
							type=''
							select={true}
							error={errors['matchDestination']}
							autoComplete={'autoComplete'}
							autoFocus={false}
							onChange={handleIndividualMatchFieldInputChange}
							value={individualMatch.matchDestination === "empty" ? "" : individualMatch.matchDestination}
							helperText={'Update the course the match is played at'}
						>
							{competitors.map((clubName, index) => (
								<MenuItem id={i} key={index} value={clubName.name}>
									{Lib.capitalize(clubName.name)}
								</MenuItem>
							))}
						</TextField>
					</div>
					<Divider fullWidth light={false} />
				</>
				)
			}
		}
		return textFields;
	}

	return (
		<>
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<form className={classes.form} noValidate>
					{inputFieldValues.map((inputFieldValue, index) => {
						return (
							<TextField
								key={index}
								className={classes.textField}
								variant="outlined"
								margin="normal"
								required={inputFieldValue.required}
								value={inputFieldValue.value}
								fullWidth={inputFieldValue.fullWidth}
								id={inputFieldValue.id}
								label={inputFieldValue.label}
								name={inputFieldValue.name}
								type={inputFieldValue.type}
								select={inputFieldValue.select}
								disabled={inputFieldValue.disabled}
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
								{inputFieldValue.id === 'matchStatus' ? 
									matchStatuses.map((status, index) => (
										<MenuItem key={index} value={status.status}>
											{Lib.capitalize(status.status)}
										</MenuItem>
									))
									:
									null
								}
							</TextField>
						)
					})}
					<Typography component="h1" variant="h5" style={{ color: "#0a66c2" }}>
						Individual Matches
					</Typography>
					{getIndividualMatchFields()}
				</form>
			</div>
		</Container>
		</>
	);
}

export default UpdateMatch;