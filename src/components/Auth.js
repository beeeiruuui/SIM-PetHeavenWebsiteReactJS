import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { isLoggedIn, user, login, register, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(formData.email, formData.password, activeTab);
    
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      setTimeout(() => {
        if (activeTab === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      }, 1000);
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }

    const result = register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
      address: formData.address
    }, activeTab);

    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      setTimeout(() => {
        if (activeTab === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      }, 1000);
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const handleLogout = () => {
    logout();
    setFormData({ email: '', password: '', confirmPassword: '', name: '', phone: '', address: '' });
    setMessage({ text: 'You have been logged out.', type: 'success' });
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setIsRegistering(false);
    setMessage({ text: '', type: '' });
    setFormData({ email: '', password: '', confirmPassword: '', name: '', phone: '', address: '' });
  };

  // If user is logged in, show appropriate message
  if (isLoggedIn && user) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-logged-in">
            <div className="user-avatar">
              {isAdmin() ? '👨‍💼' : '👤'}
            </div>
            <h2>Welcome, {user.name}!</h2>
            <p className="user-role">
              Logged in as: <span className={`role-badge ${user.role}`}>{user.role}</span>
            </p>
            <div className="auth-actions">
              {isAdmin() ? (
                <button className="btn btn-primary" onClick={() => navigate('/admin')}>
                  Go to Admin Dashboard
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                  Go to Profile
                </button>
              )}
              <button className="btn btn-secondary" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => switchTab('user')}
          >
            <span className="tab-icon">👤</span>
            User
          </button>
          <button 
            className={`auth-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => switchTab('admin')}
          >
            <span className="tab-icon">👨‍💼</span>
            Admin
          </button>
        </div>

        <div className="auth-content">
          <h2>
            {activeTab === 'admin' ? 'Admin ' : ''}
            {isRegistering ? 'Registration' : 'Sign In'}
          </h2>
          
          {activeTab === 'admin' && !isRegistering && (
            <p className="auth-hint">
              Demo credentials: admin@petheaven.org.sg / admin123
            </p>
          )}

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
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>

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

            <button type="submit" className="btn btn-primary btn-full">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {message.text && (
            <p className={`message ${message.type}`}>{message.text}</p>
          )}

          <div className="auth-switch">
            {isRegistering ? (
              <p>
                Already have an account?{' '}
                <button 
                  className="link-btn" 
                  onClick={() => { setIsRegistering(false); setMessage({ text: '', type: '' }); }}
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button 
                  className="link-btn" 
                  onClick={() => { setIsRegistering(true); setMessage({ text: '', type: '' }); }}
                >
                  Register now
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
