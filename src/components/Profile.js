import React, { useState } from 'react';
import { useAuth } from '../services/unified-auth';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { isLoggedIn, user, login, register, logout } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login - in real app, this would call an API
    if (formData.email && formData.password) {
      login({
        name: 'Pet Lover',
        email: formData.email,
        phone: '123-456-7890',
        address: '123 Pet Street, Singapore',
        memberSince: '2026'
      });
      setMessage('Login successful! Welcome back.');
    } else {
      setMessage('Please enter email and password.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.email && formData.password && formData.name) {
      register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        memberSince: '2026'
      });
      setMessage('Registration successful! Welcome to Pet Heaven.');
    } else {
      setMessage('Please fill in all required fields.');
    }
  };

  const handleLogout = () => {
    logout();
    setFormData({ email: '', password: '', name: '', phone: '', address: '' });
    setMessage('You have been logged out.');
  };

  if (isLoggedIn && user) {
    return (
      <div className="profile-container">
        <h2>My Profile</h2>
        <div className="profile-card">
          <div className="profile-avatar">
            <span role="img" aria-label="user">👤</span>
          </div>
          <div className="profile-info">
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Member Since:</strong> {user.memberSince}</p>
          </div>
          <div className="profile-actions">
            <h4>Quick Actions</h4>
            <ul>
              <li><Link to="/adopt">View Adoption Requests</Link></li>
              <li><Link to="/release">Submit Release Request</Link></li>
              <li><Link to="/funcat">Browse Cats</Link></li>
              <li><Link to="/fundog">Browse Dogs</Link></li>
            </ul>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
        {message && <p className="message success">{message}</p>}
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>{isRegistering ? 'Register as Member' : 'Member Login'}</h2>
      
      <div className="auth-form">
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {isRegistering && (
            <>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="3"
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="auth-switch">
          {isRegistering ? (
            <p>
              Already a member?{' '}
              <button 
                className="link-btn" 
                onClick={() => {setIsRegistering(false); setMessage('');}}
              >
                Login here
              </button>
            </p>
          ) : (
            <p>
              Not a member yet?{' '}
              <button 
                className="link-btn" 
                onClick={() => {setIsRegistering(true); setMessage('');}}
              >
                Register now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
