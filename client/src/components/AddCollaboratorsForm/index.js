import React, { useContext, useState } from 'react';
import DataAreaContext from '../../utils/DataAreaContext';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import moment from 'moment';
import 'moment-timezone';

const styles = makeStyles((theme) => ({
  paper: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: 1,
    backgroundColor: 'grey',
  },
  form: {
    width: '100%',
    marginTop: 1,
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  textField: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0a66c2',
    },
    '& .MuiSvgIcon-root': {
      fill: '#0a66c2',
    },
  },
  notchedOutline: {
    borderColor: '#0a66c2 !important',
  },
  submit: {
    margin: 3,
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 10,
  },
  progress: {
    position: 'absolute',
  },
}));

function AddCollaborators() {
  const { collaborators, setCollaborators, setIsCollaboratorsEdited } = useContext(DataAreaContext);
  const [errors, setErrors] = useState({});
  const classes = styles();

  const inputFieldValues = [
    {
      label: '',
      required: false,
      fullWidth: true,
      autoComplete: 'autoComplete',
      autoFocus: false,
      disabled: false,
      type: '',
      helperText: 'Enter the email of the person you want to add as a collaborator',
    },
    {
      label: '',
      required: false,
      fullWidth: true,
      autoComplete: 'autoComplete',
      autoFocus: false,
      disabled: false,
      type: '',
      helperText: 'Enter the email of the person you want to add as a collaborator',
    },
    {
      label: '',
      required: false,
      fullWidth: true,
      autoComplete: 'autoComplete',
      autoFocus: false,
      disabled: false,
      type: '',
      helperText: 'Enter the email of the person you want to add as a collaborator',
    },
    {
      label: '',
      required: false,
      fullWidth: true,
      autoComplete: 'autoComplete',
      autoFocus: false,
      disabled: false,
      type: '',
      helperText: 'Enter the email of the person you want to add as a collaborator',
    },
    {
      label: '',
      required: false,
      fullWidth: true,
      autoComplete: 'autoComplete',
      autoFocus: false,
      disabled: false,
      type: '',
      helperText: 'Enter the email of the person you want to add as a collaborator',
    },
    {
      label: '',
      required: false,
      fullWidth: true,
      autoComplete: 'autoComplete',
      autoFocus: false,
      disabled: false,
      type: '',
      helperText: 'Enter the email of the person you want to add as a collaborator',
    },
    {
      label: '',
      required: false,
      fullWidth: true,
      autoComplete: 'autoComplete',
      autoFocus: false,
      disabled: false,
      type: '',
      helperText: 'Enter the email of the person you want to add as a collaborator',
    },
    {
      label: '',
      required: false,
      fullWidth: true,
      autoComplete: 'autoComplete',
      autoFocus: false,
      disabled: false,
      type: '',
      helperText: 'Enter the email of the person you want to add as a collaborator',
    },
    {
      label: '',
      required: false,
      fullWidth: true,
      autoComplete: 'autoComplete',
      autoFocus: false,
      disabled: false,
      type: '',
      helperText: 'Enter the email of the person you want to add as a collaborator',
    },
    {
      label: '',
      required: false,
      fullWidth: true,
      autoComplete: 'autoComplete',
      autoFocus: false,
      disabled: false,
      type: '',
      helperText: 'Enter the email of the person you want to add as a collaborator',
    },
  ];

  // Handles updating component state when the user types into the input field
  const handleInputChange = (event, i) => {
    event.preventDefault();
    const { name, value } = event.target;

    collaborators.collaborators[i][name] = value;
    collaborators.collaborators[i]['dateUpdated'] = moment().format();
    collaborators.collaborators[i]['userId'] = '';

    setCollaborators(JSON.parse(JSON.stringify({ ...collaborators })));
    setIsCollaboratorsEdited(false);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <form className={classes.form} noValidate>
            {inputFieldValues.map((inputFieldValue, i) => {
              return (
                <TextField
                  key={i}
                  className={classes.textField}
                  variant="outlined"
                  margin="normal"
                  required={inputFieldValue.required}
                  value={collaborators.collaborators[i] !== undefined ? collaborators.collaborators[i]['email'] : ''}
                  fullWidth={inputFieldValue.fullWidth}
                  id={i}
                  label={inputFieldValue.label}
                  name="email"
                  type={inputFieldValue.type}
                  disabled={inputFieldValue.disabled}
                  error={errors[inputFieldValue.name]}
                  autoComplete={inputFieldValue.autoComplete}
                  autoFocus={inputFieldValue.autoFocus}
                  onChange={(e) => handleInputChange(e, i)}
                  helperText={inputFieldValue.helperText}
                />
              );
            })}
          </form>
        </div>
      </Container>
    </>
  );
}

export default AddCollaborators;
