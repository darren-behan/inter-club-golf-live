import React from 'react';
import Header from "../components/Header";
import Container from '@material-ui/core/Container';

function PageNotFound() {
  return (
    <>
    <Header />
    <Container component="main" maxWidth="xs">  
      <div>
        <h2>Page Not Found</h2>
      </div>
    </Container>
    </>
  )
}

export default PageNotFound;