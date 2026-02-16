import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/unified-auth';
import { sendReleaseEmail } from '../services/email-service';

const ReleaseForm = () => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();
  const petToRelease = location.state?.petToRelease || null;
  
  const [formData, setFormData] = useState({
    ownerName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    petName: petToRelease?.name || '',
    petType: petToRelease?.type?.toLowerCase() || 'cat',
    petBreed: petToRelease?.breed || '',
    petAge: petToRelease?.age || '',
    petGender: petToRelease?.gender?.toLowerCase() || 'male',
    isVaccinated: petToRelease?.vaccinated || 'yes',
    isNeutered: petToRelease?.neutered || 'no',
    healthCondition: '',
    personality: petToRelease?.personality || '',
    reason: '',
    urgency: 'normal',
    agreeTerms: false
  });

  // Check if releasing an adopted pet (has fixed info that shouldn't change)
  const isReleasingAdoptedPet = !!petToRelease;

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showEmailWarning, setShowEmailWarning] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.petName.trim()) newErrors.petName = 'Pet name is required';
    if (!formData.petAge.trim()) newErrors.petAge = 'Pet age is required';
    if (!formData.reason.trim()) newErrors.reason = 'Please provide a reason';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save to localStorage for history tracking
      const releaseRequest = {
        id: Date.now(),
        ...formData,
        status: 'Pending',
        submittedDate: new Date().toISOString(),
        type: 'release'
      };
      
      const existingRequests = JSON.parse(localStorage.getItem('releaseRequests') || '[]');
      existingRequests.push(releaseRequest);
      localStorage.setItem('releaseRequests', JSON.stringify(existingRequests));
      
      // Open email client to send to admin
      sendReleaseEmail(formData);
      
      console.log('Release form submitted:', formData);
      // Show email warning modal instead of directly completing
      setShowEmailWarning(true);
    }
  };

  const handleEmailSent = () => {
    setShowEmailWarning(false);
    setSubmitted(true);
  };

  // Require login to submit release form
  if (!isLoggedIn) {
    return (
      <div className="form-container">
        <div className="login-required-message">
          <span className="login-icon">🔐</span>
          <h2>Membership Required</h2>
          <p>Please become a member to submit a release request.</p>
          <p className="login-note">This helps us process your request and keep you updated on your pet's status.</p>
          <div className="login-actions">
            <Link to="/profile" className="btn btn-primary">Become a Member</Link>
            <Link to="/" className="btn btn-secondary">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (showEmailWarning) {
    return (
      <div className="form-container">
        <div className="warning-modal-overlay">
          <div className="warning-modal">
            <span className="warning-icon">⚠️</span>
            <h2>Important: Email Required!</h2>
            <div className="warning-content">
              <p><strong>Your email client should have opened with the release request.</strong></p>
              <p className="warning-alert">🚨 If you do not send the email to our administrator, your release request <strong>will NOT be approved</strong>.</p>
              <p>Please ensure you have:</p>
              <ul>
                <li>✉️ Sent the email from your email client</li>
                <li>📧 Verified the recipient is correct</li>
                <li>📝 Included all the form information</li>
              </ul>
              <p className="warning-note">Only click "I Have Sent the Email" after you have successfully sent the email.</p>
            </div>
            <div className="warning-actions">
              <button className="btn btn-primary" onClick={handleEmailSent}>
                ✅ I Have Sent the Email - Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="form-container">
        <div className="success-message">
          <h2>🏠 Release Request Submitted</h2>
          <p>Thank you for trusting Pet Heaven with <strong>{formData.petName}</strong>.</p>
          <p>We understand this is a difficult decision. Our staff will contact you within 2-3 business days to arrange a meeting and discuss the next steps.</p>
          <p>Rest assured, we will find a loving home for your pet.</p>
          <div className="reference-info">
            <p><strong>Pet:</strong> {formData.petName} ({formData.petType})</p>
            <p><strong>Reference Email:</strong> {formData.email}</p>
            <p><strong>Submitted:</strong> {new Date().toLocaleDateString()}</p>
          </div>
          <Link to="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Pet Release Request Form</h2>
      <p className="form-intro">
        We understand that circumstances may change. Pet Heaven is here to help find a new loving home for your pet.
        Please fill out this form with as much detail as possible.
      </p>

      <form onSubmit={handleSubmit} className="release-form">
        <fieldset>
          <legend>Owner Information</legend>
          
          <div className="form-group">
            <label htmlFor="ownerName">Full Name * (from your account)</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              readOnly
              className="readonly-field"
            />
            {errors.ownerName && <span className="error">{errors.ownerName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email * (from your account)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                className="readonly-field"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number * (from your account)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                readOnly
                className="readonly-field"
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (from your account)</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              readOnly
              className="readonly-field"
              rows="2"
            />
          </div>
          
          <p className="form-note">📝 Need to update your info? <Link to="/profile">Edit your profile</Link> first.</p>
        </fieldset>

        <fieldset>
          <legend>Pet Information</legend>

          {petToRelease && (
            <div className="prefilled-note">
              📋 Releasing your adopted pet: <strong>{petToRelease.name}</strong>
              <br />
              <small>Basic info (name, type, breed, gender) is pre-filled. Please update age, health status, and personality if changed.</small>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="petName">Pet Name *{petToRelease ? ' (from your adoption)' : ''}</label>
              <input
                type="text"
                id="petName"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                placeholder="Your pet's name"
                readOnly={!!petToRelease}
                className={petToRelease ? 'readonly-field' : ''}
              />
              {errors.petName && <span className="error">{errors.petName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="petType">Pet Type *{petToRelease ? ' (from your adoption)' : ''}</label>
              <select
                id="petType"
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                disabled={!!petToRelease}
                className={petToRelease ? 'readonly-field' : ''}
              >
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="petBreed">Breed{isReleasingAdoptedPet ? ' (from adoption record)' : ''}</label>
              <input
                type="text"
                id="petBreed"
                name="petBreed"
                value={formData.petBreed}
                onChange={handleChange}
                placeholder="e.g., Persian, Golden Retriever"
                readOnly={isReleasingAdoptedPet && formData.petBreed}
                className={isReleasingAdoptedPet && formData.petBreed ? 'readonly-field' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="petAge">Age * (update if changed)</label>
              <input
                type="text"
                id="petAge"
                name="petAge"
                value={formData.petAge}
                onChange={handleChange}
                placeholder="e.g., 2 years"
              />
              {errors.petAge && <span className="error">{errors.petAge}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="petGender">Gender{isReleasingAdoptedPet ? ' (from adoption record)' : ''}</label>
              <select
                id="petGender"
                name="petGender"
                value={formData.petGender}
                onChange={handleChange}
                disabled={isReleasingAdoptedPet}
                className={isReleasingAdoptedPet ? 'readonly-field' : ''}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="isVaccinated">Vaccinated?{isReleasingAdoptedPet ? ' (update if changed)' : ''}</label>
              <select
                id="isVaccinated"
                name="isVaccinated"
                value={formData.isVaccinated}
                onChange={handleChange}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unsure">Not Sure</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="isNeutered">Neutered/Spayed?{isReleasingAdoptedPet ? ' (update if changed)' : ''}</label>
              <select
                id="isNeutered"
                name="isNeutered"
                value={formData.isNeutered}
                onChange={handleChange}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="healthCondition">Health Condition *{isReleasingAdoptedPet ? ' (current status)' : ''}</label>
            <textarea
              id="healthCondition"
              name="healthCondition"
              value={formData.healthCondition}
              onChange={handleChange}
              placeholder="Any known health issues or medical history..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="personality">Personality & Behavior{isReleasingAdoptedPet ? ' (update with current observations)' : ''}</label>
            <textarea
              id="personality"
              name="personality"
              value={formData.personality}
              onChange={handleChange}
              placeholder="Describe your pet's personality, habits, likes and dislikes..."
              rows="3"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Release Details</legend>

          <div className="form-group">
            <label htmlFor="reason">Reason for Release *</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please explain why you need to release your pet..."
              rows="4"
            />
            {errors.reason && <span className="error">{errors.reason}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="urgency">Urgency Level</label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="low">Low - No rush</option>
              <option value="normal">Normal - Within a month</option>
              <option value="high">High - Within a week</option>
              <option value="urgent">Urgent - Immediate</option>
            </select>
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
            I understand that once my pet is surrendered to Pet Heaven, I am relinquishing ownership. I confirm that all information provided is accurate. *
          </label>
          {errors.agreeTerms && <span className="error">{errors.agreeTerms}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-large">
          Submit Release Request
        </button>
      </form>
    </div>
  );
};

export default ReleaseForm;
