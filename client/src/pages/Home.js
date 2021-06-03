import React from 'react';
import Header from "../components/Header";
import Slider from '../components/Slider';
import PostMatchForm from '../components/PostMatchForm';
import { Container, Row } from 'react-bootstrap';

function Home() {

  return (
    <>
    <Header />
    <Container>
      <Row className='slider flex-nowrap mt-3 pb-4' style={{ overflowX: 'auto' }}>
        <Slider />
      </Row>
      <PostMatchForm />
    </Container>
    </>
  );
}

export default Home;