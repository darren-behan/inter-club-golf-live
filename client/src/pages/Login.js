import React, { useContext, useState, useEffect } from 'react';
import API from "../utils/API";
import DataAreaContext from '../utils/DataAreaContext';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
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
	const [errors, setErrors] = useState( [] );
	const [loading, setLoading] = useState( false );
	const { loggedInUserObject, setLoggedInUserObject } = useContext(DataAreaContext);
	const { isAuthenticated, setIsAuthenticated } = useContext(DataAreaContext);
	const classes = styles();
	let history = useHistory();
	
	// useEffect is listening on load of site
  // If isAuthenticated changes to true, the user is navigated to the home page 
  useEffect(() => {
    if(isAuthenticated) {
      history.push('/home');
    };
	}, [isAuthenticated]);

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event) => {
    const { name, value } = event.target;
		setLoggedInUserObject({...loggedInUserObject, [name]: value})
  };

	const handleSubmit = (event) => {
		event.preventDefault();
		setLoading(true);
    API.loginUser({
      email: loggedInUserObject.email,
      password: loggedInUserObject.password
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
						disabled={loading || !loggedInUserObject.email || !loggedInUserObject.password}
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
	);
}

export default Login;
// class login extends Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {
// 			email: '',
// 			password: '',
// 			errors: [],
// 			loading: false
// 		};
// 	}

// 	componentWillReceiveProps(nextProps) {
// 		if (nextProps.UI.errors) {
// 			this.setState({
// 				errors: nextProps.UI.errors
// 			});
// 		}
// 	}

// 	handleChange = (event) => {
// 		this.setState({
// 			[event.target.name]: event.target.value
// 		});
// 	};

// 	handleSubmit = (event) => {
// 		event.preventDefault();
// 		this.setState({ loading: true });
//     API.loginUser({
//       email: this.state.email,
//       password: this.state.password
//     })
// 			.then((response) => {
// 				localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
// 				this.setState({ 
// 					loading: false,
// 				});		
// 				this.props.history.push('/');
// 			})
// 			.catch((error) => {				
// 				this.setState({
// 					errors: error.response,
// 					loading: false
// 				});
// 			});
// 	};

// 	render() {
// 		const { classes } = this.props;
// 		const { errors, loading } = this.state;
// 		return (
// 			<Container component="main" maxWidth="xs">
// 				<CssBaseline />
// 				<div className={classes.paper}>
// 					<Typography component="h1" variant="h5">
// 						Login
// 					</Typography>
// 					<form className={classes.form} noValidate>
// 						<TextField
// 							variant="outlined"
// 							margin="normal"
// 							required
// 							fullWidth
// 							id="email"
// 							label="Email Address"
// 							name="email"
// 							autoComplete="email"
// 							autoFocus
// 							onChange={this.handleChange}
// 						/>
// 						<TextField
// 							variant="outlined"
// 							margin="normal"
// 							required
// 							fullWidth
// 							name="password"
// 							label="Password"
// 							type="password"
// 							id="password"
// 							autoComplete="current-password"
// 							onChange={this.handleChange}
// 						/>
// 						<Button
// 							type="submit"
// 							fullWidth
// 							variant="contained"
// 							color="primary"
// 							className={classes.submit}
// 							onClick={this.handleSubmit}
// 							disabled={loading || !this.state.email || !this.state.password}
// 						>
// 							Sign In
// 							{loading && <CircularProgress size={30} className={classes.progess} />}
// 						</Button>
// 						<Grid container>
// 							<Grid item>
// 								<Link href="signup" variant="body2">
// 									{"Don't have an account? Sign Up"}
// 								</Link>
// 							</Grid>
// 						</Grid>
// 					</form>
// 				</div>
// 			</Container>
// 		);
// 	}
// }