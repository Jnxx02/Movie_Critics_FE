import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [carouselMovies, setCarouselMovies] = useState([]);
  const [critics, setCritics] = useState([]);
  const [currentFilmIndex, setCurrentFilmIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const defaultCriticImage = 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg&ga=GA1.1.2043474510.1718615911&semt=ais_user';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filmResponse = await axios.get('http://127.0.0.1:8000/movies');
        const criticResponse = await axios.get('http://127.0.0.1:8000/critics');

        setMovies(filmResponse.data);
        const shuffledMovies = [...filmResponse.data].sort(() => 0.5 - Math.random());
        const selectedMovies = shuffledMovies.slice(0, 5);
        setCarouselMovies(selectedMovies);
        setCritics(criticResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextFilm = () => {
    setCurrentFilmIndex((prevIndex) => (prevIndex + 1) % carouselMovies.length);
  };

  const prevFilm = () => {
    setCurrentFilmIndex((prevIndex) => (prevIndex - 1 + carouselMovies.length) % carouselMovies.length);
  };

  const currentFilm = carouselMovies[currentFilmIndex];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='full-container'>
      <div className='carousel-container'>
        <div className='carousel-content'>
          <button className='carousel-control-prev' onClick={prevFilm}>
            &lt;
          </button>
          <div className='carousel-info'>
            <div className='carousel-title'>
              <h2>{currentFilm.title}</h2>
            </div>
            <div className='carousel-synopsis'>
              <p>{currentFilm.synopsis}</p>
            </div>
            <div className='watch-trailer-button'>
              <button onClick={() => window.location.href = currentFilm.trailer}>WATCH TRAILER</button>
            </div>
          </div>
          <div className='carousel-poster'>
            <img src={currentFilm.cover} alt={currentFilm.title} className="carousel-poster-img" onError={() => console.log('Image error:', currentFilm.cover)} />
          </div>
          <button className='carousel-control-next' onClick={nextFilm}>
            &gt;
          </button>
        </div>
      </div>

      <div className="home-container">
        <div className="film-list">
          <div className="top-card">
            <h1>Daftar Film</h1>
            <Link className="see-more" to="/listfilm">See More &gt;</Link>
          </div>
          <div className="film-item-container">
            {movies.slice(0, 4).map((film, index) => (
              <Link to={`/film/${film.id}`} className="film-item" key={index}>
                <img
                  src={film.cover}
                  alt={`Film ${index + 1}`}
                  className="film-thumbnail"
                  onError={() => console.log('Image error:', film.cover)}
                />
                <div className="film-info">
                  <p className="film-title">
                    {film.title.length > 40 ? `${film.title.substring(0, 30)}...` : film.title}
                  </p>
                  <p className="film-genre">
                    {film.genre.length > 40 ? `${film.genre.substring(0, 30)}...` : film.genre}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="home-kritikus-list">
          <div className="top-card">
            <h1>Daftar Kritikus</h1>
            <Link className="see-more" to="/listkritikus">See More &gt;</Link>
          </div>
          <div className="kritikus-item-container">
            {critics.slice(0, 5).map((critic, index) => (
              <div key={index} className="home-kritikus-item">
                <img
                  src={critic.img ? critic.img : defaultCriticImage}
                  alt={`Critic ${index + 1}`}
                  className="home-kritikus-thumbnail"
                  onError={() => console.log('Image error:', critic.img)}
                />
                <div className="home-kritikus-info">
                  <p className="home-kritikus-name">
                    {critic.name.length > 40 ? `${critic.name.substring(0, 30)}...` : critic.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
