import React from 'react';
import Header from "../components/Header";
import Container from '@material-ui/core/Container';

function Signup() {
  return (
    <>
    <Header />
    <Container component="main" maxWidth="xs">  
      <div>
        <h2>Sign up</h2>
      </div>
    </Container>
    </>
  )
}

export default Signup;