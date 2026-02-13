import React, { useState } from 'react';

const ReleaseForm = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    petName: '',
    petType: 'cat',
    petBreed: '',
    petAge: '',
    petGender: 'male',
    isVaccinated: 'yes',
    isNeutered: 'no',
    healthCondition: '',
    personality: '',
    reason: '',
    urgency: 'normal',
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
      console.log('Release form submitted:', formData);
      setSubmitted(true);
    }
  };

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
          <a href="/" className="btn btn-primary">Return to Home</a>
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
            <label htmlFor="ownerName">Full Name *</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.ownerName && <span className="error">{errors.ownerName}</span>}
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
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              rows="2"
            />
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
                placeholder="Your pet's name"
              />
              {errors.petName && <span className="error">{errors.petName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="petType">Pet Type *</label>
              <select
                id="petType"
                name="petType"
                value={formData.petType}
                onChange={handleChange}
              >
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="petBreed">Breed</label>
              <input
                type="text"
                id="petBreed"
                name="petBreed"
                value={formData.petBreed}
                onChange={handleChange}
                placeholder="e.g., Persian, Golden Retriever"
              />
            </div>

            <div className="form-group">
              <label htmlFor="petAge">Age *</label>
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
              <label htmlFor="petGender">Gender</label>
              <select
                id="petGender"
                name="petGender"
                value={formData.petGender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="isVaccinated">Vaccinated?</label>
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
              <label htmlFor="isNeutered">Neutered/Spayed?</label>
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
            <label htmlFor="healthCondition">Health Condition</label>
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
            <label htmlFor="personality">Personality & Behavior</label>
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
