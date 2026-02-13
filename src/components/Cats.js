import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cats = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAge, setFilterAge] = useState('all');

  // Sample cat data - in a real app, this would come from an API
  const sampleCats = [
    {
      id: 1,
      name: 'Whiskers',
      breed: 'Persian',
      age: '2 years',
      gender: 'Male',
      color: 'White',
      personality: 'Calm and affectionate, loves to cuddle',
      vaccinated: true,
      neutered: true,
      image: 'https://placekitten.com/300/300'
    },
    {
      id: 2,
      name: 'Luna',
      breed: 'Siamese',
      age: '1 year',
      gender: 'Female',
      color: 'Cream with brown points',
      personality: 'Playful and vocal, loves attention',
      vaccinated: true,
      neutered: true,
      image: 'https://placekitten.com/301/300'
    },
    {
      id: 3,
      name: 'Oliver',
      breed: 'British Shorthair',
      age: '3 years',
      gender: 'Male',
      color: 'Grey',
      personality: 'Gentle giant, great with children',
      vaccinated: true,
      neutered: true,
      image: 'https://placekitten.com/302/300'
    },
    {
      id: 4,
      name: 'Mochi',
      breed: 'Scottish Fold',
      age: '6 months',
      gender: 'Female',
      color: 'Tabby',
      personality: 'Curious and energetic, loves to play',
      vaccinated: true,
      neutered: false,
      image: 'https://placekitten.com/303/300'
    },
    {
      id: 5,
      name: 'Shadow',
      breed: 'Domestic Shorthair',
      age: '4 years',
      gender: 'Male',
      color: 'Black',
      personality: 'Independent but loyal, perfect for quiet homes',
      vaccinated: true,
      neutered: true,
      image: 'https://placekitten.com/304/300'
    },
    {
      id: 6,
      name: 'Ginger',
      breed: 'Maine Coon',
      age: '2 years',
      gender: 'Female',
      color: 'Orange Tabby',
      personality: 'Friendly and sociable, gets along with other pets',
      vaccinated: true,
      neutered: true,
      image: 'https://placekitten.com/305/300'
    }
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCats(sampleCats);
      setLoading(false);
    }, 500);
  }, []);

  const filteredCats = cats.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cat.breed.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterAge === 'all') return matchesSearch;
    if (filterAge === 'kitten') return matchesSearch && cat.age.includes('month');
    if (filterAge === 'adult') return matchesSearch && cat.age.includes('year');
    return matchesSearch;
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
          value={filterAge} 
          onChange={(e) => setFilterAge(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Ages</option>
          <option value="kitten">Kittens (Under 1 year)</option>
          <option value="adult">Adults (1+ years)</option>
        </select>
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
              <img src={cat.image} alt={cat.name} />
              {cat.vaccinated && <span className="badge vaccinated">Vaccinated</span>}
            </div>
            <div className="pet-info">
              <h3>{cat.name}</h3>
              <p className="pet-breed">{cat.breed}</p>
              <div className="pet-details">
                <span>{cat.age}</span>
                <span>{cat.gender}</span>
                <span>{cat.color}</span>
              </div>
              <p className="pet-personality">{cat.personality}</p>
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
                    <tr><td><strong>Neutered:</strong></td><td>{selectedCat.neutered ? 'Yes ✓' : 'No'}</td></tr>
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