import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const AdoptionForm = () => {
  const location = useLocation();
  const petFromState = location.state?.pet || null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    petName: petFromState?.name || '',
    petType: petFromState?.type || '',
    reason: '',
    experience: '',
    housing: 'house',
    hasOtherPets: 'no',
    otherPetsDetails: '',
    agreeTerms: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.petName.trim()) newErrors.petName = 'Pet name is required';
    if (!formData.reason.trim()) newErrors.reason = 'Please tell us why you want to adopt';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would send to a backend API
      console.log('Adoption form submitted:', formData);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="form-container">
        <div className="success-message">
          <h2>🎉 Adoption Request Submitted!</h2>
          <p>Thank you for your interest in adopting <strong>{formData.petName}</strong>!</p>
          <p>Our staff at Pet Heaven will review your application and contact you within 3-5 business days.</p>
          <p>We will arrange an interview to discuss the adoption process and ensure a perfect match for both you and your new furry friend.</p>
          <div className="reference-info">
            <p><strong>Reference Email:</strong> {formData.email}</p>
            <p><strong>Submitted:</strong> {new Date().toLocaleDateString()}</p>
          </div>
          <a href="/" className="btn btn-primary">Return to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Pet Adoption Request Form</h2>
      <p className="form-intro">
        Thank you for considering adoption! Please fill out this form and our team will get back to you.
      </p>

      <form onSubmit={handleSubmit} className="adoption-form">
        <fieldset>
          <legend>Your Information</legend>
          
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., 9123-4567"
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Home Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              rows="3"
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>
        </fieldset>

        <fieldset>
          <legend>Pet Information</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="petName">Pet Name *</label>
              <input
                type="text"
                id="petName"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                placeholder="Name of pet you wish to adopt"
              />
              {errors.petName && <span className="error">{errors.petName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="petType">Pet Type</label>
              <select
                id="petType"
                name="petType"
                value={formData.petType}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Why do you want to adopt this pet? *</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Tell us why you want to give this pet a home..."
              rows="4"
            />
            {errors.reason && <span className="error">{errors.reason}</span>}
          </div>
        </fieldset>

        <fieldset>
          <legend>Your Living Situation</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="housing">Housing Type</label>
              <select
                id="housing"
                name="housing"
                value={formData.housing}
                onChange={handleChange}
              >
                <option value="house">House</option>
                <option value="apartment">Apartment/Condo</option>
                <option value="hdb">HDB Flat</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hasOtherPets">Do you have other pets?</label>
              <select
                id="hasOtherPets"
                name="hasOtherPets"
                value={formData.hasOtherPets}
                onChange={handleChange}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>

          {formData.hasOtherPets === 'yes' && (
            <div className="form-group">
              <label htmlFor="otherPetsDetails">Please describe your other pets</label>
              <textarea
                id="otherPetsDetails"
                name="otherPetsDetails"
                value={formData.otherPetsDetails}
                onChange={handleChange}
                placeholder="Type, breed, age, etc."
                rows="2"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="experience">Previous pet ownership experience</label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Tell us about your experience with pets..."
              rows="3"
            />
          </div>
        </fieldset>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            I agree to the Pet Heaven adoption terms and understand that the society will conduct an interview before finalizing the adoption. *
          </label>
          {errors.agreeTerms && <span className="error">{errors.agreeTerms}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-large">
          Submit Adoption Request
        </button>
      </form>
    </div>
  );
};

export default AdoptionForm;
