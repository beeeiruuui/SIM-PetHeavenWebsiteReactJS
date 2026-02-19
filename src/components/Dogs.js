import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDogs } from '../services/pet-manager';

const Dogs = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDog, setSelectedDog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSize, setFilterSize] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterAge, setFilterAge] = useState(15); // Max age in years

  // Load dogs from pet-manager.js and listen for changes
  const loadDogs = () => {
    setDogs(getAllDogs());
    setLoading(false);
  };

  useEffect(() => {
    loadDogs();
    
    // Listen for pet status changes (real-time updates)
    const handlePetChange = () => loadDogs();
    window.addEventListener('petStatusChanged', handlePetChange);
    window.addEventListener('petDataChanged', handlePetChange);
    window.addEventListener('storage', handlePetChange);
    
    return () => {
      window.removeEventListener('petStatusChanged', handlePetChange);
      window.removeEventListener('petDataChanged', handlePetChange);
      window.removeEventListener('storage', handlePetChange);
    };
  }, []);

  // Helper to parse age string to number
  const parseAge = (ageStr) => {
    if (!ageStr) return 0;
    const match = ageStr.match(/(\d+)/);
    if (!match) return 0;
    const num = parseInt(match[1]);
    if (ageStr.toLowerCase().includes('month')) return num / 12;
    return num;
  };

  const filteredDogs = dogs.filter(dog => {
    // Only show available dogs
    if (dog.status !== 'Available') return false;
    
    // Only show vaccinated dogs
    if (!dog.vaccinated) return false;
    
    const dogName = dog.name || '';
    const dogBreed = dog.breed || '';
    const matchesSearch = dogName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dogBreed.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Size filter
    const matchesSize = filterSize === 'all' || (dog.size && dog.size.toLowerCase() === filterSize.toLowerCase());
    
    // Gender filter
    const matchesGender = filterGender === 'all' || (dog.gender && dog.gender.toLowerCase() === filterGender.toLowerCase());
    
    // Age filter (slider)
    const dogAge = parseAge(dog.age);
    const matchesAge = dogAge <= filterAge;
    
    return matchesSearch && matchesSize && matchesGender && matchesAge;
  });

  const openModal = (dog) => {
    setSelectedDog(dog);
  };

  const closeModal = () => {
    setSelectedDog(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading our adorable dogs...</p>
      </div>
    );
  }

  return (
    <div className="pets-container">
      <h1>🐕 Dogs Available for Adoption</h1>
      <p className="pets-intro">
        Meet our wonderful canine companions looking for their forever homes. 
        All dogs are vaccinated, health-checked, and ready to become your best friend!
      </p>

      {/* Search and Filter */}
      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search by name or breed..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterGender} 
          onChange={(e) => setFilterGender(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select 
          value={filterSize} 
          onChange={(e) => setFilterSize(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Sizes</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      
      {/* Age Range Slider */}
      <div className="age-slider-container">
        <label className="age-slider-label">
          Max Age: <span className="age-value">{filterAge} {filterAge === 1 ? 'year' : 'years'}</span>
        </label>
        <input
          type="range"
          min="1"
          max="15"
          value={filterAge}
          onChange={(e) => setFilterAge(parseInt(e.target.value))}
          className="age-slider"
        />
        <div className="age-slider-labels">
          <span>1 yr</span>
          <span>5 yrs</span>
          <span>10 yrs</span>
          <span>15 yrs</span>
        </div>
      </div>

      {/* Results count */}
      <p className="results-count">
        Showing {filteredDogs.length} dog{filteredDogs.length !== 1 ? 's' : ''}
      </p>

      {/* Dog Cards Grid */}
      <div className="pets-grid">
        {filteredDogs.map(dog => (
          <div key={dog.id} className="pet-card">
            <div className="pet-image">
              <img src={dog.image} alt={dog.name || 'Dog'} />
              {dog.vaccinated && <span className="badge vaccinated">Vaccinated</span>}
              {dog.size && <span className={`badge size-${dog.size.toLowerCase()}`}>{dog.size}</span>}
            </div>
            <div className="pet-info">
              <h3>{dog.name || 'Unknown'}</h3>
              <p className="pet-breed">{dog.breed || 'Mixed'}</p>
              <div className="pet-details">
                <span>{dog.age || 'Unknown'}</span>
                <span>{dog.gender || 'Unknown'}</span>
                <span>{dog.color || ''}</span>
              </div>
              <p className="pet-personality">{dog.personality || ''}</p>
              <div className="pet-actions">
                <button className="btn btn-outline" onClick={() => openModal(dog)}>
                  View Details
                </button>
                <Link 
                  to="/adopt" 
                  state={{ pet: { name: dog.name, type: 'dog' } }}
                  className="btn btn-primary"
                >
                  Adopt Me
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDogs.length === 0 && (
        <div className="no-results">
          <p>No dogs found matching your criteria. Try adjusting your search.</p>
        </div>
      )}

      {/* Modal for dog details */}
      {selectedDog && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-body">
              <img src={selectedDog.image} alt={selectedDog.name} className="modal-image" />
              <div className="modal-info">
                <h2>{selectedDog.name}</h2>
                <table className="pet-details-table">
                  <tbody>
                    <tr><td><strong>Breed:</strong></td><td>{selectedDog.breed}</td></tr>
                    <tr><td><strong>Age:</strong></td><td>{selectedDog.age}</td></tr>
                    <tr><td><strong>Gender:</strong></td><td>{selectedDog.gender}</td></tr>
                    <tr><td><strong>Size:</strong></td><td>{selectedDog.size}</td></tr>
                    <tr><td><strong>Color:</strong></td><td>{selectedDog.color}</td></tr>
                    <tr><td><strong>Vaccinated:</strong></td><td>{selectedDog.vaccinated ? 'Yes ✓' : 'No'}</td></tr>
                    <tr><td><strong>Neutered/Spayed:</strong></td><td>{selectedDog.neutered ? 'Yes ✓' : 'No'}</td></tr>
                  </tbody>
                </table>
                <h3>Personality</h3>
                <p>{selectedDog.personality}</p>
                <Link 
                  to="/adopt" 
                  state={{ pet: { name: selectedDog.name, type: 'dog' } }}
                  className="btn btn-primary btn-large"
                >
                  Adopt {selectedDog.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="pets-cta">
        <h2>Can't Find Your Perfect Match?</h2>
        <p>New dogs arrive every week! Register as a member to be notified of new arrivals.</p>
        <Link to="/profile" className="btn btn-secondary">Become a Member</Link>
      </section>
    </div>
  );
};

export default Dogs;