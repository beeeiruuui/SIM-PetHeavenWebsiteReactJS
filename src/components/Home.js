import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Pet Heaven</h1>
          <p className="hero-subtitle">
            Giving abandoned pets a second chance at happiness
          </p>
          <p className="hero-description">
            We are a charity society dedicated to caring for abandoned cats and dogs, 
            helping them find loving forever homes.
          </p>
          <div className="hero-buttons">
            <Link to="/funcat" className="btn btn-primary">Meet Our Cats</Link>
            <Link to="/fundog" className="btn btn-secondary">Meet Our Dogs</Link>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section">
        <h2>Our Mission</h2>
        <p>
          At Pet Heaven, we believe every pet deserves love, care, and a safe home. 
          Our mission is to rescue, rehabilitate, and rehome abandoned cats and dogs 
          while educating the community about responsible pet ownership.
        </p>
      </section>

      {/* Services/Features Section */}
      <section className="features-section">
        <h2>What We Do</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🏠</span>
            <h3>Pet Adoption</h3>
            <p>Find your perfect furry companion from our loving residents ready for their forever home.</p>
            <Link to="/adopt" className="btn btn-outline">Adopt a Pet</Link>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">💝</span>
            <h3>Pet Release</h3>
            <p>If you can no longer care for your pet, we'll ensure they find a loving new family.</p>
            <Link to="/release" className="btn btn-outline">Release a Pet</Link>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">👥</span>
            <h3>Become a Member</h3>
            <p>Join our community of animal lovers and support our mission to help pets in need.</p>
            <Link to="/profile" className="btn btn-outline">Join Us</Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <h2>Our Impact</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Pets Rescued</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">400+</span>
            <span className="stat-label">Successful Adoptions</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">200+</span>
            <span className="stat-label">Active Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10+</span>
            <span className="stat-label">Years of Service</span>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-section">
        <h2>Our Facilities</h2>
        <div className="facilities-grid">
          <div className="facility-item">
            <h3>🏥 Medical Center</h3>
            <p>Full veterinary services for health checks, vaccinations, and treatments.</p>
          </div>
          <div className="facility-item">
            <h3>🛏️ Comfortable Housing</h3>
            <p>Clean, spacious kennels and cat rooms with climate control.</p>
          </div>
          <div className="facility-item">
            <h3>🌳 Play Areas</h3>
            <p>Outdoor and indoor play spaces for exercise and socialization.</p>
          </div>
          <div className="facility-item">
            <h3>🍽️ Nutrition Care</h3>
            <p>Quality food and specialized diets for all our residents.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Make a Difference?</h2>
        <p>Whether you want to adopt, volunteer, or support us, every action helps save a life.</p>
        <div className="cta-buttons">
          <Link to="/adopt" className="btn btn-primary">Adopt Now</Link>
          <Link to="/about" className="btn btn-secondary">Learn More</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;