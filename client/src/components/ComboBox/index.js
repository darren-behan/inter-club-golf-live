import React from 'react';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import competitions from '../../assets/data/competitions.json';
import Lib from '../../utils/Lib.js';

const useStyles = makeStyles({
  root: {
    '& .MuiInputLabel-outlined': {
      color: '#0a66c2',
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0a66c2',
    },
    '& .MuiSvgIcon-root': {
      fill: '#0a66c2!important',
    },
  },
});

function ComboBox() {
  const classes = useStyles();
  const history = useHistory();

  function handleInputChange(event, value) {
    event.preventDefault();

    competitions.map((competition) => {
      if (value === competition.name) {
        const encodedURI = encodeURIComponent(value);
        history.push('/competition/' + encodedURI);
      }
    });
  }

  return (
    <Autocomplete
      id="combo-box-demo"
      className={classes.root}
      options={competitions}
      groupBy={(option) => `${Lib.capitalize(option.gender)}'s competitions`}
      getOptionLabel={(option) => option.name}
      onInputChange={handleInputChange}
      renderInput={(params) => <TextField {...params} label="Choose a competition" variant="outlined" />}
    />
  );
}

export default ComboBox;
