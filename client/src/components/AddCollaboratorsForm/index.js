import React, { useContext, useState, useEffect } from 'react';
import DataAreaContext from '../../utils/DataAreaContext';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import moment from 'moment';
import 'moment-timezone';
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

function AddCollaborators() {
	const { collaborators, setCollaborators, setIsCollaboratorsEdited } = useContext(DataAreaContext);
  const [errors, setErrors] = useState({});
	const classes = styles();
	
	const inputFieldValues = [
		{
			name: "email1",
			label: "",
			id: "email1",
			required: false,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			disabled: false,
			type: "",
			helperText: "Enter the email of the person you want to add as a collaborator"
		},
		{
			name: "email2",
			label: "",
			id: "email2",
			required: false,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			disabled: false,
			type: "",
			helperText: "Enter the email of the person you want to add as a collaborator"
		},
		{
			name: "email3",
			label: "",
			id: "email3",
			required: false,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			disabled: false,
			type: "",
			helperText: "Enter the email of the person you want to add as a collaborator"
		},
		{
			name: "email4",
			label: "",
			id: "email4",
			required: false,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			disabled: false,
			type: "",
			helperText: "Enter the email of the person you want to add as a collaborator"
		},
		{
			name: "email5",
			label: "",
			id: "email5",
			required: false,
			fullWidth: true,
			autoComplete: "autoComplete",
			autoFocus: false,
			disabled: false,
			type: "",
			helperText: "Enter the email of the person you want to add as a collaborator"
		}
	];

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
		event.preventDefault();
    const { name, value } = event.target;
		let isUpdated;

		isUpdated = collaborators.filter((object) => {
			if (object.hasOwnProperty(name)) {
				object[name] = value;
				object["dateUpdated"] = moment().format();
				return object;
			}
		})

		if (isEmpty(isUpdated)) {
			collaborators.push({
				"dateAdded": moment().format(),
				"dateUpdated": moment().format(),
				[name]: value,
				"userId": ""
			})
		}

    setCollaborators([...collaborators]);
		setIsCollaboratorsEdited(false);
  };

	return (
		<>
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<form className={classes.form} noValidate>
					{inputFieldValues.map((inputFieldValue, i) => {
						let emailKey = "email" + (i+1);
						return (
							<TextField
								key={i}
								className={classes.textField}
								variant="outlined"
								margin="normal"
								required={inputFieldValue.required}
								value={collaborators[i] !== undefined ? collaborators[i][emailKey] : ""}
								fullWidth={inputFieldValue.fullWidth}
								id={inputFieldValue.id}
								label={inputFieldValue.label}
								name={inputFieldValue.name}
								type={inputFieldValue.type}
								disabled={inputFieldValue.disabled}
								error={errors[inputFieldValue.name]}
								autoComplete={inputFieldValue.autoComplete}
								autoFocus={inputFieldValue.autoFocus}
								onChange={handleInputChange}
								helperText={inputFieldValue.helperText}
							/>
						)
					})}
				</form>
			</div>
		</Container>
		</>
	);
}

export default AddCollaborators;