import React, { useContext } from 'react';
import DataAreaContext from '../utils/DataAreaContext';
import Header from "../components/Header";
import Cards from '../components/Cards';
import { Container } from 'react-bootstrap';

function Home() {
  const { allMatches } = useContext(DataAreaContext);

  return (
    <>
    <Header />
    <Container>
      {allMatches.length ? (
        <Cards />
      ) : (
        <h3 style={{ textAlign: "center" }}>No Results to Display</h3>
      )}
      </Container>
    </>
  );
}

export default Home;