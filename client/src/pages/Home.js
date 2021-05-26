import React, { useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import Header from "../components/Header";
import Cards from '../components/Cards';
import Table from '../components/MatchesTable';
import PostMatchForm from '../components/PostMatchForm';
import { Container, Row, Col } from 'react-bootstrap';

function Home() {
  const { allMatches } = useContext(DataAreaContext);

  return (
    <>
    <Header />
    <Container>
      <Row>
        <Table />
        <PostMatchForm />
      </Row>
    </Container>
    </>
  );
}

export default Home;