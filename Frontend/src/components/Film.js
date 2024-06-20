import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Film.css';

const Film = () => {
  const { movie_id } = useParams();
  const [film, setFilm] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);
  const [user, setUser] = useState({
    user_id: "",
    name: "",
    role: "",
  });
  const [userRating, setUserRating] = useState(null);

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
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });

    // Fetch movie details
    axios.get(`http://127.0.0.1:8000/movies/${movie_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setFilm(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });

    // Fetch reviews
    axios.get(`http://127.0.0.1:8000/reviews/${movie_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });

    // Fetch comments
    axios.get(`http://127.0.0.1:8000/comments/${movie_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });

    // Fetch average rating
    axios.get(`http://127.0.0.1:8000/ratings/average/${movie_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setAverageRating(response.data);
      })
      .catch(error => {
        console.error('Error fetching average rating:', error);
      });

    // Fetch user's rating
    if (user.user_id) {
      axios.get(`http://127.0.0.1:8000/ratings/${movie_id}/user/${user.user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          setUserRating(response.data);
          setRating(response.data.rating); // Set the rating state to user's rating
        })
        .catch(error => {
          console.error('Error fetching user rating:', error);
          setUserRating(null); // Reset userRating if there's an error
          setRating(0); // Reset rating if there's an error
        });
    }
  }, [movie_id, user.user_id]); // Add user.user_id to dependency array

  const handleRatingSubmit = () => {
    const token = localStorage.getItem('token');
    const ratingData = {
      rating: rating,
      movie_id: movie_id,
      user_id: user.user_id
    };

    if (userRating) {
      // User has already rated this movie
      console.error('User has already rated this movie');
      alert('You have already rated this movie.');
      return;
    }

    // Show confirmation dialog
    const isConfirmed = window.confirm('Rating yang dimasukkan sudah tidak bisa diubah. Apakah Anda yakin?');
    if (!isConfirmed) {
      return;
    }

    console.log('Submitting rating data:', ratingData); // Log data yang dikirim

    axios.post('http://127.0.0.1:8000/ratings', ratingData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Rating submitted:', response.data);
        setUserRating(response.data); // Update userRating state
        // Optionally, fetch the updated average rating
        return axios.get(`http://127.0.0.1:8000/ratings/average/${movie_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      })
      .then(response => {
        setAverageRating(response.data);
      })
      .catch(error => {
        console.error('Error submitting rating:', error);
        if (error.response) {
          console.error('Error response:', error.response.data); // Log respons kesalahan dari server
        }
      });
  };

  const handleCommentSubmit = () => {
    const token = localStorage.getItem('token');
    if (newComment.trim() && user && user.role === 'user') {
      const commentData = {
        name: user.name,
        content: newComment,
        movie_id: movie_id,
        author_id: user.user_id
      };

      if (editingComment) {
        // Update existing comment
        axios.put(`http://127.0.0.1:8000/comments/${editingComment.id}`, commentData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            setComments(comments.map(comment => comment.id === editingComment.id ? response.data : comment));
            setEditingComment(null);
            setNewComment('');
          })
          .catch(error => {
            console.error('Error updating comment:', error);
          });
      } else {
        // Create new comment
        axios.post('http://127.0.0.1:8000/comments', commentData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            setComments([...comments, response.data]);
            setNewComment('');
          })
          .catch(error => {
            console.error('Error creating comment:', error);
          });
      }
    }
  };

  const handleReviewSubmit = () => {
    const token = localStorage.getItem('token');
    if (newReview.trim() && user && user.role === 'critic') {
      const reviewData = {
        name: user.name,
        content: newReview,
        movie_id: movie_id,
        author_id: user.user_id
      };

      if (editingReview) {
        axios.put(`http://127.0.0.1:8000/reviews/${editingReview.id}`, reviewData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            setReviews(reviews.map(review => review.id === editingReview.id ? response.data : review));
            setEditingReview(null);
            setNewReview('');
          })
          .catch(error => {
            console.error('Error updating review:', error);
            if (error.response) {
              console.error('Error response:', error.response.data);
            }
          });
      } else {
        axios.post('http://127.0.0.1:8000/reviews', reviewData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            setReviews([...reviews, response.data]);
            setNewReview('');
          })
          .catch(error => {
            console.error('Error creating review:', error);
            if (error.response) {
              console.error('Error response:', error.response.data);
            }
          });
      }
    } else {
      console.error('Invalid review submission. Check user role and user ID.');
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setNewComment(comment.content || ''); // Ensure we use 'content' instead of 'text'
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview(review.content || ''); // Ensure we use 'content' instead of 'text'
  };

  const handleDeleteComment = (commentId) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://127.0.0.1:8000/comments/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setComments(comments.filter(comment => comment.id !== commentId));
      })
      .catch(error => {
        console.error('Error deleting comment:', error);
      });
  };

  const handleDeleteReview = (reviewId) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://127.0.0.1:8000/reviews/${reviewId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setReviews(reviews.filter(review => review.id !== reviewId));
      })
      .catch(error => {
        console.error('Error deleting review:', error);
      });
  };

  // Loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="detailFilm-container">
      <div className="detail-card">
        <div className="top-card-film">
          <h2>{film.title}</h2>
        </div>
        <div className="content">
          <img src={film.cover || 'https://via.placeholder.com/150'} alt="Film Poster" className="film-img" />
          <div className="film-info">
            <p className="profile-label">Genre:</p>
            <p className="profile-value">{film.genre}</p>

            <p className="profile-label">Durasi:</p>
            <p className="profile-value">{film.duration + " menit"}</p>

            <p className="profile-label">Tahun Rilis:</p>
            <p className="profile-value">{film.release_year}</p>

            <p className="profile-label">Sinopsis:</p>
            <p className="profile-bio">{film.synopsis}</p>
          </div>
        </div>
      </div>

      <div className="garis"></div>

      {user && (user.role === 'user' || user.role === 'admin') && (
        <div className="comment-container">
          <h2>Comments</h2>
          {user.role === 'user' && (
            <div className="new-comment">
              <img src={'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg&ga=GA1.1.2043474510.1718615911&semt=ais_user'} alt="User Profile" className="user-img" />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Isi ulasan atau review"
                className="comment-input"
              />
              <button onClick={handleCommentSubmit} className="comment-button">Submit</button>
            </div>
          )}
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <img src={'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg&ga=GA1.1.2043474510.1718615911&semt=ais_user'} alt="User Profile" className="user-img" />
                  <div className="comment-info">
                    <p className="comment-user">{comment.name}</p>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                  {user && (user.id === comment.author_id || user.role === 'admin') && (
                    <div className="comment-actions">
                      {user.role !== 'admin' && <button onClick={() => handleEditComment(comment)} className="edit-button">Edit</button>}
                      <button onClick={() => handleDeleteComment(comment.id)} className="delete-button">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user && (user.role === 'critic' || user.role === 'admin' || user.role === 'user') && (
        <div className="review-container">
          <h2>Reviews</h2>
          {user.role === 'critic' && (
            <div className="new-review">
              <img src={'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg&ga=GA1.1.2043474510.1718615911&semt=ais_user'} alt="User Profile" className="user-img" />
              <input
                type="text"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Isi ulasan atau review"
                className="review-input"
              />
              <button onClick={handleReviewSubmit} className="review-button">Submit</button>
            </div>
          )}
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review">
                <div className="review-header">
                  <img src={'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg&ga=GA1.1.2043474510.1718615911&semt=ais_user'} alt="User Profile" className="user-img" />
                  <div className="review-info">
                    <p className="review-author">{review.name}</p>
                    <p className="review-text">{review.content}</p>
                  </div>
                  {user && (user.id === review.author_id || user.role === 'admin') && (
                    <div className="review-actions">
                      {user.role !== 'admin' && <button onClick={() => handleEditReview(review)} className="edit-button">Edit</button>}
                      <button onClick={() => handleDeleteReview(review.id)} className="delete-button">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rating-container">
        <h2>Rate This Movie</h2>
        <div className="rating-stars">
          {[...Array(10)].map((_, index) => (
            <span
              key={index}
              className={`star ${index < rating ? 'selected' : ''}`}
              onClick={() => setRating(index + 1)}
            >
              ★
            </span>
          ))}
        </div>
        <button onClick={handleRatingSubmit} className="rating-button">Rate</button>
        {averageRating !== null && (
          <div className="average-rating">
            <p>Average Rating: {averageRating.toFixed(1)}/10</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Film;
