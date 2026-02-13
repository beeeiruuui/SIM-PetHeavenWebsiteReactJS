import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { isLoggedIn, user, isAdmin, logout, users } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  // Redirect if not logged in or not admin
  if (!isLoggedIn || !isAdmin()) {
    return <Navigate to="/auth" replace />;
  }

  // Sample data for demonstration
  const stats = {
    totalPets: 45,
    adoptedPets: 32,
    pendingAdoptions: 8,
    totalMembers: users ? users.filter(u => u.role === 'user').length : 0,
    pendingReleases: 5
  };

  const recentAdoptions = [
    { id: 1, petName: 'Whiskers', petType: 'Cat', adopter: 'John Doe', date: '2026-02-12', status: 'Approved' },
    { id: 2, petName: 'Max', petType: 'Dog', adopter: 'Jane Smith', date: '2026-02-11', status: 'Pending' },
    { id: 3, petName: 'Luna', petType: 'Cat', adopter: 'Bob Wilson', date: '2026-02-10', status: 'Approved' },
    { id: 4, petName: 'Buddy', petType: 'Dog', adopter: 'Alice Brown', date: '2026-02-09', status: 'Pending' },
  ];

  const recentReleases = [
    { id: 1, petName: 'Mittens', petType: 'Cat', owner: 'Mike Johnson', date: '2026-02-12', reason: 'Moving abroad' },
    { id: 2, petName: 'Rocky', petType: 'Dog', owner: 'Sarah Lee', date: '2026-02-11', reason: 'Allergies' },
  ];

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
                    {recentAdoptions.slice(0, 3).map(adoption => (
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
                    {recentReleases.map(release => (
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
                  {recentAdoptions.map(adoption => (
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
                        <button className="btn-small btn-approve">Approve</button>
                        <button className="btn-small btn-reject">Reject</button>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReleases.map(release => (
                    <tr key={release.id}>
                      <td>#{release.id}</td>
                      <td>{release.petName}</td>
                      <td>{release.petType}</td>
                      <td>{release.owner}</td>
                      <td>{release.date}</td>
                      <td>{release.reason}</td>
                      <td>
                        <button className="btn-small btn-approve">Accept</button>
                        <button className="btn-small btn-view">Contact</button>
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
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.map((member, index) => (
                    <tr key={index}>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>
                        <span className={`role-badge ${member.role}`}>
                          {member.role}
                        </span>
                      </td>
                      <td>
                        <button className="btn-small btn-view">View</button>
                        <button className="btn-small btn-edit">Edit</button>
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
              <button className="btn btn-primary">+ Add New Pet</button>
            </div>
            <div className="admin-card full-width">
              <p className="placeholder-text">
                Pet management features coming soon. This section will allow you to add, edit, and remove pets from the system.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
