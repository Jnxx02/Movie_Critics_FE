import React, { useState, useEffect } from 'react';
import './ListFilm.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListFilm = () => {
  const [films, setFilms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [user, setUser] = useState({
    user_id: "",
    name: "",
    role: "",
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch user details
    axios.get('http://127.0.0.1:8000/users/user-profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setUser(response.data);
        console.log('User role:', response.data.role); // Log user role to console
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });

    // Fetch films
    axios.get('http://127.0.0.1:8000/movies')
      .then(response => {
        setFilms(response.data);
      })
      .catch(error => {
        console.error('Error fetching films:', error);
      });
  }, []);

  const handleInsertClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleEditClick = (film) => {
    setSelectedFilm(film);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (film) => {
    setSelectedFilm(film);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    const token = localStorage.getItem('token');
    axios.delete(`http://127.0.0.1:8000/movies/${selectedFilm.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setIsDeleteConfirmOpen(false);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error deleting film:', error.response || error.message);
      });
  };

  return (
    <div className="film-container">
      <div className="film-list">
        <div className="top-card">
          <h1>Daftar Film</h1>
          {user.role === 'admin' && (
            <button type="button" className="btn btn-insert" onClick={handleInsertClick}>Insert</button>
          )}
        </div>

        <div className="film-card-container">
          {films.map((film, index) => (
            <div key={index} className="film-card">
              <p>{index + 1}</p>
              <Link to={`/film/${film.id}`}>
                <img src={film.cover} alt={`Film ${index + 1}`} className="film-poster" />
              </Link>
              <div className="film-info">
                <p className="film-title">
                  {film.title.length > 50 ? `${film.title.substring(0, 30)}...` : film.title}
                </p>
                <p className="film-genres">{film.genre}</p>
                <p className="film-release_year">{film.release_year}</p>
              </div>
              {user.role === 'admin' && (
                <div className="film-actions">
                  <button className="btn-edit" onClick={() => handleEditClick(film)}><FaEdit /></button>
                  <button className="btn-delete" onClick={() => handleDeleteClick(film)}><FaTrash /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && <Modal onClose={handleCloseModal} />}
      {isEditModalOpen && <EditModal onClose={handleCloseModal} film={selectedFilm} />}
      {isDeleteConfirmOpen && <DeleteConfirm onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={handleConfirmDelete} />}
    </div>
  );
};

const Modal = ({ onClose }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [duration, setDuration] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFilm = {
      cover: imageUrl,
      title,
      genre,
      synopsis,
      duration,
      release_year: releaseYear,
      trailer: trailerUrl,
    };

    axios.post('http://127.0.0.1:8000/movies', newFilm, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('Response:', response);
        onClose();
        window.location.reload();
      })
      .catch(error => {
        console.error('Error creating film:', error.response || error.message);
      });
  };

  const handleImageClick = () => {
    document.getElementById('imageInput').click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>New Film</h2>
        <form className="insert-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <img
              src={imageUrl || 'https://via.placeholder.com/80'}
              alt="Film Poster"
              className="film-image"
            />
            <input
              type="text"
              className="form-control"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Judul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Sinopsis"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Durasi Film"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Tahun Rilis"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Trailer URL"
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
            />
          </div>
          <div className="buttons">
            <button type="button" className="btn btn-back" onClick={onClose}>Back</button>
            <button type="submit" className="btn btn-submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditModal = ({ onClose, film }) => {
  const [imageUrl, setImageUrl] = useState(film.cover);
  const [title, setTitle] = useState(film.title);
  const [genre, setGenre] = useState(film.genre);
  const [synopsis, setSynopsis] = useState(film.synopsis);
  const [duration, setDuration] = useState(film.duration);
  const [releaseYear, setReleaseYear] = useState(film.release_year);
  const [trailerUrl, setTrailerUrl] = useState(film.trailer);

  const token = localStorage.getItem('token');

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFilm = {
      cover: imageUrl,
      title,
      genre,
      synopsis,
      duration,
      release_year: releaseYear,
      trailer: trailerUrl,
    };

    axios.put(`http://127.0.0.1:8000/movies/${film.id}`, updatedFilm, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('Response:', response);
        onClose();
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating film:', error.response || error.message);
      });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit Film</h2>
        <form className="insert-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <img
              src={imageUrl || 'https://via.placeholder.com/80'}
              alt="Film Poster"
              className="film-image"
            />
            <input
              type="text"
              className="form-control"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={title}
              placeholder="Judul"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={genre}
              placeholder="Genre"
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control"
              value={synopsis}
              placeholder="Sinopsis"
              onChange={(e) => setSynopsis(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={duration}
              placeholder="Durasi Film"
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={releaseYear}
              placeholder="Tahun Rilis"
              onChange={(e) => setReleaseYear(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={trailerUrl}
              placeholder="Trailer URL"
              onChange={(e) => setTrailerUrl(e.target.value)}
            />
          </div>
          <div className="buttons">
            <button type="button" className="btn btn-back" onClick={onClose}>Back</button>
            <button type="submit" className="btn btn-submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirm = ({ onClose, onConfirm }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Are you sure you want to delete this film?</h2>
        <div className="buttons">
          <button type="button" className="btn btn-back" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-submit" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ListFilm;
