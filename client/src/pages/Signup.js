import React, { useContext, useState, useEffect } from 'react';
import API from "../utils/API";
import DataAreaContext from '../utils/DataAreaContext';
import LocalStorage from '../services/LocalStorage/LocalStorage.service';
import SignUpModal from "../components/Modals/SignUpModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

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
		autoFocus: true,
		type: ""
	},
	{
		name: "lastName",
		label: "Last Name",
		id: "lastName",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: true,
		type: ""
	},
	{
		name: "phoneNumber",
		label: "Phone Number",
		id: "phoneNumber",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: true,
		type: "number"
	},
	{
		name: "country",
		label: "Country Of Residence",
		id: "country",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: true,
		type: ""
	},
	{
		name: "email",
		label: "Email",
		id: "email",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: true,
		type: ""
	},
	{
		name: "password",
		label: "Password",
		id: "password",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: true,
		type: "password"
	},
	{
		name: "confirmPassword",
		label: "Confirm Password",
		id: "confirmPassword",
		required: true,
		fullWidth: true,
		autoComplete: "autoComplete",
		autoFocus: true,
		type: "password"
	},
];

function Signup() {
	let history = useHistory();
	const { signUpObj, setSignUpObj, setIsAuthenticated, setUserDataObj, signUpResponse, setSignUpResponse, signUpModalShow, setSignUpModalShow } = useContext(DataAreaContext);
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
    API.signUpUser({
      firstName: signUpObj.firstName,
      lastName: signUpObj.lastName,
      phoneNumber: signUpObj.phoneNumber,
      country: signUpObj.country,
      email: signUpObj.email,
      password: signUpObj.password,
      confirmPassword: signUpObj.confirmPassword
		})
		.then((response) => {
			LocalStorage.set('AuthToken', `Bearer ${response.data.stsTokenManager.accessToken}`);
			setUserDataObj(response.data);
			setSignUpResponse({
				message: "Signup successful",
				status: 200
			});
			setLoading(false);
			setIsAuthenticated(true);
			setSignUpModalShow(true);
		})
		.catch(error => {
			setSignUpResponse({
				message: error.response.data.error,
				status: error.response.status
			});
			setLoading(false);
			setSignUpModalShow(true);
		});
	};

	const formIsValid = () => {
		const isValid =
			signUpObj.firstName &&
			signUpObj.lastName &&
			signUpObj.phoneNumber &&
			signUpObj.country &&
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
			<SignUpModal
				show={signUpModalShow}
				onHide={() => setSignUpModalShow(false)} 
			/>
    	<Header />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
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
									{"Already have an account? Login"}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
			<Footer />
		</>
  )
}

export default Signup;