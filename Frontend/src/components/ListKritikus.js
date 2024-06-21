// ListKritikus.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListKritikus.css';

const ListKritikus = () => {
  const [critics, setCritics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const defaultCriticImage = 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg&ga=GA1.1.2043474510.1718615911&semt=ais_user';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const criticResponse = await axios.get('http://127.0.0.1:8000/critics');
        setCritics(criticResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="kritikus-container">
      <div className="kritikus-list">
        <div className="top-card">
          <h1>Daftar Kritikus</h1>
        </div>

        <ul className="kritikus-card-container">
          {critics.map((critic, index) => (
            <li key={index} className="kritikus-card">
              <span className="kritikus-index">{index + 1}</span>
              <img
                src={critic.img ? critic.img : defaultCriticImage}
                alt={`Critic ${index + 1}`}
                className="kritikus-poster"
                onError={(e) => { e.target.onerror = null; e.target.src = defaultCriticImage }}
              />
              <div className="kritikus-info">
                <p className="kritikus-name">{critic.name}</p>
                <p className="kritikus-email">{critic.email}</p>
                <p className="kritikus-bio">{critic.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListKritikus;
