import React, { useState } from 'react';
import './Carousel.css';

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  return (
    <div className="carousel">
      <button className="carousel-button left" onClick={prevSlide}>&lt;</button>
      <div className="carousel-item">
        <img src={items[currentIndex].img} alt={items[currentIndex].title} />
        <div className="carousel-info">
          <h3>{items[currentIndex].title}</h3>
          <p>{items[currentIndex].genre}</p>
        </div>
      </div>
      <button className="carousel-button right" onClick={nextSlide}>&gt;</button>
    </div>
  );
};

export default Carousel;
