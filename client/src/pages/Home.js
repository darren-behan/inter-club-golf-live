import React, { useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import Header from "../components/Header";
import CardCarousel from '../components/Carousel';
import PostMatchForm from '../components/PostMatchForm';
import { Container, Row } from 'react-bootstrap';

function Home() {
  const { allMatches } = useContext(DataAreaContext);

  return (
    <>
    <Header />
    <Container>
      <Row>
        <CardCarousel />
      </Row>
      <PostMatchForm />
    </Container>
    </>
  );
}

export default Home;