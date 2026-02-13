import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-container">
      <h1>About Pet Heaven</h1>
      
      <section className="about-section">
        <h2>Our Story</h2>
        <p>
          Pet Heaven was founded in 2015 by a group of passionate animal lovers who saw 
          the growing number of abandoned pets in Singapore. What started as a small 
          volunteer group has grown into a registered charity organization dedicated to 
          giving every cat and dog a second chance at life.
        </p>
        <p>
          Today, we operate a fully-equipped shelter that can house up to 100 animals 
          at any given time. Our team of dedicated staff and volunteers work tirelessly 
          to ensure each pet receives the care, love, and attention they deserve while 
          waiting for their forever home.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <div className="mission-box">
          <p>
            <strong>To rescue, rehabilitate, and rehome abandoned pets while promoting 
            responsible pet ownership in our community.</strong>
          </p>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <span className="value-icon">❤️</span>
            <h3>Compassion</h3>
            <p>We treat every animal with kindness and respect, understanding that each one has their own story and needs.</p>
          </div>
          <div className="value-card">
            <span className="value-icon">🤝</span>
            <h3>Integrity</h3>
            <p>We are transparent in our operations and accountable to our supporters, volunteers, and the animals in our care.</p>
          </div>
          <div className="value-card">
            <span className="value-icon">✨</span>
            <h3>Excellence</h3>
            <p>We strive to provide the highest standard of care and continuously improve our services.</p>
          </div>
          <div className="value-card">
            <span className="value-icon">🌍</span>
            <h3>Community</h3>
            <p>We believe in building a community of animal lovers who work together for the welfare of pets.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>What We Offer</h2>
        <div className="services-list">
          <div className="service-item">
            <h3>🐱 Cat Adoptions</h3>
            <p>Browse our adorable cats looking for loving homes. All cats are vaccinated, 
            health-checked, and ready for adoption.</p>
          </div>
          <div className="service-item">
            <h3>🐕 Dog Adoptions</h3>
            <p>Meet our friendly dogs waiting for their forever families. Each dog comes 
            with complete vaccination records and health certificates.</p>
          </div>
          <div className="service-item">
            <h3>📝 Pet Release Services</h3>
            <p>If you can no longer care for your pet, we provide a humane solution to 
            help them find a new loving home.</p>
          </div>
          <div className="service-item">
            <h3>📚 Education Programs</h3>
            <p>We offer workshops and educational sessions on responsible pet ownership, 
            pet care, and animal welfare.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="team-avatar">👩‍⚕️</div>
            <h3>Dr. Sarah Tan</h3>
            <p className="team-role">Veterinarian</p>
            <p>Leading our medical team with 15 years of experience in animal healthcare.</p>
          </div>
          <div className="team-member">
            <div className="team-avatar">👨‍💼</div>
            <h3>Michael Lee</h3>
            <p className="team-role">Shelter Manager</p>
            <p>Overseeing daily operations and ensuring the best care for all our residents.</p>
          </div>
          <div className="team-member">
            <div className="team-avatar">👩‍🎓</div>
            <h3>Emily Wong</h3>
            <p className="team-role">Adoption Coordinator</p>
            <p>Matching pets with their perfect families and following up on adoptions.</p>
          </div>
          <div className="team-member">
            <div className="team-avatar">👨‍🔧</div>
            <h3>David Lim</h3>
            <p className="team-role">Volunteer Coordinator</p>
            <p>Managing our amazing team of dedicated volunteers.</p>
          </div>
        </div>
      </section>

      <section className="about-section contact-section">
        <h2>Contact Us</h2>
        <div className="contact-info">
          <div className="contact-item">
            <span>📍</span>
            <p><strong>Address:</strong><br />123 Pet Haven Road, Singapore 123456</p>
          </div>
          <div className="contact-item">
            <span>📞</span>
            <p><strong>Phone:</strong><br />+65 6123 4567</p>
          </div>
          <div className="contact-item">
            <span>📧</span>
            <p><strong>Email:</strong><br />info@petheaven.org.sg</p>
          </div>
          <div className="contact-item">
            <span>🕐</span>
            <p><strong>Visiting Hours:</strong><br />Tue - Sun: 10am - 6pm<br />Closed on Mondays</p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>Get Involved Today!</h2>
        <p>Join us in our mission to give every pet a loving home.</p>
        <div className="cta-buttons">
          <Link to="/adopt" className="btn btn-primary">Adopt a Pet</Link>
          <Link to="/profile" className="btn btn-secondary">Become a Member</Link>
        </div>
      </section>
    </div>
  );
};

export default About;