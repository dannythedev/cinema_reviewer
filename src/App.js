import React, { useEffect, useState } from 'react';
import './App.css'; // Import the CSS file

// Import all logos statically
import YesPlanetLogo from './logos/fRW7ZRr.png';
import HOTCinemaLogo from './logos/eMeib2P.png';
import CinemaCityLogo from './logos/dHSZEvt.png';
import LEVCinemaLogo from './logos/PZhmbnM.png';
import IMDBLogo from './logos/6C7nVMS.png';
import TheMovieDBLogo from './logos/M63ZHXb.png';
import MetacriticLogo from './logos/Agep5Se.png';
import LetterboxdLogo from './logos/7Nt6BUb.png';
import TomatometerLogo from './logos/AGJ7mEy.png';

// A mapping of reviewer/cinema names to imported logo filenames
const logos = {
  "Yes Planet": YesPlanetLogo,
  "Hot Cinema": HOTCinemaLogo,
  "Cinema City": CinemaCityLogo,
  "Lev Cinema": LEVCinemaLogo,
  "IMDB Audience Score": IMDBLogo,
  "TheMovieDB Audience Score": TheMovieDBLogo,
  "Metacritic Audience Score": MetacriticLogo,
  "Metacritic Critic Score": MetacriticLogo,
  "Letterboxd Audience Score": LetterboxdLogo,
  "Tomatometer Audience Score": TomatometerLogo,
  "Tomatometer Critic Score": TomatometerLogo,
};

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Add state for search query

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/movies.json'); // Fetch the movies.json file
        const data = await response.json(); // Parse the JSON data
        const moviesWithVisibility = data.Movies.map(movie => ({
          ...movie,
          showScreenings: false, // Initialize showScreenings property
        }));
        setMovies(moviesWithVisibility); // Update the state with movie data
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies(); // Call the function to fetch movies
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle the search input change in real-time
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase()); // Convert query to lowercase for case-insensitive search
  };

  const filteredMovies = movies.filter((movie) => {
    const { title, genre, rating, screenings } = movie;

    // Ensure genre is a string for search
    const combinedData = [
      title,
      ...Array.isArray(genre) ? genre : [genre], // Ensure it's treated as an array
      ...Object.keys(rating),
      ...Object.values(rating).map(r => r.toString()), // Convert ratings to strings
      ...Object.keys(screenings),
      ...Object.values(screenings).flat(), // Flatten screening times arrays
    ].join(' ').toLowerCase(); // Join all data and convert to lowercase

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
      <h1>Cinema Reviewer</h1>

      {/* Search Bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search movies..."
        value={searchQuery}
        onChange={handleSearchChange} // Update search query on input change
      />

      <div className="movies-container">
        {filteredMovies.map((movie, index) => (
            <div className="movie-card" key={index}>
              <img className="movie-image" src={movie.image} alt={movie.title}/>
              <h2>{movie.title}</h2>
              <p><b>Genre:</b> {movie.genre.length > 0 ? movie.genre : 'N/A'}</p>
              <p><b>Total Rating:</b> {movie.total_rating}</p>

              <h3>Ratings:</h3>
              <ul className="ratings-list">
                {Object.entries(movie.rating).length === 0
                    ? <li>No ratings available</li>
                    : Object.entries(movie.rating).map(([reviewer, rating]) => (
                        <li className="rating-item" key={reviewer}>
                          {logos[reviewer] && (
                              <img
                                  className="logo"
                                  src={logos[reviewer]}
                                  alt={`${reviewer} logo`}
                              />
                          )}
                          <span className="rating-text">{rating} %</span> {/* Keep the rating text next to the logo */}
                        </li>
                    ))}
              </ul>


              <h3>Cinemas:</h3>
              <ul className="ratings-list">
                {Object.keys(movie.origin).length === 0
                    ? <li>No origin cinemas available</li>
                    : Object.keys(movie.origin).map(cinema => (
                        <li className="rating-item" key={cinema}>
                          {logos[cinema] && (
                              <img
                                  className="logo"
                                  src={logos[cinema]}
                                  alt={`${cinema} logo`}
                              />
                          )}
                        </li>
                    ))}
              </ul>

              <a className="trailer-link" href={movie.trailer} target="_blank" rel="noopener noreferrer">Watch
                Trailer</a>
              {/* Toggle Button for Screenings */}
              <a target="_blank"><br></br><br></br><br></br> </a>
              <button className="toggle-button" onClick={() => toggleScreenings(movie.title)}>
                {movie.showScreenings ? 'Hide Screenings' : 'Show Screenings'}
              </button>


              {/* Updated Screenings Section */}
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
                    <br></br><br></br>
                  </div>
              )}
            </div>
        ))}

      </div>
    </div>
  );
}

export default App;
