import React, { useContext, useState, useEffect } from 'react';
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
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import 'moment-timezone';
import competition from '../../assets/data/competitions.json';
import matchData from '../../assets/data/matchdata.json';
import rounds from '../../assets/data/competitionRounds.json';
let isEmpty = require('lodash.isempty');

const styles = makeStyles((theme) => ({
	paper: {
		paddingTop: 10,
		paddingLeft: 10,
		paddingRight: 10,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: '#ffffff'
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
	textField: {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0a66c2"
    },
    "& .MuiSvgIcon-root": {
      fill: "#0a66c2"
    }
	},
	submit: {
		margin: 0,
		marginBottom: 30
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

const regionAreas = [
  {
    regionArea: 'north'
  },
  {
    regionArea: 'south'
  },
  {
    regionArea: 'east'
  },
  {
    regionArea: 'west'
  },
  {
    regionArea: 'central'
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
		defaultValue: "",
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
		defaultValue: "00:23",
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
		defaultValue: "",
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
		defaultValue: "",
		select: true,
		helperText: "Choose the region the competition is played in"
	},
	{
		name: "competitionRegionArea",
		label: "",
		id: "competitionRegionArea",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: "",
		defaultValue: "",
		select: true,
		helperText: "Choose the area of the region the competition is played in (if applicable)"
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
		defaultValue: "",
		select: true,
		helperText: "Choose the round of the competition"
	},
	{
		name: "neutralVenueName",
		label: "",
		id: "neutralVenueName",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: "",
		defaultValue: "",
		select: false,
		helperText: "Enter the venue for the match if it is neutral"
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
		defaultValue: "",
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
		defaultValue: "",
		select: false,
		helperText: "Choose the away team name"
	}
];

function PostMatch() {
	const { appMatchesOnLoad, postMatchObj, setPostMatchObj, userDataObj, setAppMatchesOnLoad, timeZone, createMathModalShow, setCreateMatchModalShow, setCreateMatchResponse, setMatchObj } = useContext(DataAreaContext);
  const [errors, setErrors] = useState({});
	const classes = styles();
	const [loading, setLoading] = useState( false );
	let filteredMatchArray = [];

  useEffect(() => {
    setPostMatchObj({});
  }, []);

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
		event.preventDefault();
    const { name, value } = event.target;

		if (name === "competitionRound") {
			rounds.map(function(round) {
				if (value === round.round) {
					return setPostMatchObj({...postMatchObj, [name]: round});
				}
			});
		} else {
			setPostMatchObj({...postMatchObj, [name]: value});
		}
  };

  const handleIndividualMatchFieldInputChange = (event, child) => {
		event.preventDefault();
    const { name, value } = event.target;
		const id = isEmpty(event.target.id) ? child.props.id : event.target.id;

    for (let i = 0; i < filteredMatchArray.length; i++) {
      if (parseInt(id) === i) {
				let object = filteredMatchArray[i];
        for (const key in object) {
          if (key === name) {
            object[key] = value;
						setPostMatchObj({...postMatchObj, "individualMatchesArray": filteredMatchArray});
          }
        }
        return;
      }
    }
  };

	let homeTeamName = postMatchObj['teamOneName'];
	let awayTeamName = postMatchObj['teamTwoName'];
	let neutralVenueName = postMatchObj['neutralVenueName'];
	let competitionName = postMatchObj['competitionName'];
	
	let competitors = [
		{
			name: homeTeamName
		},
		{
			name: awayTeamName
		}
	];


	let competitionObject;

	const getIndividualMatchFields = () => {
		if (!isEmpty(neutralVenueName)) {
			competitors.push(
				{
					name: neutralVenueName
				}
			)
		}

		let textFields = [];
		for(let i = 0; i < competition.length; i++) {
			if (competition[i].name === competitionName) {
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
					<div 
						id={i}
					>
						<TextField
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
							helperText={`Match ${(i + 1)}: ${Lib.capitalize(homeTeamName)} player name (if known)`}
						/>
						<TextField
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
							helperText={`Match ${(i + 1)}: ${Lib.capitalize(awayTeamName)} player name (if known)`}
						/>
						<TextField
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
							helperText={'Choose the course the match is played at'}
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
							helperText={`Match ${(i + 1)}: ${Lib.capitalize(homeTeamName)} player A name (if known)`}
						/>
						<TextField
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
							helperText={`Match ${(i + 1)}: ${Lib.capitalize(homeTeamName)} player B name (if known)`}
						/>
						<TextField
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
							helperText={`Match ${(i + 1)}: ${Lib.capitalize(awayTeamName)} player A name (if known)`}
						/>
						<TextField
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
							helperText={`Match ${(i + 1)}: ${Lib.capitalize(awayTeamName)} player B name (if known)`}
						/>
						<TextField
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
							helperText={'Choose the course the match is played at'}
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
			competitionConcatRegion: !isEmpty(postMatchObj.competitionRegionArea) ? postMatchObj.competitionRegion + " " + postMatchObj.competitionRegionArea : postMatchObj.competitionRegion,
      competitionRegion: postMatchObj.competitionRegion,
			competitionRegionArea: !isEmpty(postMatchObj.competitionRegionArea) ? postMatchObj.competitionRegionArea : "",
      competitionRound: postMatchObj.competitionRound,
      numIndividualMatches: competitionObject.matches,
			individualMatch: !isEmpty(postMatchObj.individualMatchesArray) ? postMatchObj.individualMatchesArray : filteredMatchArray,
      teamOneName: postMatchObj.teamOneName,
      teamTwoName: postMatchObj.teamTwoName,
      neutralVenueName: postMatchObj.neutralVenueName,
			uid: userDataObj.uid,
			singlePlayer: competitionObject.singlePlayer
		})
		.then((response) => {
			setAppMatchesOnLoad([response.data, ...appMatchesOnLoad]);
			setMatchObj({...response.data});
			setCreateMatchResponse({
				matchId: response.data.matchId,
				message: "Match created successfully",
				status: 200
			});
			setCreateMatchModalShow(true);
      setPostMatchObj({});
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
			postMatchObj.teamTwoName

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
				<Typography component="h1" variant="h5" style={{ color: "#0a66c2" }}>
					Create Match
				</Typography>
				<form className={classes.form} noValidate>
					{inputFieldValues.map((inputFieldValue, index) => {
						return (
							<TextField
								key={index}
								className={classes.textField}
								variant="outlined"
								margin="normal"
								required={inputFieldValue.required}
								fullWidth={inputFieldValue.fullWidth}
								id={inputFieldValue.id}
								label={inputFieldValue.label}
								name={inputFieldValue.name}
								type={inputFieldValue.type}
								defaultValue={inputFieldValue.defaultValue}
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
								{inputFieldValue.id === 'competitionRegionArea' ? 
									regionAreas.map((regionArea, index) => (
										<MenuItem key={index} value={regionArea.regionArea}>
											{Lib.capitalize(regionArea.regionArea)}
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
					{!isEmpty(postMatchObj.competitionName) && !isEmpty(postMatchObj.teamOneName) && !isEmpty(postMatchObj.teamTwoName) ?
						<Typography component="h1" variant="h5" style={{ color: "#0a66c2" }}>
							Individual Matches
						</Typography>
						:
						null
					}
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