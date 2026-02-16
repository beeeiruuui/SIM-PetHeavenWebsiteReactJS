import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/unified-auth';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { getCats, getCustomCats } from '../services/cats-data';
import { getDogs, getCustomDogs } from '../services/dogs-data';

const Profile = () => {
  const { isLoggedIn, user, login, register, logout, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('mypets');
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all', 'active', 'completed'
  const [adoptionHistory, setAdoptionHistory] = useState([]);
  const [releaseHistory, setReleaseHistory] = useState([]);
  const [cancelledRequests, setCancelledRequests] = useState([]);
  const [myPets, setMyPets] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');

  // Navigate to release form with pet data
  const handleReleasePet = (pet) => {
    // Try to find the original pet data to get breed, gender, etc.
    const allCats = [...getCats(), ...getCustomCats()];
    const allDogs = [...getDogs(), ...getCustomDogs()];
    const allPets = [...allCats, ...allDogs];
    
    const originalPet = allPets.find(p => 
      p.name && p.name.toLowerCase() === pet.petName.toLowerCase()
    );
    
    navigate('/release', { 
      state: { 
        petToRelease: {
          name: pet.petName,
          type: pet.petType,
          breed: originalPet?.breed || '',
          gender: originalPet?.gender || '',
          age: originalPet?.age || '',
          vaccinated: originalPet?.vaccinated ? 'yes' : 'no',
          neutered: originalPet?.neutered ? 'yes' : 'no',
          personality: originalPet?.personality || '',
          adoptedDate: pet.completedDate
        }
      }
    });
  };

  // Cancel a pending request
  const handleCancelRequest = (requestId, type) => {
    const confirm = window.confirm('Are you sure you want to cancel this request?');
    if (!confirm) return;

    const storageKey = type === 'adoption' ? 'adoptionRequests' : 'releaseRequests';
    const allRequests = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const updatedRequests = allRequests.map(req => 
      req.id === requestId ? { ...req, status: 'Cancelled', cancelledDate: new Date().toISOString() } : req
    );
    
    localStorage.setItem(storageKey, JSON.stringify(updatedRequests));
    
    // Update local state
    if (type === 'adoption') {
      setAdoptionHistory(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'Cancelled', cancelledDate: new Date().toISOString() } : req
      ));
    } else {
      setReleaseHistory(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'Cancelled', cancelledDate: new Date().toISOString() } : req
      ));
    }
    
    setMessage('Request cancelled successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  // Load user's history from localStorage
  useEffect(() => {
    if (isLoggedIn && user) {
      const allAdoptions = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
      const allReleases = JSON.parse(localStorage.getItem('releaseRequests') || '[]');
      
      // Filter by user's email
      const userAdoptions = allAdoptions.filter(req => req.email === user.email);
      const userReleases = allReleases.filter(req => req.email === user.email);
      
      // Separate cancelled requests
      const cancelledAdoptions = userAdoptions.filter(req => req.status === 'Cancelled').map(req => ({ ...req, requestType: 'adoption' }));
      const cancelledReleases = userReleases.filter(req => req.status === 'Cancelled').map(req => ({ ...req, requestType: 'release' }));
      const allCancelled = [...cancelledAdoptions, ...cancelledReleases].sort((a, b) => 
        new Date(b.cancelledDate || b.submittedDate) - new Date(a.cancelledDate || a.submittedDate)
      );
      setCancelledRequests(allCancelled);
      
      // Filter out cancelled from main lists
      setAdoptionHistory(userAdoptions.filter(req => req.status !== 'Cancelled'));
      setReleaseHistory(userReleases.filter(req => req.status !== 'Cancelled'));
      
      // Calculate "My Pets" - completed adoptions that haven't been released
      const completedAdoptions = userAdoptions.filter(a => a.status === 'Completed');
      const releasedPetNames = userReleases
        .filter(r => r.status === 'Completed' || r.status === 'Accepted' || r.status === 'Pending')
        .map(r => r.petName.toLowerCase());
      
      const currentPets = completedAdoptions.filter(
        a => !releasedPetNames.includes(a.petName.toLowerCase())
      );
      setMyPets(currentPets);
    }
  }, [isLoggedIn, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login - in real app, this would call an API
    if (formData.email && formData.password) {
      login({
        name: 'Pet Lover',
        email: formData.email,
        phone: '123-456-7890',
        address: '123 Pet Street, Singapore',
        memberSince: '2026'
      });
      setMessage('Login successful! Welcome back.');
    } else {
      setMessage('Please enter email and password.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.email && formData.password && formData.name) {
      register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        memberSince: '2026'
      });
      setMessage('Registration successful! Welcome to Pet Heaven.');
    } else {
      setMessage('Please fill in all required fields.');
    }
  };

  const handleLogout = () => {
    logout();
    setFormData({ email: '', password: '', name: '', phone: '', address: '' });
    navigate('/');
  };

  const handleEditClick = () => {
    setEditFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editFormData.name.trim()) {
      setMessage('Name is required.');
      return;
    }
    
    const result = updateProfile(editFormData);
    setMessage(result.message);
    if (result.success) {
      setIsEditing(false);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({ name: '', phone: '', address: '' });
  };

  // ========== DELETE ACCOUNT FUNCTIONS ==========
  const handleShowDeleteModal = () => {
    // Check for active requests
    const activeAdoptions = adoptionHistory.filter(a => a.status === 'Pending' || a.status === 'Approved');
    const activeReleases = releaseHistory.filter(r => r.status === 'Pending' || r.status === 'Accepted');
    
    if (activeAdoptions.length > 0 || activeReleases.length > 0) {
      setMessage(`You have ${activeAdoptions.length + activeReleases.length} active request(s). Please complete or cancel them before deleting your account.`);
      setTimeout(() => setMessage(''), 5000);
      return;
    }
    
    setShowDeleteModal(true);
    setDeleteConfirmEmail('');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmEmail.toLowerCase() !== user.email.toLowerCase()) {
      setMessage('Email does not match. Please enter your email correctly.');
      return;
    }
    
    // Clear user's adoption and release requests
    const allAdoptions = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
    const allReleases = JSON.parse(localStorage.getItem('releaseRequests') || '[]');
    const filteredAdoptions = allAdoptions.filter(a => a.email !== user.email);
    const filteredReleases = allReleases.filter(r => r.email !== user.email);
    localStorage.setItem('adoptionRequests', JSON.stringify(filteredAdoptions));
    localStorage.setItem('releaseRequests', JSON.stringify(filteredReleases));
    
    // Delete the account
    if (deleteAccount) {
      deleteAccount(user.email);
    }
    
    setShowDeleteModal(false);
    logout();
    navigate('/');
    alert('Your account has been successfully deleted. We\'re sorry to see you go!\\n\\nThank you for using Pet Heaven.');
  };

  // ========== EXPORT HISTORY PDF FUNCTION ==========
  const exportHistoryPDF = () => {
    const today = new Date();
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pet Heaven - My History Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-bottom: 3px solid #ff9a9e; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #1a1a2e; margin: 0; }
          .header p { color: #666; }
          .customer-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
          .summary { display: flex; justify-content: space-around; background: linear-gradient(135deg, #ff9a9e, #fecfef); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .summary-item { text-align: center; }
          .summary-item h3 { margin: 0; font-size: 2em; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #1a1a2e; border-bottom: 2px solid #ff9a9e; padding-bottom: 8px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background: #1a1a2e; color: white; }
          tr:nth-child(even) { background: #f8f9fa; }
          .status-pending { color: #f39c12; font-weight: bold; }
          .status-approved, .status-accepted { color: #27ae60; font-weight: bold; }
          .status-completed { color: #3498db; font-weight: bold; }
          .status-rejected, .status-cancelled { color: #e74c3c; font-weight: bold; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 0.9em; }
          .no-print { text-align: center; margin-top: 30px; }
          @media print { body { padding: 20px; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🐾 Pet Heaven</h1>
          <p>My Activity History Report</p>
          <p>Generated: ${today.toLocaleString()}</p>
        </div>
        
        <div class="customer-info">
          <strong>Member:</strong> ${user.name}<br>
          <strong>Email:</strong> ${user.email}<br>
          <strong>Member Since:</strong> ${user.memberSince || 'N/A'}
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <h3>${myPets.length}</h3>
            <p>My Pets</p>
          </div>
          <div class="summary-item">
            <h3>${adoptionHistory.length}</h3>
            <p>Adoption Requests</p>
          </div>
          <div class="summary-item">
            <h3>${releaseHistory.length}</h3>
            <p>Release Requests</p>
          </div>
        </div>
        
        ${myPets.length > 0 ? `
        <div class="section">
          <h2>🐾 My Current Pets</h2>
          <table>
            <thead><tr><th>Pet Name</th><th>Type</th><th>Adopted On</th></tr></thead>
            <tbody>
              ${myPets.map(pet => `
                <tr>
                  <td>${pet.petName}</td>
                  <td>${pet.petType || 'N/A'}</td>
                  <td>${pet.completedDate ? new Date(pet.completedDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}
        
        ${adoptionHistory.length > 0 ? `
        <div class="section">
          <h2>🏠 Adoption History</h2>
          <table>
            <thead><tr><th>ID</th><th>Pet</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              ${adoptionHistory.map(a => `
                <tr>
                  <td>#${a.id}</td>
                  <td>${a.petName}</td>
                  <td>${new Date(a.submittedDate).toLocaleDateString()}</td>
                  <td class="status-${a.status.toLowerCase()}">${a.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}
        
        ${releaseHistory.length > 0 ? `
        <div class="section">
          <h2>📋 Release History</h2>
          <table>
            <thead><tr><th>ID</th><th>Pet</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              ${releaseHistory.map(r => `
                <tr>
                  <td>#${r.id}</td>
                  <td>${r.petName}</td>
                  <td>${new Date(r.submittedDate).toLocaleDateString()}</td>
                  <td class="status-${r.status.toLowerCase()}">${r.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}
        
        <div class="footer">
          <p>Thank you for being part of Pet Heaven! 🐾</p>
          <p>Together, we find forever homes for our furry friends.</p>
        </div>
        
        <div class="no-print">
          <button onclick="window.print()" style="padding: 15px 30px; background: #ff9a9e; color: white; border: none; border-radius: 8px; font-size: 1.1em; cursor: pointer;">
            🖨️ Print / Save as PDF
          </button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter history based on filter selection
  const getFilteredHistory = (history) => {
    if (historyFilter === 'all') return history;
    if (historyFilter === 'active') return history.filter(h => h.status === 'Pending' || h.status === 'Approved' || h.status === 'Accepted');
    if (historyFilter === 'completed') return history.filter(h => h.status === 'Completed');
    return history;
  };

  if (isLoggedIn && user) {
    return (
      <div className="profile-container">
        <h2>My Profile</h2>
        <div className="profile-card">
          <div className="profile-avatar">
            <span role="img" aria-label="user">👤</span>
          </div>
          
          {isEditing ? (
            /* Edit Mode */
            <form className="profile-edit-form" onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label htmlFor="editName">Full Name *</label>
                <input
                  type="text"
                  id="editName"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="editEmail">Email</label>
                <input
                  type="email"
                  id="editEmail"
                  value={user.email}
                  readOnly
                  className="readonly-field"
                />
                <small className="form-hint">Email cannot be changed</small>
              </div>
              <div className="form-group">
                <label htmlFor="editPhone">Phone Number</label>
                <input
                  type="tel"
                  id="editPhone"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                  placeholder="e.g., 9123-4567"
                />
              </div>
              <div className="form-group">
                <label htmlFor="editAddress">Address</label>
                <textarea
                  id="editAddress"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                  placeholder="Enter your address"
                  rows="3"
                />
              </div>
              <div className="profile-edit-actions">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              <div className="profile-info">
                <h3>{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || 'Not set'}</p>
                <p><strong>Address:</strong> {user.address || 'Not set'}</p>
                <p><strong>Member Since:</strong> {user.memberSince}</p>
              </div>
              <button className="btn btn-edit" onClick={handleEditClick}>
                ✏️ Edit Profile
              </button>
            </>
          )}
          
          <div className="profile-actions">
            <h4>Quick Actions</h4>
            <ul>
              <li><Link to="/adopt">Submit Adoption Request</Link></li>
              <li><Link to="/release">Submit Release Request</Link></li>
              <li><Link to="/funcat">Browse Cats</Link></li>
              <li><Link to="/fundog">Browse Dogs</Link></li>
            </ul>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
          
          {/* Danger Zone */}
          <div className="danger-zone">
            <h4>⚠️ Danger Zone</h4>
            <button className="btn btn-danger" onClick={handleShowDeleteModal}>
              🗑️ Delete My Account
            </button>
          </div>
        </div>
        
        {message && <p className={`message ${message.includes('success') ? 'success' : ''}`}>{message}</p>}
        
        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content delete-modal">
              <h3>⚠️ Delete Account</h3>
              <div className="delete-warning">
                <p>Are you sure you want to delete your account?</p>
                <p className="warning-text">This action cannot be undone. All your data including:</p>
                <ul>
                  <li>Profile information</li>
                  <li>Adoption history</li>
                  <li>Release history</li>
                </ul>
                <p className="warning-text">will be permanently deleted.</p>
              </div>
              <div className="delete-confirm">
                <p>Type your email <strong>{user.email}</strong> to confirm:</p>
                <input
                  type="email"
                  value={deleteConfirmEmail}
                  onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="delete-confirm-input"
                />
              </div>
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmEmail.toLowerCase() !== user.email.toLowerCase()}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* History Section */}
        <div className="history-section">
          <div className="history-header">
            <h3>📋 My Pets & Request History</h3>
            <button className="btn btn-export" onClick={exportHistoryPDF}>
              📄 Export PDF
            </button>
          </div>
          <div className="history-tabs">
            <button 
              className={`tab-btn ${activeTab === 'mypets' ? 'active' : ''}`}
              onClick={() => setActiveTab('mypets')}
            >
              🐾 My Pets ({myPets.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'adoptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('adoptions')}
            >
              🏠 Adoptions ({adoptionHistory.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'releases' ? 'active' : ''}`}
              onClick={() => setActiveTab('releases')}
            >
              💝 Releases ({releaseHistory.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              🚫 Cancelled ({cancelledRequests.length})
            </button>
          </div>
          
          {/* Filter for Adoptions/Releases tabs */}
          {(activeTab === 'adoptions' || activeTab === 'releases') && (
            <div className="history-filter">
              <label>Filter: </label>
              <select 
                value={historyFilter} 
                onChange={(e) => setHistoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Requests</option>
                <option value="active">Active (Pending/Approved)</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
          
          <div className="history-content">
            {/* My Pets Tab */}
            {activeTab === 'mypets' && (
              <div className="history-list">
                {myPets.length === 0 ? (
                  <div className="empty-history">
                    <p>🐾 You don't have any pets yet.</p>
                    <p>Complete an adoption to see your furry friends here!</p>
                    <Link to="/funcat" className="btn btn-primary">Browse Pets to Adopt</Link>
                  </div>
                ) : (
                  myPets.map(pet => (
                    <div key={pet.id} className="booking-card mypet">
                      <div className="booking-header">
                        <span className="pet-name-large">{pet.petType === 'cat' || pet.petType === 'Cat' ? '🐱' : '🐶'} {pet.petName}</span>
                        <span className="booking-status status-owned">My Pet</span>
                      </div>
                      <div className="booking-details">
                        <div className="booking-detail">
                          <span className="detail-label">Type</span>
                          <span className="detail-value">{pet.petType}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Adopted On</span>
                          <span className="detail-value">{pet.completedDate ? new Date(pet.completedDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                      <div className="mypet-actions">
                        <p className="mypet-note">If circumstances change and you can no longer care for {pet.petName}, you can release them back to Pet Heaven.</p>
                        <button 
                          className="btn btn-release"
                          onClick={() => handleReleasePet(pet)}
                        >
                          💝 Release {pet.petName}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {activeTab === 'adoptions' && (
              <div className="history-list">
                {getFilteredHistory(adoptionHistory).length === 0 ? (
                  <div className="empty-history">
                    <p>🐾 {historyFilter === 'all' ? 'No adoption requests yet.' : `No ${historyFilter} adoption requests.`}</p>
                    <Link to="/funcat" className="btn btn-primary">Browse Pets to Adopt</Link>
                  </div>
                ) : (
                  getFilteredHistory(adoptionHistory).map(request => (
                    <div key={request.id} className={`booking-card ${request.status.toLowerCase()}`}>
                      <div className="booking-header">
                        <span className="booking-id">Request #{request.id}</span>
                        <span className={`booking-status status-${request.status.toLowerCase()}`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="booking-details">
                        <div className="booking-detail">
                          <span className="detail-label">Pet Name</span>
                          <span className="detail-value">🐾 {request.petName}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Pet Type</span>
                          <span className="detail-value">{request.petType || 'Not specified'}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Submitted</span>
                          <span className="detail-value">{new Date(request.submittedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Housing</span>
                          <span className="detail-value">{request.housing}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Experience</span>
                          <span className="detail-value">{request.experience || 'Not specified'}</span>
                        </div>
                        {request.processedDate && (
                          <div className="booking-detail">
                            <span className="detail-label">Processed On</span>
                            <span className="detail-value">{new Date(request.processedDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Admin Response Notes */}
                      {request.adminNotes && (
                        <div className="admin-response">
                          <strong>Admin Notes:</strong> {request.adminNotes}
                        </div>
                      )}
                      
                      {/* Next Steps Based on Status */}
                      {request.status === 'Approved' && (
                        <div className="next-steps success">
                          <strong>🎉 Congratulations!</strong> Your adoption has been approved!
                          <p>📍 <strong>Next Steps:</strong> Please visit Pet Heaven at 123 Pet Street, Singapore to pick up {request.petName}. Bring a valid ID and this confirmation. Mon-Sat 10am-6pm.</p>
                          <p className="status-note">⏳ Status will update to "Completed" once you pick up your pet.</p>
                        </div>
                      )}
                      
                      {request.status === 'Completed' && (
                        <div className="next-steps completed">
                          <strong>✅ Adoption Complete!</strong> {request.petName} is now part of your family!
                          <p>🏠 We hope you and {request.petName} have a wonderful life together. Here are some helpful tips:</p>
                          <ul className="tips-list">
                            <li>Schedule a vet check-up within the first week</li>
                            <li>Give {request.petName} time to adjust to their new home</li>
                            <li>Maintain consistent feeding times</li>
                          </ul>
                          <div className="future-release-info">
                            <p>💝 <strong>Need to release {request.petName} in the future?</strong></p>
                            <p>If circumstances change, you can submit a <Link to="/release">Release Request</Link>. We'll help find a new loving home for {request.petName}.</p>
                          </div>
                        </div>
                      )}
                      
                      {request.status === 'Rejected' && (
                        <div className="next-steps rejected">
                          <strong>We're Sorry</strong>
                          <p>Unfortunately, your adoption request was not approved at this time. Please feel free to consider other pets or contact us for more information.</p>
                        </div>
                      )}
                      
                      {request.status === 'Cancelled' && (
                        <div className="next-steps cancelled">
                          <strong>Request Cancelled</strong>
                          <p>This request was cancelled on {request.cancelledDate ? new Date(request.cancelledDate).toLocaleDateString() : 'N/A'}.</p>
                        </div>
                      )}
                      
                      {/* Cancel Button for Pending */}
                      {request.status === 'Pending' && (
                        <div className="booking-actions">
                          <button 
                            className="btn btn-cancel"
                            onClick={() => handleCancelRequest(request.id, 'adoption')}
                          >
                            Cancel Request
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
            
            {activeTab === 'releases' && (
              <div className="history-list">
                {getFilteredHistory(releaseHistory).length === 0 ? (
                  <div className="empty-history">
                    <p>💕 {historyFilter === 'all' ? 'No release requests.' : `No ${historyFilter} release requests.`}</p>
                    <p className="history-note">We hope you and your furry friend are doing well!</p>
                  </div>
                ) : (
                  getFilteredHistory(releaseHistory).map(request => (
                    <div key={request.id} className={`booking-card ${request.status.toLowerCase()}`}>
                      <div className="booking-header">
                        <span className="booking-id">Request #{request.id}</span>
                        <span className={`booking-status status-${request.status.toLowerCase()}`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="booking-details">
                        <div className="booking-detail">
                          <span className="detail-label">Pet Name</span>
                          <span className="detail-value">🏠 {request.petName}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Pet Type</span>
                          <span className="detail-value">{request.petType}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Breed</span>
                          <span className="detail-value">{request.petBreed || 'Not specified'}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Age</span>
                          <span className="detail-value">{request.petAge}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Submitted</span>
                          <span className="detail-value">{new Date(request.submittedDate).toLocaleDateString()}</span>
                        </div>
                        {request.processedDate && (
                          <div className="booking-detail">
                            <span className="detail-label">Processed On</span>
                            <span className="detail-value">{new Date(request.processedDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Admin Response Notes */}
                      {request.adminNotes && (
                        <div className="admin-response">
                          <strong>Admin Notes:</strong> {request.adminNotes}
                        </div>
                      )}
                      
                      {/* Next Steps Based on Status */}
                      {request.status === 'Accepted' && (
                        <div className="next-steps success">
                          <strong>💕 Thank You!</strong> Your release request has been accepted.
                          <p>📍 <strong>Next Steps:</strong> Please bring {request.petName} to Pet Heaven at 123 Pet Street, Singapore. Mon-Sat 10am-6pm.</p>
                          <p className="status-note">⏳ Status will update to "Completed" once you drop off {request.petName}.</p>
                        </div>
                      )}
                      
                      {request.status === 'Completed' && (
                        <div className="next-steps completed">
                          <strong>✅ Release Complete!</strong> Thank you for trusting Pet Heaven.
                          <p>💝 {request.petName} is now in our care. We will ensure they receive the best attention and find a loving new home.</p>
                          <p>You may check our <Link to={request.petType === 'cat' ? '/funcat' : '/fundog'}>adoption listings</Link> to see when {request.petName} becomes available.</p>
                        </div>
                      )}
                      
                      {request.status === 'Rejected' && (
                        <div className="next-steps rejected">
                          <strong>Request Not Accepted</strong>
                          <p>We're currently unable to accept this release request. Please contact us for more information or alternative options.</p>
                        </div>
                      )}
                      
                      {request.status === 'Cancelled' && (
                        <div className="next-steps cancelled">
                          <strong>Request Cancelled</strong>
                          <p>This request was cancelled on {request.cancelledDate ? new Date(request.cancelledDate).toLocaleDateString() : 'N/A'}.</p>
                        </div>
                      )}
                      
                      {/* Cancel Button for Pending */}
                      {request.status === 'Pending' && (
                        <div className="booking-actions">
                          <button 
                            className="btn btn-cancel"
                            onClick={() => handleCancelRequest(request.id, 'release')}
                          >
                            Cancel Request
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
            
            {/* Cancelled Requests Tab */}
            {activeTab === 'cancelled' && (
              <div className="history-list">
                {cancelledRequests.length === 0 ? (
                  <div className="empty-history">
                    <p>🚫 No cancelled requests.</p>
                    <p>Your cancelled adoption and release requests will appear here.</p>
                  </div>
                ) : (
                  cancelledRequests.map(request => (
                    <div key={`${request.requestType}-${request.id}`} className="booking-card cancelled">
                      <div className="booking-header">
                        <span className="booking-id">
                          {request.requestType === 'adoption' ? '🏠' : '💝'} {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)} #{request.id}
                        </span>
                        <span className="booking-status status-cancelled">Cancelled</span>
                      </div>
                      <div className="booking-details">
                        <div className="booking-detail">
                          <span className="detail-label">Pet Name</span>
                          <span className="detail-value">🐾 {request.petName}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Type</span>
                          <span className="detail-value">{request.requestType === 'adoption' ? 'Adoption Request' : 'Release Request'}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Submitted</span>
                          <span className="detail-value">{new Date(request.submittedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="booking-detail">
                          <span className="detail-label">Cancelled On</span>
                          <span className="detail-value">{request.cancelledDate ? new Date(request.cancelledDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Redirect to auth page if not logged in
  return <Navigate to="/auth" replace />;
};

export default Profile;
