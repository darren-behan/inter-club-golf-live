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
    background: "#fafafa",
    alignItems: 'center'
  },
  menuButton: {
    marginRight: theme.spacing(1),
    border: 0,
    borderRadius: 3,
    padding: '0 10px',
  },
  title: {
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
  textColor: {
    color: "green",
  }
}));

function Header() {
  const { isAuthenticated } = useContext(DataAreaContext);
  const classes = useStyles();

  return (
    <div>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="home" className={classes.textColor}>
              Inter-club Golf Live
            </Link>
          </Typography>
          <Button className={classes.menuButton}>
            <Link to="matches" className={classes.textColor}>
              Matches
            </Link>
          </Button>
          {!isAuthenticated ? (
            <>
            <Button className={classes.menuButton}>
              <Link to="login" className={classes.textColor}>
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
