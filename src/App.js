import React, { useEffect, useState } from 'react';
import './App.css'; // Import the CSS file
import Footer from './Footer';
import Carousel from './Carousel'; // Import the Carousel component

// Import all logos statically
import SiteLogo from './logos/logo.png';
import YesPlanetLogo from './logos/fRW7ZRr.png';
import HOTCinemaLogo from './logos/eMeib2P.png';
import CinemaCityLogo from './logos/dHSZEvt.png';
import LEVCinemaLogo from './logos/PZhmbnM.png';
import IMDBLogo from './logos/6C7nVMS.png';
import TheMovieDBLogo from './logos/M63ZHXb.png';
import MetacriticCriticLogo from './logos/Agep5Se_critic.png';
import MetacriticAudienceLogo from './logos/Agep5Se_audience.png';
import LetterboxdLogo from './logos/7Nt6BUb.png';
import TomatometerCriticLogo from './logos/AGJ7mEy_critic.png';
import TomatometerAudienceLogo from './logos/AGJ7mEy_audience.png';

// A mapping of reviewer/cinema names to imported logo filenames
export const logos = {
  "Yes Planet": YesPlanetLogo,
  "Hot Cinema": HOTCinemaLogo,
  "Cinema City": CinemaCityLogo,
  "Lev Cinema": LEVCinemaLogo,
  "IMDB Audience Score": IMDBLogo,
  "TheMovieDB Audience Score": TheMovieDBLogo,
  "Metacritic Audience Score": MetacriticAudienceLogo,
  "Metacritic Critic Score": MetacriticCriticLogo,
  "Letterboxd Audience Score": LetterboxdLogo,
  "Tomatometer Audience Score": TomatometerAudienceLogo,
  "Tomatometer Critic Score": TomatometerCriticLogo,
};

// Mapping of logo keys to their respective links
const logoToKeyMapping = {
  "IMDB Audience Score": "IMDB",
  "TheMovieDB Audience Score": "TheMovieDB",
  "Metacritic Audience Score": "Metacritic",
  "Metacritic Critic Score": "Metacritic",
  "Letterboxd Audience Score": "Letterboxd",
  "Tomatometer Audience Score": "Rotten Tomatoes",
  "Tomatometer Critic Score": "Rotten Tomatoes",
};

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://cinema-reviewer.onrender.com/movies');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const moviesWithVisibility = data.Movies.map(movie => ({
          ...movie,
          showScreenings: false,
        }));

        setMovies(moviesWithVisibility);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredMovies = movies.filter((movie) => {
    const { title, genre, rating, screenings } = movie;
    const combinedData = [
      title,
      ...Array.isArray(genre) ? genre : [genre],
      ...Object.keys(rating),
      ...Object.values(rating).map(r => r.toString()),
      ...Object.keys(screenings),
      ...Object.values(screenings).flat(),
    ].join(' ').toLowerCase();
    return combinedData.includes(searchQuery);
  });

  const toggleScreenings = (title) => {
    const updatedMovies = movies.map(movie =>
      movie.title === title
        ? { ...movie, showScreenings: !movie.showScreenings }
        : movie
    );
    setMovies(updatedMovies);
  };

  return (
      <div>
        <h1 className="title-with-logo">
          <img src={SiteLogo} alt="Site Logo" className="site-logo"/>
        </h1>


        {/* Search Bar */}
        <div className="search-container">
          <input
              type="text"
              className="search-bar"
              placeholder="Search by movies, genre, cinemas, reviewers..."
              value={searchQuery}
              onChange={handleSearchChange}
          />
        </div>

        {!searchQuery && <Carousel movies={movies} />}

        <div className="movies-container">
          {filteredMovies.map((movie, index) => (
              <div className="movie-card" key={index}>
                <img className="movie-image"
                     src={movie.image || 'https://www.prokerala.com/movies/assets/img/no-poster-available.webp'}
                     alt={movie.title}/>
                <h2>{movie.title}</h2>
                <h4>{movie.duration || 'N/A'}</h4>
                <p><b>Genre:</b> {movie.genre.length > 0 ? movie.genre : 'N/A'}</p>
                <p><b>Total Rating:</b> {movie.total_rating || 'N/A'}</p>

                <h3>Ratings:</h3>
                <ul className="ratings-list">
                  {Object.entries(movie.rating).length === 0 ? (
                      <li>No ratings available</li>
                  ) : (
                      Object.entries(movie.rating).map(([reviewer, rating]) => {
                        const logoKey = logoToKeyMapping[reviewer]; // Get the mapped key for the logo
                        const link = movie.links[logoKey]; // Get the link based on the mapped key
                        const logoSrc = logos[reviewer]; // Get the logo source

                        return (
                            <li className="rating-item" key={reviewer}>
                              {logoSrc && (
                                  link ? ( // If link exists, make it clickable
                                      <a
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="logo-link" // This class can be styled for hover effects
                                      >
                                        <img
                                            className="logo"
                                            src={logoSrc}
                                            alt={`${reviewer} logo`}
                                        />
                                      </a>
                                  ) : ( // If no link, just show the logo without a link
                                      <img
                                          className="logo static-logo" // Add a class for styling if needed
                                          src={logoSrc}
                                          alt={`${reviewer} logo`}
                                      />
                                  )
                              )}
                              <span className="rating-text">{rating} %</span>
                            </li>
                        );
                      })
                  )}
                </ul>


                <h3>Cinemas:</h3>
                <ul className="ratings-list">
                  {Object.keys(movie.origin).length === 0 ? (
                      <li>No origin cinemas available</li>
                  ) : (
                      Object.keys(movie.origin).map(cinema => (
                          <li className="rating-item" key={cinema}>
                            {logos[cinema] && (
                                <img
                                    className="logo"
                                    src={logos[cinema]}
                                    alt={`${cinema} logo`}
                                />
                            )}
                          </li>
                      ))
                  )}
                </ul>

                <a className="trailer-link" href={movie.trailer} target="_blank" rel="noopener noreferrer">Watch
                  Trailer</a>
                {Object.entries(movie.screenings).length > 0 && (
                    <button className="toggle-button" onClick={() => toggleScreenings(movie.title)}>
                      {movie.showScreenings ? 'Hide Screenings' : 'Show Screenings'}
                    </button>
                )}

                {movie.showScreenings && (
                    <div>
                      <h3>Screenings:</h3>
                      {Object.entries(movie.screenings).length === 0 ? (
                          <p>No screenings available</p>
                      ) : (
                          <div className="screenings-container">
                            {Object.entries(movie.screenings).map(([cinema, times]) => (
                                <div className="screening-card" key={cinema}>
                                  <span className="screening-title">{cinema}</span>
                                  <span className="screening-times-container">
                          {times.map((time, index) => (
                              <div className="ellipse" key={index}>
                                {time}
                              </div>
                          ))}
                        </span>
                                </div>
                            ))}
                          </div>
                      )}
                      <br/><br/>
                    </div>
                )}
              </div>
          ))}
        </div>
        <Footer/>
      </div>
  );
}

export default App;
