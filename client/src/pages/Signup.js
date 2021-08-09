import React, { useContext, useState } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import UserAuthModal from "../components/Modals/UserAuthModal";
import Header from "../components/Header";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from "firebase/app";
import "firebase/auth";

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
	progess: {
		position: 'absolute'
	}
});
	
const inputFieldValues = [
	{
		name: "firstName",
		label: "First Name",
		id: "firstName",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: ""
	},
	{
		name: "lastName",
		label: "Last Name",
		id: "lastName",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: ""
	},
	{
		name: "email",
		label: "Email address",
		id: "email",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: ""
	},
	{
		name: "password",
		label: "Password",
		id: "password",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: "password"
	},
	{
		name: "confirmPassword",
		label: "Confirm Password",
		id: "confirmPassword",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: false,
		type: "password"
	},
];

function Signup() {
	const { signUpObj, setSignUpObj, setUserDataObj, setUserAuthResponse, userAuthModalShow, setUserAuthModalShow } = useContext(DataAreaContext);
  const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState( false );
	const classes = styles();

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
		event.preventDefault();
    const { name, value } = event.target;
		setSignUpObj({...signUpObj, [name]: value});
    validate(name, value);
  };

  const validate = (name, value) => {
    let temp = { ...errors };
		
		switch (name) {
			case 'email':
				const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				temp.email = value.match(emailRegEx) ? "" : "Email is not valid."
				break;
			case 'password':
				if ("confirmPassword" in signUpObj) {
					temp[name] = signUpObj.confirmPassword !== value ? "Passwords much match." : "";
					temp["confirmPassword"] = "";
				}
				break;
			case 'confirmPassword':
				if ("password" in signUpObj) {
					temp[name] = signUpObj.password !== value ? "Passwords much match." : "";
					temp["password"] = "";
				}
				break;
			default:
				temp[name] = !isNullOrEmpty(value) ? "" : "This field is required.";
		}

    setErrors({
      ...temp
    });
  };

	const handleSubmit = (event) => {
		event.preventDefault();
		setLoading(true);

		const actionCodeSettings = {
			url: 'https://inter-club-golf-live.web.app/login',
			handleCodeInApp: false
		};

    firebase
    .auth()
    .createUserWithEmailAndPassword(
      signUpObj.email, 
      signUpObj.password
    )
		.then((response) => {
			response.user.sendEmailVerification(actionCodeSettings);
			response.user.updateProfile({
				displayName: `${signUpObj.firstName} ${signUpObj.lastName}`
			});
			setUserDataObj(response.user);
			firebase.auth().signOut();
			setUserAuthResponse({
				message: "You're signup has been received. We've sent you an email verification. Please verify your email through the email you received to be able to complete the signup process.",
				status: 200
			});
			setLoading(false);
			setUserAuthModalShow(true);
	})
		.catch(error => {
			setUserAuthResponse({
				message: error.message,
				status: 400
			});
			setLoading(false);
			setUserAuthModalShow(true);
		});
	};

	const formIsValid = () => {
		const isValid =
			signUpObj.firstName &&
			signUpObj.lastName &&
			signUpObj.email &&
			signUpObj.password &&
			signUpObj.confirmPassword &&
			Object.values(errors).every((x) => x === "");

		return isValid;
	};

	function isNullOrEmpty(v) {
		return typeof v === 'undefined' || v === null || v.length === 0;
	}

  return (
    <>
			<UserAuthModal
				show={userAuthModalShow}
				onHide={() => setUserAuthModalShow(false)} 
			/>
    	<Header />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Create account
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
									error={errors[inputFieldValue.name]}
									autoComplete={inputFieldValue.autoComplete}
									autoFocus={inputFieldValue.autoFocus}
									onChange={handleInputChange}
									{...(errors[inputFieldValue.name] && {
										error: true,
										helperText: errors[inputFieldValue.name]
									})}
								/>
							);
						})}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={handleSubmit}
							disabled={loading || !formIsValid()}
						>
							Create account
							{loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
						<Grid container>
							<Grid item>
								<Link href="login" variant="body2">
									{"Already have an account? Sign in"}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		</>
  )
}

export default Signup;