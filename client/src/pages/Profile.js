import React from 'react';
import Header from "../components/Header";
import Container from '@material-ui/core/Container';

function Profile() {
  return (
    <>
    <Header />
    <Container component="main" maxWidth="xs">  
      <div>
        <h2>Profile</h2>
      </div>
    </Container>
    </>
  )
}

export default Profile;