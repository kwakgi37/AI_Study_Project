// Problem_Card.js
import React, { forwardRef } from 'react';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProblemCard = forwardRef(({ problemNumber }, ref) => {
  const settings = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Slider ref={ref} {...settings}>
        {Array.from({ length: 23 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              textAlign: 'center',
              mx: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              height: '40px',
              marginTop: '5px',
            }}
          >
            <Typography variant="h6">문제 {index + 18}</Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
});

ProblemCard.propTypes = {
  problemNumber: PropTypes.number.isRequired,
};

export default ProblemCard;
