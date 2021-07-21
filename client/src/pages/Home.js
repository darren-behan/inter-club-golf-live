import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from '../components/Carousel';
import { Container } from 'react-bootstrap';

function Home() {

  return (
    <>
    <Container fluid className="p-0">
      <Header />
      <Carousel className='mt-3 pb-4'/>
      <Footer />
    </Container>
    </>
  );
}

export default Home;