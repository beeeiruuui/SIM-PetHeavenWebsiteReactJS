import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCats as fetchCats, getCustomCats } from '../services/cats-data';

const Cats = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSize, setFilterSize] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterAge, setFilterAge] = useState(20); // Max age in years

  // Load cats from cats-data.js and listen for changes
  const loadCats = () => {
    setCats([...fetchCats(), ...getCustomCats()]);
    setLoading(false);
  };

  useEffect(() => {
    loadCats();
    
    // Listen for pet status changes (real-time updates)
    const handlePetChange = () => loadCats();
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

  const filteredCats = cats.filter(cat => {
    // Only show available cats
    if (cat.status !== 'Available') return false;
    
    // Only show vaccinated cats
    if (!cat.vaccinated) return false;
    
    const catName = cat.name || '';
    const catBreed = cat.breed || '';
    const matchesSearch = catName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         catBreed.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Size filter
    const matchesSize = filterSize === 'all' || (cat.size && cat.size.toLowerCase() === filterSize.toLowerCase());
    
    // Gender filter
    const matchesGender = filterGender === 'all' || (cat.gender && cat.gender.toLowerCase() === filterGender.toLowerCase());
    
    // Age filter (slider)
    const catAge = parseAge(cat.age);
    const matchesAge = catAge <= filterAge;
    
    return matchesSearch && matchesSize && matchesGender && matchesAge;
  });

  const openModal = (cat) => {
    setSelectedCat(cat);
  };

  const closeModal = () => {
    setSelectedCat(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading our adorable cats...</p>
      </div>
    );
  }

  return (
    <div className="pets-container">
      <h1>🐱 Cats Available for Adoption</h1>
      <p className="pets-intro">
        Meet our wonderful feline friends looking for their forever homes. 
        All cats are vaccinated, health-checked, and ready to bring joy to your life!
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
          max="20"
          value={filterAge}
          onChange={(e) => setFilterAge(parseInt(e.target.value))}
          className="age-slider"
        />
        <div className="age-slider-labels">
          <span>1 yr</span>
          <span>5 yrs</span>
          <span>10 yrs</span>
          <span>20 yrs</span>
        </div>
      </div>

      {/* Results count */}
      <p className="results-count">
        Showing {filteredCats.length} cat{filteredCats.length !== 1 ? 's' : ''}
      </p>

      {/* Cat Cards Grid */}
      <div className="pets-grid">
        {filteredCats.map(cat => (
          <div key={cat.id} className="pet-card">
            <div className="pet-image">
              <img src={cat.image} alt={cat.name || 'Cat'} />
              {cat.vaccinated && <span className="badge vaccinated">Vaccinated</span>}
            </div>
            <div className="pet-info">
              <h3>{cat.name || 'Unknown'}</h3>
              <p className="pet-breed">{cat.breed || 'Mixed'}</p>
              <div className="pet-details">
                <span>{cat.age || 'Unknown'}</span>
                <span>{cat.gender || 'Unknown'}</span>
                <span>{cat.color || ''}</span>
              </div>
              <p className="pet-personality">{cat.personality || ''}</p>
              <div className="pet-actions">
                <button className="btn btn-outline" onClick={() => openModal(cat)}>
                  View Details
                </button>
                <Link 
                  to="/adopt" 
                  state={{ pet: { name: cat.name, type: 'cat' } }}
                  className="btn btn-primary"
                >
                  Adopt Me
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCats.length === 0 && (
        <div className="no-results">
          <p>No cats found matching your criteria. Try adjusting your search.</p>
        </div>
      )}

      {/* Modal for cat details */}
      {selectedCat && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-body">
              <img src={selectedCat.image} alt={selectedCat.name} className="modal-image" />
              <div className="modal-info">
                <h2>{selectedCat.name}</h2>
                <table className="pet-details-table">
                  <tbody>
                    <tr><td><strong>Breed:</strong></td><td>{selectedCat.breed}</td></tr>
                    <tr><td><strong>Age:</strong></td><td>{selectedCat.age}</td></tr>
                    <tr><td><strong>Gender:</strong></td><td>{selectedCat.gender}</td></tr>
                    <tr><td><strong>Color:</strong></td><td>{selectedCat.color}</td></tr>
                    <tr><td><strong>Vaccinated:</strong></td><td>{selectedCat.vaccinated ? 'Yes ✓' : 'No'}</td></tr>
                    <tr><td><strong>Neutered/Spayed:</strong></td><td>{selectedCat.neutered ? 'Yes ✓' : 'No'}</td></tr>
                  </tbody>
                </table>
                <h3>Personality</h3>
                <p>{selectedCat.personality}</p>
                <Link 
                  to="/adopt" 
                  state={{ pet: { name: selectedCat.name, type: 'cat' } }}
                  className="btn btn-primary btn-large"
                >
                  Adopt {selectedCat.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="pets-cta">
        <h2>Can't Find Your Perfect Match?</h2>
        <p>New cats arrive every week! Register as a member to be notified of new arrivals.</p>
        <Link to="/profile" className="btn btn-secondary">Become a Member</Link>
      </section>
    </div>
  );
};

export default Cats;