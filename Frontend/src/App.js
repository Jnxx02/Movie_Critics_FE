import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyNavbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ListFilm from './components/ListFilm';
import ListKritikus from './components/ListKritikus';
import Profile from './components/Profile';
import Film from './components/Film';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email'));

  const handleSetToken = (newToken, userEmail) => {
    setToken(newToken);
    setEmail(userEmail);
    localStorage.setItem('token', newToken);
    localStorage.setItem('email', userEmail);
  };

  const handleLogout = () => {
    setToken(null);
    setEmail('');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  };

  return (
    <Router>
      <div className="App">
        <MyNavbar email={email} handleLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<Login setToken={handleSetToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home email={email} />} />
          <Route path="/listfilm" element={<ListFilm />} />
          <Route path="/listkritikus" element={<ListKritikus />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/film/:movie_id" element={<Film />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
