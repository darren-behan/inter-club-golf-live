import React from 'react';
import Header from "../components/Header";
import Container from '@material-ui/core/Container';

function Settings() {
  return (
    <>
    <Header />
    <Container component="main" maxWidth="xs">  
      <div>
        <h2>Settings</h2>
      </div>
    </Container>
    </>
  )
}

export default Settings;