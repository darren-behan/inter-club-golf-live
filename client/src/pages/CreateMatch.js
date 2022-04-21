import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import PostMatchForm from '../components/PostMatchForm';
import { Container } from 'react-bootstrap';

function Home() {

  return (
    <>
    <Header />
    <Container style={{ marginBottom: "350px" }}>
      <PostMatchForm />
    </Container>
    <Footer />
    </>
  );
}

export default Home;