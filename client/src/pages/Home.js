import React from 'react';
import Header from "../components/Header";
import CardCarousel from '../components/Carousel';
import PostMatchForm from '../components/PostMatchForm';
import { Container, Row } from 'react-bootstrap';

function Home() {

  return (
    <>
    <Header />
    <Container>
      <Row className='flex-nowrap mt-4 pb-4' style={{ overflowX: 'auto' }}>
        <CardCarousel />
      </Row>
      <PostMatchForm />
    </Container>
    </>
  );
}

export default Home;