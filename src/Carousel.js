// Carousel.js
import React, { useEffect, useState } from 'react';
import './Carousel.css'; // Import the CSS for the carousel
import { logos } from './App'; // Import the logos from App.js

function Carousel({ movies }) {
  // Sort movies by total_rating in descending order and take the top 5
  const topMovies = [...movies].sort((a, b) => b.total_rating - a.total_rating).slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to handle dot click
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Auto-rotation effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % topMovies.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [topMovies.length]);

  return (
    <div className="carousel-container">
      <div className="carousel" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {topMovies.map((movie, index) => (
          <div className="carousel-slide" key={index}>
            <img src={movie.image} alt={movie.title} className="carousel-image" />
            <div className="carousel-overlay">
              <h2 className="carousel-title">{movie.title}</h2>
              <p className="carousel-rating">Rating: {movie.total_rating}%</p>
              <p className="carousel-duration"><b>Duration:</b> {movie.duration ? movie.duration : 'N/A'}</p>
              <p className="carousel-genre"><b>Genre:</b> {Array.isArray(movie.genre) && movie.genre.length > 0 ? movie.genre.join(', ') : 'N/A'}</p>

              {/* Cinema logos */}
              <div className="carousel-cinema-logos">
                {Object.keys(movie.origin).map(cinema => (
                  logos[cinema] ? (
                    <img
                      key={cinema}
                      src={logos[cinema]} // Access the logo using the cinema name
                      alt={`${cinema} logo`}
                      className="cinema-logo"
                    />
                  ) : null // If logo not found, don't render anything
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots for navigation */}
      <div className="carousel-dots">
        {topMovies.map((_, index) => (
          <span
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;