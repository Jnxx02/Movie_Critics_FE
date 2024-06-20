import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending login request');
      const response = await axios.post('http://127.0.0.1:8000/token', new URLSearchParams({
        grant_type: '',
        email: email,
        password: password,
        scope: '',
        client_id: '',
        client_secret: ''
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        }
      });
      console.log('Login successful', response.data);
      localStorage.setItem('access_token', response.data.access_token);
      console.log('Token stored:', localStorage.getItem('access_token'));
      setToken(response.data.access_token, email);
      setError('');
      navigate('/');
    } catch (error) {
      console.error('Login error', error.response || error.message);
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login Your Account</h2>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn btn-success">Login</button>
      </form>
    </div>
  );
};

export default Login;
