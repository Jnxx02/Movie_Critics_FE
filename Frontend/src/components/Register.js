import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/register', {
        name,
        email,
        password,
        role,
      });
      setSuccess('Account created successfully!');
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
          />
        </div>

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

        <div className="form-group">
          <select className="form-control" value={role} onChange={handleRoleChange}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="critic">Kritikus</option>
          </select>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="btn btn-success">Create Account</button>
        <a href="/login" className='forgot'>Already have an account? Log in</a>
      </form>
    </div>
  );
};

export default Register;
