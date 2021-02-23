import React, { useContext, useState, useEffect } from 'react';
import API from "../utils/API";
import DataAreaContext from '../utils/DataAreaContext';
import Header from "../components/Header";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
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

function Login() {
	let history = useHistory();
	const { isAuthenticated, setIsAuthenticated, loginDataObj, setLoginDataObj } = useContext(DataAreaContext);
	const [errors, setErrors] = useState( [] );
	const [loading, setLoading] = useState( false );
	const classes = styles();
	
	// useEffect is listening on load of page
  // If isAuthenticated changes to true, the user is navigated to the home page 
  useEffect(() => {
    if(isAuthenticated) {
      history.push('/home');
    };
	}, [isAuthenticated]);

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
    const { name, value } = event.target;
		setLoginDataObj({...loginDataObj, [name]: value})
  };

	const handleSubmit = (event) => {
		event.preventDefault();
		setLoading(true);
    API.loginUser({
      email: loginDataObj.email,
      password: loginDataObj.password
		})
		.then((response) => {
			localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
			setLoading(false);
			setIsAuthenticated(true);
		})
		.catch(error => {
			setErrors(error.response);
			setLoading(false);
		});
	};

	return (
    <>
    <Header />
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Login
				</Typography>
				<form className={classes.form} noValidate>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						onChange={handleInputChange}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						onChange={handleInputChange}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={handleSubmit}
						disabled={loading || !loginDataObj.email || !loginDataObj.password}
					>
						Sign In
						{loading && <CircularProgress size={30} className={classes.progess} />}
					</Button>
					<Grid container>
						<Grid item>
							<Link href="signup" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
		</>
	);
}

export default Login;