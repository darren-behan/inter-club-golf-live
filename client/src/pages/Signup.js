import React, { useContext, useState, useEffect } from 'react';
import API from "../utils/API";
import DataAreaContext from '../utils/DataAreaContext';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Container } from 'react-bootstrap';

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
	const { signUpObj, setSignUpObj, setIsAuthenticated, isAuthenticated, setUserDataObj } = useContext(DataAreaContext);
  const [requestErrors, setRequestErrors] = useState({});
	console.log(requestErrors);
  const [errors, setErrors] = useState({});
	console.log(errors);
	const [loading, setLoading] = useState( false );
	const classes = styles();
	
	// useEffect is listening on load of page
  // If isAuthenticated changes to true, the user is navigated to the home page 
  useEffect(() => {
    if(isAuthenticated) {
      history.push('/');
    };
	}, [isAuthenticated]);

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
			console.log(response);
			localStorage.setItem('AuthToken', `Bearer ${response.data.stsTokenManager.accessToken}`);
			setUserDataObj(response.data);
			setLoading(false);
			setIsAuthenticated(true);
		})
		.catch(error => {
			setRequestErrors(error.response);
			setLoading(false);
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
		<Container fluid={ true } style={{ padding: '0 0 70px 0' }}>
    	<Header />
			<Container>
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
			</Container>
			<Footer />
		</Container>
		</>
  )
}

export default Signup;