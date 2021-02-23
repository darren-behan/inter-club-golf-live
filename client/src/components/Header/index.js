import React, { useContext } from 'react';
import './index.css';
import { Link } from "react-router-dom";
import HeaderAuthenticated from "./isAuthenticated";
import DataAreaContext from "../../utils/DataAreaContext";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Header() {
  const { isAuthenticated } = useContext(DataAreaContext);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="home">
              Inter-club Golf Live
            </Link>
          </Typography>
          <Button color="inherit">
            <Link to="matches">
              Matches
            </Link>
          </Button>
          {!isAuthenticated ? (
            <>
            <Button color="inherit">
              <Link to="login">
                Login
              </Link>
            </Button>
            <div className="welcome-div">Not logged in</div>
            </>
          ) : (
            <HeaderAuthenticated className="hero-header-authenticated"/>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
