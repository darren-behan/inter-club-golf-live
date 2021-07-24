import React from 'react';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";
import competitions from '../../assets/data/competitions.json';

const useStyles = makeStyles({
  root: {
    "& .MuiInputLabel-outlined": {
      color: "#ffffff"
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ffffff"
    },
    "& .MuiSvgIcon-root": {
      fill: "#ffffff!important"
    }
  }
});

function ComboBox() {
  const classes = useStyles();
  const history = useHistory();

  function handleInputChange(event, value) {
		event.preventDefault();

    competitions.map(function(competition) {
      if (value === competition.name) {
        const encodedURI = encodeURIComponent(value);
        history.push('/competition/' + encodedURI);
			}
		});
	};

	return (
    <Autocomplete
      id="combo-box-demo"
      className={classes.root}
      options={competitions}
      getOptionLabel={(option) => option.name}
      style={{ maxWidth: 500 }}
      onInputChange={handleInputChange}
      renderInput={(params) => <TextField {...params} label="Choose a competition" variant="outlined" />}
    />
	);
}

export default ComboBox;