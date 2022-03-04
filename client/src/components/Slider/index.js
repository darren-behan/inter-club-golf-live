import React from "react";
import './index.css';
import Cards from '../Cards';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function CardSlider(props) {
  let sortedMatchesByMatchDateTime;
  let matchCards;
  let settings = {
    dots: false,
    infinite: false,
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

  if (props.matches.length > 0) {
    sortedMatchesByMatchDateTime = props.matches.sort(function(a, b) {
      return new Date(b.matchDateTime) - new Date(a.matchDateTime);
    });

    matchCards = sortedMatchesByMatchDateTime.map((match, index) => {
      return (
        <div className="" key={index}>
          <Cards match={ match } />
        </div>
      )
    })
  }

  return (
    <>
    <Slider {...settings}>{matchCards}</Slider>
    </>
  )
}

export default CardSlider;
