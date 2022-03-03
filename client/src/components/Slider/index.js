import React, { useContext } from "react";
import './index.css';
import DataAreaContext from '../../utils/DataAreaContext';
import Cards from '../Cards';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function CardSlider() {
  const { appMatchesOnLoad } = useContext(DataAreaContext);
  let matchCards;
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (appMatchesOnLoad.length > 0) {
    matchCards = appMatchesOnLoad.map((match, index) => {
      return (
        <div className="" key={index}>
          <Cards match={ match } />
        </div>
      )
    })
  }

  return (
    <div className="container px-4 py-5">
      <h3>Completed, In Progress, Upcoming Matches</h3>
      <Slider {...settings}>{matchCards}</Slider>
    </div>
  )
}

export default CardSlider;
