import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dogs = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDog, setSelectedDog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSize, setFilterSize] = useState('all');

  // Sample dog data - in a real app, this would come from an API
  const sampleDogs = [
    {
      id: 1,
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: '3 years',
      gender: 'Male',
      size: 'Large',
      color: 'Golden',
      personality: 'Friendly and loyal, great with families and children',
      vaccinated: true,
      neutered: true,
      image: 'https://placedog.net/300/300?id=1'
    },
    {
      id: 2,
      name: 'Bella',
      breed: 'Labrador Retriever',
      age: '2 years',
      gender: 'Female',
      size: 'Large',
      color: 'Chocolate',
      personality: 'Energetic and playful, loves outdoor activities',
      vaccinated: true,
      neutered: true,
      image: 'https://placedog.net/301/300?id=2'
    },
    {
      id: 3,
      name: 'Max',
      breed: 'German Shepherd',
      age: '4 years',
      gender: 'Male',
      size: 'Large',
      color: 'Black and Tan',
      personality: 'Intelligent and protective, excellent guard dog',
      vaccinated: true,
      neutered: true,
      image: 'https://placedog.net/302/300?id=3'
    },
    {
      id: 4,
      name: 'Coco',
      breed: 'Poodle',
      age: '1 year',
      gender: 'Female',
      size: 'Medium',
      color: 'White',
      personality: 'Smart and elegant, hypoallergenic coat',
      vaccinated: true,
      neutered: false,
      image: 'https://placedog.net/303/300?id=4'
    },
    {
      id: 5,
      name: 'Rocky',
      breed: 'Bulldog',
      age: '5 years',
      gender: 'Male',
      size: 'Medium',
      color: 'Brindle',
      personality: 'Calm and courageous, good for apartment living',
      vaccinated: true,
      neutered: true,
      image: 'https://placedog.net/304/300?id=5'
    },
    {
      id: 6,
      name: 'Daisy',
      breed: 'Shih Tzu',
      age: '2 years',
      gender: 'Female',
      size: 'Small',
      color: 'Brown and White',
      personality: 'Affectionate lap dog, great companion',
      vaccinated: true,
      neutered: true,
      image: 'https://placedog.net/305/300?id=6'
    },
    {
      id: 7,
      name: 'Charlie',
      breed: 'Beagle',
      age: '3 years',
      gender: 'Male',
      size: 'Medium',
      color: 'Tricolor',
      personality: 'Curious and merry, loves to explore',
      vaccinated: true,
      neutered: true,
      image: 'https://placedog.net/306/300?id=7'
    },
    {
      id: 8,
      name: 'Milo',
      breed: 'Corgi',
      age: '1 year',
      gender: 'Male',
      size: 'Small',
      color: 'Red and White',
      personality: 'Playful and outgoing, loves attention',
      vaccinated: true,
      neutered: false,
      image: 'https://placedog.net/307/300?id=8'
    }
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDogs(sampleDogs);
      setLoading(false);
    }, 500);
  }, []);

  const filteredDogs = dogs.filter(dog => {
    const matchesSearch = dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dog.breed.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterSize === 'all') return matchesSearch;
    return matchesSearch && dog.size.toLowerCase() === filterSize.toLowerCase();
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

      {/* Results count */}
      <p className="results-count">
        Showing {filteredDogs.length} dog{filteredDogs.length !== 1 ? 's' : ''}
      </p>

      {/* Dog Cards Grid */}
      <div className="pets-grid">
        {filteredDogs.map(dog => (
          <div key={dog.id} className="pet-card">
            <div className="pet-image">
              <img src={dog.image} alt={dog.name} />
              {dog.vaccinated && <span className="badge vaccinated">Vaccinated</span>}
              <span className={`badge size-${dog.size.toLowerCase()}`}>{dog.size}</span>
            </div>
            <div className="pet-info">
              <h3>{dog.name}</h3>
              <p className="pet-breed">{dog.breed}</p>
              <div className="pet-details">
                <span>{dog.age}</span>
                <span>{dog.gender}</span>
                <span>{dog.color}</span>
              </div>
              <p className="pet-personality">{dog.personality}</p>
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
                    <tr><td><strong>Neutered:</strong></td><td>{selectedDog.neutered ? 'Yes ✓' : 'No'}</td></tr>
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