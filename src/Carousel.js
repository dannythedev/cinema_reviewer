// Carousel.js
import React, { useEffect, useState } from 'react';
import './Carousel.css'; // Import the CSS for the carousel
import { logos } from './App'; // Import the logos from App.js

function Carousel({ movies }) {
  // Sort movies by total_rating in descending order and take the top 5
  const topMovies = [...movies].sort((a, b) => b.total_rating - a.total_rating).slice(0, 5);

  // Prepare extendedMovies array
  const extendedMovies = [...topMovies];

  // Only append first two movies if they exist
  if (topMovies.length > 0) {
    extendedMovies.push(topMovies[0]);
  }
  if (topMovies.length > 1) {
    extendedMovies.push(topMovies[1]);
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotation effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // If the next index exceeds the count of topMovies, reset to 0
        return nextIndex >= topMovies.length ? 0 : nextIndex;
      });
    }, 4000); // Rotate every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [topMovies.length]);

  // Calculate the translateX value based on the current index
  const translateX = `translateX(-${(currentIndex * 100) / 3}%)`; // Adjust based on 3 visible slides

  return (
    <div className="carousel-container">
      <div className="carousel" style={{ transform: translateX }}>
        {extendedMovies.map((movie, index) => (
          movie ? (  // Check if movie exists
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
          ) : null // Render nothing if the movie is undefined
        ))}
      </div>

      {/* Dots for navigation based on topMovies */}
      <div className="carousel-dots">
        {topMovies.map((_, index) => (
          <span
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
