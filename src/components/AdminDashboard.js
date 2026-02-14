import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { isLoggedIn, user, isAdmin, logout, users } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  
  // Pet management state
  const [pets, setPets] = useState([
    { id: 1, name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', age: '3 years', gender: 'Male', status: 'Available', vaccinated: true, neutered: true },
    { id: 2, name: 'Whiskers', type: 'Cat', breed: 'Persian', age: '2 years', gender: 'Male', status: 'Available', vaccinated: true, neutered: true },
    { id: 3, name: 'Bella', type: 'Dog', breed: 'Labrador Retriever', age: '2 years', gender: 'Female', status: 'Adopted', vaccinated: true, neutered: true },
    { id: 4, name: 'Luna', type: 'Cat', breed: 'Siamese', age: '1 year', gender: 'Female', status: 'Available', vaccinated: true, neutered: true },
    { id: 5, name: 'Max', type: 'Dog', breed: 'German Shepherd', age: '4 years', gender: 'Male', status: 'Pending', vaccinated: true, neutered: true },
    { id: 6, name: 'Oliver', type: 'Cat', breed: 'British Shorthair', age: '3 years', gender: 'Male', status: 'Available', vaccinated: true, neutered: true },
    { id: 7, name: 'Coco', type: 'Dog', breed: 'Poodle', age: '1 year', gender: 'Female', status: 'Available', vaccinated: true, neutered: false },
    { id: 8, name: 'Mochi', type: 'Cat', breed: 'Scottish Fold', age: '6 months', gender: 'Female', status: 'Pending', vaccinated: true, neutered: false },
  ]);
  
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [petForm, setPetForm] = useState({
    name: '', type: 'Dog', breed: '', age: '', gender: 'Male', status: 'Available', vaccinated: false, neutered: false
  });
  const [petFilter, setPetFilter] = useState('all');
  const [petSearch, setPetSearch] = useState('');
  
  // Member view modal state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Adoption management state
  const [adoptions, setAdoptions] = useState([
    { id: 1, petName: 'Whiskers', petType: 'Cat', adopter: 'John Doe', email: 'john@email.com', date: '2026-02-12', status: 'Pending' },
    { id: 2, petName: 'Max', petType: 'Dog', adopter: 'Jane Smith', email: 'jane@email.com', date: '2026-02-11', status: 'Pending' },
    { id: 3, petName: 'Luna', petType: 'Cat', adopter: 'Bob Wilson', email: 'bob@email.com', date: '2026-02-10', status: 'Approved' },
    { id: 4, petName: 'Buddy', petType: 'Dog', adopter: 'Alice Brown', email: 'alice@email.com', date: '2026-02-09', status: 'Pending' },
  ]);
  
  // Release management state
  const [releases, setReleases] = useState([
    { id: 1, petName: 'Mittens', petType: 'Cat', owner: 'Mike Johnson', email: 'mike@email.com', phone: '9123-4567', date: '2026-02-12', reason: 'Moving abroad', status: 'Pending' },
    { id: 2, petName: 'Rocky', petType: 'Dog', owner: 'Sarah Lee', email: 'sarah@email.com', phone: '9234-5678', date: '2026-02-11', reason: 'Allergies', status: 'Pending' },
  ]);

  // Redirect if not logged in or not admin
  if (!isLoggedIn || !isAdmin()) {
    return <Navigate to="/auth" replace />;
  }

  // Dynamic stats based on actual data
  const stats = {
    totalPets: pets.length,
    adoptedPets: pets.filter(p => p.status === 'Adopted').length,
    pendingAdoptions: adoptions.filter(a => a.status === 'Pending').length,
    totalMembers: users ? users.filter(u => u.role === 'user').length : 0,
    pendingReleases: releases.filter(r => r.status === 'Pending').length
  };

  // Pet management functions
  const handleOpenPetModal = (pet = null) => {
    if (pet) {
      setEditingPet(pet);
      setPetForm(pet);
    } else {
      setEditingPet(null);
      setPetForm({ name: '', type: 'Dog', breed: '', age: '', gender: 'Male', status: 'Available', vaccinated: false, neutered: false });
    }
    setShowPetModal(true);
  };

  const handleClosePetModal = () => {
    setShowPetModal(false);
    setEditingPet(null);
    setPetForm({ name: '', type: 'Dog', breed: '', age: '', gender: 'Male', status: 'Available', vaccinated: false, neutered: false });
  };

  const handlePetFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPetForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSavePet = (e) => {
    e.preventDefault();
    if (editingPet) {
      setPets(prev => prev.map(p => p.id === editingPet.id ? { ...petForm, id: editingPet.id } : p));
    } else {
      const newId = Math.max(...pets.map(p => p.id), 0) + 1;
      setPets(prev => [...prev, { ...petForm, id: newId }]);
    }
    handleClosePetModal();
  };

  const handleDeletePet = (id) => {
    if (window.confirm('Are you sure you want to remove this pet from the system?')) {
      setPets(prev => prev.filter(p => p.id !== id));
    }
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(petSearch.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(petSearch.toLowerCase());
    const matchesFilter = petFilter === 'all' || pet.type.toLowerCase() === petFilter || pet.status.toLowerCase() === petFilter;
    return matchesSearch && matchesFilter;
  });

  // Adoption management functions
  const handleApproveAdoption = (id) => {
    setAdoptions(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
  };

  const handleRejectAdoption = (id) => {
    setAdoptions(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
  };

  // Release management functions
  const handleAcceptRelease = (id) => {
    setReleases(prev => prev.map(r => r.id === id ? { ...r, status: 'Accepted' } : r));
  };

  const handleRejectRelease = (id) => {
    setReleases(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
  };

  // Member management functions
  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  const handleCloseMemberModal = () => {
    setShowMemberModal(false);
    setSelectedMember(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-profile">
          <div className="admin-avatar">👨‍💼</div>
          <h3>{user?.name}</h3>
          <span className="role-badge admin">Administrator</span>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`admin-nav-item ${activeSection === 'adoptions' ? 'active' : ''}`}
            onClick={() => setActiveSection('adoptions')}
          >
            🏠 Adoptions
          </button>
          <button 
            className={`admin-nav-item ${activeSection === 'releases' ? 'active' : ''}`}
            onClick={() => setActiveSection('releases')}
          >
            📋 Releases
          </button>
          <button 
            className={`admin-nav-item ${activeSection === 'members' ? 'active' : ''}`}
            onClick={() => setActiveSection('members')}
          >
            👥 Members
          </button>
          <button 
            className={`admin-nav-item ${activeSection === 'pets' ? 'active' : ''}`}
            onClick={() => setActiveSection('pets')}
          >
            🐾 Pets
          </button>
        </nav>

        <button className="btn btn-secondary admin-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      <div className="admin-main">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </header>

        {activeSection === 'overview' && (
          <div className="admin-section">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">🐾</span>
                <div className="stat-info">
                  <h3>{stats.totalPets}</h3>
                  <p>Total Pets</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🏠</span>
                <div className="stat-info">
                  <h3>{stats.adoptedPets}</h3>
                  <p>Adopted</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⏳</span>
                <div className="stat-info">
                  <h3>{stats.pendingAdoptions}</h3>
                  <p>Pending Adoptions</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div className="stat-info">
                  <h3>{stats.totalMembers}</h3>
                  <p>Members</p>
                </div>
              </div>
            </div>

            <div className="admin-cards">
              <div className="admin-card">
                <h3>Recent Adoption Requests</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Pet</th>
                      <th>Type</th>
                      <th>Adopter</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adoptions.slice(0, 3).map(adoption => (
                      <tr key={adoption.id}>
                        <td>{adoption.petName}</td>
                        <td>{adoption.petType}</td>
                        <td>{adoption.adopter}</td>
                        <td>
                          <span className={`status-badge ${adoption.status.toLowerCase()}`}>
                            {adoption.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-card">
                <h3>Recent Release Requests</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Pet</th>
                      <th>Type</th>
                      <th>Owner</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {releases.slice(0, 3).map(release => (
                      <tr key={release.id}>
                        <td>{release.petName}</td>
                        <td>{release.petType}</td>
                        <td>{release.owner}</td>
                        <td>{release.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'adoptions' && (
          <div className="admin-section">
            <h2>Adoption Requests</h2>
            <div className="admin-card full-width">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Pet Name</th>
                    <th>Type</th>
                    <th>Adopter</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adoptions.map(adoption => (
                    <tr key={adoption.id}>
                      <td>#{adoption.id}</td>
                      <td>{adoption.petName}</td>
                      <td>{adoption.petType}</td>
                      <td>{adoption.adopter}</td>
                      <td>{adoption.date}</td>
                      <td>
                        <span className={`status-badge ${adoption.status.toLowerCase()}`}>
                          {adoption.status}
                        </span>
                      </td>
                      <td>
                        {adoption.status === 'Pending' ? (
                          <>
                            <button className="btn-small btn-approve" onClick={() => handleApproveAdoption(adoption.id)}>Approve</button>
                            <button className="btn-small btn-reject" onClick={() => handleRejectAdoption(adoption.id)}>Reject</button>
                          </>
                        ) : (
                          <span className="action-done">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'releases' && (
          <div className="admin-section">
            <h2>Release Requests</h2>
            <div className="admin-card full-width">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Pet Name</th>
                    <th>Type</th>
                    <th>Owner</th>
                    <th>Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {releases.map(release => (
                    <tr key={release.id}>
                      <td>#{release.id}</td>
                      <td>{release.petName}</td>
                      <td>{release.petType}</td>
                      <td>{release.owner}</td>
                      <td>{release.date}</td>
                      <td>{release.reason}</td>
                      <td>
                        <span className={`status-badge ${release.status.toLowerCase()}`}>
                          {release.status}
                        </span>
                      </td>
                      <td>
                        {release.status === 'Pending' ? (
                          <>
                            <button className="btn-small btn-approve" onClick={() => handleAcceptRelease(release.id)}>Accept</button>
                            <button className="btn-small btn-reject" onClick={() => handleRejectRelease(release.id)}>Reject</button>
                          </>
                        ) : (
                          <span className="action-done">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'members' && (
          <div className="admin-section">
            <h2>Registered Members</h2>
            <div className="admin-card full-width">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.map((member, index) => (
                    <tr key={index}>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>{member.phone || 'N/A'}</td>
                      <td>
                        <span className={`role-badge ${member.role}`}>
                          {member.role}
                        </span>
                      </td>
                      <td>
                        <button className="btn-small btn-view" onClick={() => handleViewMember(member)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'pets' && (
          <div className="admin-section">
            <h2>Pet Management</h2>
            <div className="admin-actions-bar">
              <button className="btn btn-primary" onClick={() => handleOpenPetModal()}>+ Add New Pet</button>
              <div className="admin-filters">
                <input
                  type="text"
                  placeholder="Search pets..."
                  value={petSearch}
                  onChange={(e) => setPetSearch(e.target.value)}
                  className="search-input"
                />
                <select value={petFilter} onChange={(e) => setPetFilter(e.target.value)} className="filter-select">
                  <option value="all">All Pets</option>
                  <option value="dog">Dogs Only</option>
                  <option value="cat">Cats Only</option>
                  <option value="available">Available</option>
                  <option value="adopted">Adopted</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="admin-card full-width">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Breed</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Vaccinated</th>
                    <th>Neutered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPets.map(pet => (
                    <tr key={pet.id}>
                      <td>#{pet.id}</td>
                      <td>{pet.name}</td>
                      <td>
                        <span className="pet-type-badge">{pet.type === 'Dog' ? '🐕' : '🐈'} {pet.type}</span>
                      </td>
                      <td>{pet.breed}</td>
                      <td>{pet.age}</td>
                      <td>{pet.gender}</td>
                      <td>
                        <span className={`status-badge ${pet.status.toLowerCase()}`}>
                          {pet.status}
                        </span>
                      </td>
                      <td>{pet.vaccinated ? '✅' : '❌'}</td>
                      <td>{pet.neutered ? '✅' : '❌'}</td>
                      <td>
                        <button className="btn-small btn-edit" onClick={() => handleOpenPetModal(pet)}>Edit</button>
                        <button className="btn-small btn-reject" onClick={() => handleDeletePet(pet.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPets.length === 0 && (
                <p className="no-results">No pets found matching your criteria.</p>
              )}
            </div>
          </div>
        )}

        {/* Pet Modal */}
        {showPetModal && (
          <div className="modal-overlay" onClick={handleClosePetModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={handleClosePetModal}>×</button>
              <h2>{editingPet ? 'Edit Pet' : 'Add New Pet'}</h2>
              <form onSubmit={handleSavePet}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Pet Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={petForm.name}
                      onChange={handlePetFormChange}
                      placeholder="Enter pet name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type *</label>
                    <select name="type" value={petForm.type} onChange={handlePetFormChange} required>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Breed *</label>
                    <input
                      type="text"
                      name="breed"
                      value={petForm.breed}
                      onChange={handlePetFormChange}
                      placeholder="Enter breed"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Age *</label>
                    <input
                      type="text"
                      name="age"
                      value={petForm.age}
                      onChange={handlePetFormChange}
                      placeholder="e.g., 2 years"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender *</label>
                    <select name="gender" value={petForm.gender} onChange={handlePetFormChange} required>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status *</label>
                    <select name="status" value={petForm.status} onChange={handlePetFormChange} required>
                      <option value="Available">Available</option>
                      <option value="Pending">Pending</option>
                      <option value="Adopted">Adopted</option>
                    </select>
                  </div>
                </div>
                <div className="form-row checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="vaccinated"
                      checked={petForm.vaccinated}
                      onChange={handlePetFormChange}
                    />
                    Vaccinated
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="neutered"
                      checked={petForm.neutered}
                      onChange={handlePetFormChange}
                    />
                    Neutered/Spayed
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleClosePetModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingPet ? 'Save Changes' : 'Add Pet'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Member View Modal */}
        {showMemberModal && selectedMember && (
          <div className="modal-overlay" onClick={handleCloseMemberModal}>
            <div className="modal-content member-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={handleCloseMemberModal}>×</button>
              <h2>Member Details</h2>
              <div className="member-details">
                <div className="member-avatar-large">
                  {selectedMember.role === 'admin' ? '👨‍💼' : '👤'}
                </div>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedMember.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedMember.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedMember.phone || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{selectedMember.address || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Role:</span>
                  <span className={`role-badge ${selectedMember.role}`}>{selectedMember.role}</span>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={handleCloseMemberModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
