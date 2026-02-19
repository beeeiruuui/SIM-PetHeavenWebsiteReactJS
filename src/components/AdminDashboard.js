import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../services/unified-auth';
import { useNavigate, Navigate } from 'react-router-dom';
import { getAllCatsWithCustom, getAllDogsWithCustom, updatePetStatus, addPet as addPetToData, deleteCustomPet, updateCustomPet, isCustomPet, incrementTotalAdoptions, getTotalAdoptions, resetTotalAdoptions } from '../services/pet-data';

const AdminDashboard = () => {
  const { isLoggedIn, user, isAdmin, logout, users } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [lastActivity, setLastActivity] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Track last activity with live seconds count
  const formatLastActivity = useCallback(() => {
    if (!lastActivity) return '0s ago';
    const diff = Math.floor((currentTime - lastActivity) / 1000);
    
    if (diff < 0) return '0s ago';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ${diff % 60}s ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m ago`;
    return lastActivity.toLocaleDateString();
  }, [lastActivity, currentTime]);

  useEffect(() => {
    const updateActivity = () => {
      const now = new Date();
      localStorage.setItem('adminLastActivity', now.toISOString());
      setLastActivity(now);
    };

    // Set initial activity
    const stored = localStorage.getItem('adminLastActivity');
    if (stored) {
      setLastActivity(new Date(stored));
    } else {
      updateActivity();
    }

    // Live timer update every second
    const timerInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Update on every user interaction (no throttle)
    const events = ['click', 'keypress', 'input', 'change'];

    events.forEach(event => window.addEventListener(event, updateActivity));
    
    // Update online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(timerInterval);
    };
  }, []);
  
  // Pet management state - load from pet-data.js (separate cats and dogs)
  const [cats, setCats] = useState([]);
  const [dogs, setDogs] = useState([]);
  
  // Load pets and listen for changes
  const loadPets = () => {
    setCats(getAllCatsWithCustom());
    setDogs(getAllDogsWithCustom());
  };
  
  useEffect(() => {
    loadPets();
    
    // Listen for pet changes (real-time updates)
    const handlePetChange = () => loadPets();
    window.addEventListener('petStatusChanged', handlePetChange);
    window.addEventListener('petDataChanged', handlePetChange);
    window.addEventListener('storage', handlePetChange);
    
    return () => {
      window.removeEventListener('petStatusChanged', handlePetChange);
      window.removeEventListener('petDataChanged', handlePetChange);
      window.removeEventListener('storage', handlePetChange);
    };
  }, []);
  
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [petForm, setPetForm] = useState({
    name: '', type: 'Dog', breed: '', age: '', gender: 'Male', status: 'Available', vaccinated: false, neutered: false, image: '', color: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [petFilter, setPetFilter] = useState('all');
  const [petSearch, setPetSearch] = useState('');
  
  // Member view modal state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Confirmation modal state for admin actions
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Adoption management state - load from localStorage
  const [adoptions, setAdoptions] = useState(() => {
    const stored = localStorage.getItem('adoptionRequests');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map(a => ({
        id: a.id,
        petName: a.petName,
        petType: a.petType || 'Not specified',
        adopter: a.name,
        email: a.email,
        date: new Date(a.submittedDate).toLocaleDateString(),
        status: a.status || 'Pending'
      }));
    }
    return [];
  });
  
  // Release management state - load from localStorage
  const [releases, setReleases] = useState(() => {
    const stored = localStorage.getItem('releaseRequests');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map(r => ({
        id: r.id,
        petName: r.petName,
        petType: r.petType,
        owner: r.ownerName,
        email: r.email,
        phone: r.phone,
        date: new Date(r.submittedDate).toLocaleDateString(),
        reason: r.reason || 'Not specified',
        status: r.status || 'Pending'
      }));
    }
    return [];
  });

  // Redirect if not logged in or not admin
  if (!isLoggedIn || !isAdmin()) {
    return <Navigate to="/auth" replace />;
  }

  // Dynamic stats based on actual data
  const stats = {
    totalPets: cats.length + dogs.length,
    totalCats: cats.length,
    totalDogs: dogs.length,
    adoptedPets: [...cats, ...dogs].filter(p => p.status === 'Adopted').length,  // Current adopted count
    totalSuccessfulAdoptions: getTotalAdoptions(),  // Historical total adoptions
    pendingApproval: adoptions.filter(a => a.status === 'Pending').length,
    pendingPickup: adoptions.filter(a => a.status === 'Approved').length,
    totalMembers: users ? users.filter(u => u.role === 'user').length : 0,
    pendingReleases: releases.filter(r => r.status === 'Pending').length,
    completedReleases: releases.filter(r => r.status === 'Accepted' || r.status === 'Completed').length
  };

  // Pet management functions
  const handleOpenPetModal = (pet = null) => {
    if (pet) {
      setEditingPet(pet);
      setPetForm(pet);
      setImagePreview(pet.image || null);
    } else {
      setEditingPet(null);
      setPetForm({ name: '', type: 'Dog', breed: '', age: '', gender: 'Male', status: 'Available', vaccinated: false, neutered: false, image: '', color: '' });
      setImagePreview(null);
    }
    setShowPetModal(true);
  };

  const handleClosePetModal = () => {
    setShowPetModal(false);
    setEditingPet(null);
    setPetForm({ name: '', type: 'Dog', breed: '', age: '', gender: 'Male', status: 'Available', vaccinated: false, neutered: false, image: '', color: '' });
    setImagePreview(null);
  };

  const handlePetFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPetForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setImagePreview(base64);
        setPetForm(prev => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePet = (e) => {
    e.preventDefault();
    if (editingPet) {
      // Check if this is a custom pet (fully editable) or base pet (status only)
      if (isCustomPet(editingPet.id)) {
        // Update all fields for custom pet
        updateCustomPet(editingPet.id, petForm, editingPet.type);
      } else {
        // Base pet - can only update status
        updatePetStatus(editingPet.id, petForm.status);
      }
      loadPets(); // Refresh the list
    } else {
      // Add new pet via pet-data.js
      addPetToData(petForm);
      loadPets(); // Refresh the list
    }
    handleClosePetModal();
  };

  const handleDeletePet = (id) => {
    if (window.confirm('Are you sure you want to remove this pet from the system?')) {
      deleteCustomPet(id);
      loadPets(); // Refresh the list
    }
  };

  // Filtered cats
  const filteredCats = cats.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(petSearch.toLowerCase()) ||
                         cat.breed.toLowerCase().includes(petSearch.toLowerCase());
    const matchesFilter = petFilter === 'all' || petFilter === 'cat' || cat.status.toLowerCase() === petFilter;
    return matchesSearch && matchesFilter;
  });

  // Filtered dogs
  const filteredDogs = dogs.filter(dog => {
    const matchesSearch = dog.name.toLowerCase().includes(petSearch.toLowerCase()) ||
                         dog.breed.toLowerCase().includes(petSearch.toLowerCase());
    const matchesFilter = petFilter === 'all' || petFilter === 'dog' || dog.status.toLowerCase() === petFilter;
    return matchesSearch && matchesFilter;
  });

  // Adoption management functions
  const handleApproveAdoption = (id) => {
    const adoption = adoptions.find(a => a.id === id);
    setConfirmAction({
      type: 'adoption',
      action: 'approve',
      id: id,
      petName: adoption?.petName,
      title: 'Approve Adoption Request',
      message: `Are you sure you want to approve the adoption of ${adoption?.petName}? The pet will be marked as "Adopted".`
    });
    setAdminNotes('');
    setShowConfirmModal(true);
  };

  const handleRejectAdoption = (id) => {
    const adoption = adoptions.find(a => a.id === id);
    setConfirmAction({
      type: 'adoption',
      action: 'reject',
      id: id,
      petName: adoption?.petName,
      title: 'Reject Adoption Request',
      message: `Are you sure you want to reject the adoption request for ${adoption?.petName}?`
    });
    setAdminNotes('');
    setShowConfirmModal(true);
  };

  // Release management functions
  const handleAcceptRelease = (id) => {
    const release = releases.find(r => r.id === id);
    setConfirmAction({
      type: 'release',
      action: 'accept',
      id: id,
      petName: release?.petName,
      title: 'Accept Release Request',
      message: `Are you sure you want to accept ${release?.petName}? The pet will be added to our adoption listing.`
    });
    setAdminNotes('');
    setShowConfirmModal(true);
  };

  const handleRejectRelease = (id) => {
    const release = releases.find(r => r.id === id);
    setConfirmAction({
      type: 'release',
      action: 'reject',
      id: id,
      petName: release?.petName,
      title: 'Reject Release Request',
      message: `Are you sure you want to reject the release request for ${release?.petName}?`
    });
    setAdminNotes('');
    setShowConfirmModal(true);
  };

  // Mark adoption as completed (pet picked up)
  const handleCompleteAdoption = (id) => {
    const adoption = adoptions.find(a => a.id === id);
    setConfirmAction({
      type: 'adoption',
      action: 'complete',
      id: id,
      petName: adoption?.petName,
      title: 'Mark as Picked Up',
      message: `Confirm that ${adoption?.adopter} has picked up ${adoption?.petName}? This will complete the adoption process.`
    });
    setAdminNotes('');
    setShowConfirmModal(true);
  };

  // Mark release as completed (pet dropped off)
  const handleCompleteRelease = (id) => {
    const release = releases.find(r => r.id === id);
    setConfirmAction({
      type: 'release',
      action: 'complete',
      id: id,
      petName: release?.petName,
      title: 'Mark as Dropped Off',
      message: `Confirm that ${release?.petName} has been dropped off at Pet Heaven? This will complete the release process.`
    });
    setAdminNotes('');
    setShowConfirmModal(true);
  };

  // Execute the confirmed action
  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    
    const { type, action, id } = confirmAction;
    const processedDate = new Date().toISOString();
    
    if (type === 'adoption') {
      if (action === 'approve') {
        // Find the adoption request
        const adoption = adoptions.find(a => a.id === id);
        
        setAdoptions(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
        // Update localStorage with admin notes and processed date
        const stored = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
        const updated = stored.map(a => a.id === id ? { 
          ...a, 
          status: 'Approved', 
          adminNotes: adminNotes,
          processedDate: processedDate 
        } : a);
        localStorage.setItem('adoptionRequests', JSON.stringify(updated));
        
        // Update pet status to 'Adopted' and increment total adoptions
        if (adoption && adoption.petName) {
          const allPets = [...cats, ...dogs];
          const pet = allPets.find(p => p.name.toLowerCase() === adoption.petName.toLowerCase());
          if (pet) {
            updatePetStatus(pet.id, 'Adopted');
            incrementTotalAdoptions();  // Increment total successful adoptions counter
            loadPets();
          }
        }
      } else if (action === 'reject') {
        setAdoptions(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
        const stored = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
        const updated = stored.map(a => a.id === id ? { 
          ...a, 
          status: 'Rejected', 
          adminNotes: adminNotes,
          processedDate: processedDate 
        } : a);
        localStorage.setItem('adoptionRequests', JSON.stringify(updated));
      } else if (action === 'complete') {
        // Mark adoption as completed (pet picked up)
        setAdoptions(prev => prev.map(a => a.id === id ? { ...a, status: 'Completed' } : a));
        const stored = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
        const updated = stored.map(a => a.id === id ? { 
          ...a, 
          status: 'Completed', 
          adminNotes: adminNotes || 'Pet has been picked up successfully!',
          completedDate: processedDate 
        } : a);
        localStorage.setItem('adoptionRequests', JSON.stringify(updated));
      }
    } else if (type === 'release') {
      if (action === 'accept') {
        const stored = JSON.parse(localStorage.getItem('releaseRequests') || '[]');
        const releaseData = stored.find(r => r.id === id);
        
        setReleases(prev => prev.map(r => r.id === id ? { ...r, status: 'Accepted' } : r));
        const updated = stored.map(r => r.id === id ? { 
          ...r, 
          status: 'Accepted', 
          adminNotes: adminNotes,
          processedDate: processedDate 
        } : r);
        localStorage.setItem('releaseRequests', JSON.stringify(updated));
        
        // Handle the released pet
        if (releaseData) {
          // Check if this is an adopted pet being released back
          if (releaseData.isReleasingAdoptedPet && releaseData.originalPetId) {
            // Update original pet's status back to 'Available' (reduces current adopted count)
            updatePetStatus(releaseData.originalPetId, 'Available');
            loadPets();
          } else {
            // Add as a new pet to the system
            const newPet = {
              name: releaseData.petName,
              type: releaseData.petType === 'cat' ? 'Cat' : 'Dog',
              breed: releaseData.petBreed || 'Mixed',
              age: releaseData.petAge || 'Unknown',
              gender: releaseData.petGender === 'male' ? 'Male' : 'Female',
              status: 'Available',
              vaccinated: releaseData.isVaccinated === 'yes',
              neutered: releaseData.isNeutered === 'yes',
              personality: releaseData.personality || 'Friendly pet looking for a new home',
              image: releaseData.petType === 'cat' ? 'https://placekitten.com/300/300' : 'https://placedog.net/300/300'
            };
            addPetToData(newPet);
            loadPets();
          }
        }
      } else if (action === 'reject') {
        setReleases(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
        const stored = JSON.parse(localStorage.getItem('releaseRequests') || '[]');
        const updated = stored.map(r => r.id === id ? { 
          ...r, 
          status: 'Rejected', 
          adminNotes: adminNotes,
          processedDate: processedDate 
        } : r);
        localStorage.setItem('releaseRequests', JSON.stringify(updated));
      } else if (action === 'complete') {
        // Mark release as completed (pet dropped off)
        setReleases(prev => prev.map(r => r.id === id ? { ...r, status: 'Completed' } : r));
        const stored = JSON.parse(localStorage.getItem('releaseRequests') || '[]');
        const updated = stored.map(r => r.id === id ? { 
          ...r, 
          status: 'Completed', 
          adminNotes: adminNotes || 'Pet has been received. Thank you for trusting Pet Heaven!',
          completedDate: processedDate 
        } : r);
        localStorage.setItem('releaseRequests', JSON.stringify(updated));
      }
    }
    
    // Close modal and reset
    setShowConfirmModal(false);
    setConfirmAction(null);
    setAdminNotes('');
  };

  const cancelConfirmAction = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setAdminNotes('');
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

  // ========== GENERATE REPORT FUNCTION ==========
  const generateMonthlyReport = () => {
    const today = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = monthNames[today.getMonth()];
    const currentYear = today.getFullYear();
    
    const allAdoptions = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
    const allReleases = JSON.parse(localStorage.getItem('releaseRequests') || '[]');
    
    // Calculate statistics
    const pendingAdoptions = allAdoptions.filter(a => a.status === 'Pending').length;
    const approvedAdoptions = allAdoptions.filter(a => a.status === 'Approved').length;
    const completedAdoptions = allAdoptions.filter(a => a.status === 'Completed').length;
    const rejectedAdoptions = allAdoptions.filter(a => a.status === 'Rejected').length;
    
    const pendingReleases = allReleases.filter(r => r.status === 'Pending').length;
    const acceptedReleases = allReleases.filter(r => r.status === 'Accepted').length;
    const completedReleases = allReleases.filter(r => r.status === 'Completed').length;
    const rejectedReleases = allReleases.filter(r => r.status === 'Rejected').length;
    
    const membersList = users ? users.filter(u => u.role === 'user') : [];
    
    // Popular pet types
    const catAdoptions = allAdoptions.filter(a => a.petType?.toLowerCase() === 'cat').length;
    const dogAdoptions = allAdoptions.filter(a => a.petType?.toLowerCase() === 'dog').length;
    
    // Generate printable HTML
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pet Heaven Report - ${currentMonth} ${currentYear}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .report-header { text-align: center; border-bottom: 3px solid #ff9a9e; padding-bottom: 20px; margin-bottom: 30px; }
          .report-header h1 { color: #1a1a2e; font-size: 2.2em; margin-bottom: 5px; }
          .report-header .subtitle { color: #ff9a9e; font-size: 1.3em; font-weight: 600; }
          .report-header .period { color: #666; margin-top: 10px; }
          .report-meta { display: flex; justify-content: space-between; background: #f8f9fa; padding: 15px 20px; border-radius: 8px; margin-bottom: 30px; font-size: 0.9em; }
          .section { margin-bottom: 35px; }
          .section h2 { color: #1a1a2e; border-bottom: 2px solid #ff9a9e; padding-bottom: 8px; margin-bottom: 20px; font-size: 1.4em; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
          .stat-box { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #ff9a9e; }
          .stat-box h3 { font-size: 1.8em; color: #1a1a2e; margin-bottom: 5px; }
          .stat-box p { color: #666; font-size: 0.9em; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #1a1a2e; color: white; font-weight: 600; }
          tr:nth-child(even) { background: #f8f9fa; }
          .status-pending { color: #f39c12; font-weight: 600; }
          .status-approved, .status-accepted { color: #27ae60; font-weight: 600; }
          .status-completed { color: #3498db; font-weight: 600; }
          .status-rejected { color: #e74c3c; font-weight: 600; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 0.85em; }
          .no-print { margin-top: 30px; }
          @media print { body { padding: 20px; } .no-print { display: none; } .stat-box { break-inside: avoid; } }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>🐾 Pet Heaven</h1>
          <div class="subtitle">Monthly Activity Report</div>
          <div class="period">${currentMonth} ${currentYear}</div>
        </div>
        
        <div class="report-meta">
          <div><strong>Generated:</strong> ${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${today.toLocaleTimeString()}</div>
          <div><strong>Generated by:</strong> ${user?.name || 'Admin'}</div>
        </div>
        
        <div class="section">
          <h2>📊 Executive Summary</h2>
          <div class="stats-grid">
            <div class="stat-box"><h3>${stats.totalPets}</h3><p>Total Pets</p></div>
            <div class="stat-box"><h3>${stats.totalCats}</h3><p>Cats</p></div>
            <div class="stat-box"><h3>${stats.totalDogs}</h3><p>Dogs</p></div>
            <div class="stat-box"><h3>${membersList.length}</h3><p>Members</p></div>
          </div>
        </div>
        
        <div class="section">
          <h2>🏠 Adoption Statistics</h2>
          <table>
            <thead><tr><th>Status</th><th>Count</th><th>Percentage</th></tr></thead>
            <tbody>
              <tr><td class="status-pending">⏳ Pending</td><td>${pendingAdoptions}</td><td>${allAdoptions.length > 0 ? ((pendingAdoptions / allAdoptions.length) * 100).toFixed(1) : 0}%</td></tr>
              <tr><td class="status-approved">✅ Approved</td><td>${approvedAdoptions}</td><td>${allAdoptions.length > 0 ? ((approvedAdoptions / allAdoptions.length) * 100).toFixed(1) : 0}%</td></tr>
              <tr><td class="status-completed">📦 Completed</td><td>${completedAdoptions}</td><td>${allAdoptions.length > 0 ? ((completedAdoptions / allAdoptions.length) * 100).toFixed(1) : 0}%</td></tr>
              <tr><td class="status-rejected">❌ Rejected</td><td>${rejectedAdoptions}</td><td>${allAdoptions.length > 0 ? ((rejectedAdoptions / allAdoptions.length) * 100).toFixed(1) : 0}%</td></tr>
              <tr style="font-weight: bold; background: #e8f5e9 !important;"><td>Total</td><td>${allAdoptions.length}</td><td>100%</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>📋 Release Statistics</h2>
          <table>
            <thead><tr><th>Status</th><th>Count</th><th>Percentage</th></tr></thead>
            <tbody>
              <tr><td class="status-pending">⏳ Pending</td><td>${pendingReleases}</td><td>${allReleases.length > 0 ? ((pendingReleases / allReleases.length) * 100).toFixed(1) : 0}%</td></tr>
              <tr><td class="status-accepted">✅ Accepted</td><td>${acceptedReleases}</td><td>${allReleases.length > 0 ? ((acceptedReleases / allReleases.length) * 100).toFixed(1) : 0}%</td></tr>
              <tr><td class="status-completed">📦 Completed</td><td>${completedReleases}</td><td>${allReleases.length > 0 ? ((completedReleases / allReleases.length) * 100).toFixed(1) : 0}%</td></tr>
              <tr><td class="status-rejected">❌ Rejected</td><td>${rejectedReleases}</td><td>${allReleases.length > 0 ? ((rejectedReleases / allReleases.length) * 100).toFixed(1) : 0}%</td></tr>
              <tr style="font-weight: bold; background: #e8f5e9 !important;"><td>Total</td><td>${allReleases.length}</td><td>100%</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>🏆 Popular Pet Types</h2>
          <table>
            <thead><tr><th>Type</th><th>Adoption Requests</th></tr></thead>
            <tbody>
              <tr><td>🐱 Cats</td><td>${catAdoptions}</td></tr>
              <tr><td>🐕 Dogs</td><td>${dogAdoptions}</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>📝 Recent Adoptions</h2>
          <table>
            <thead><tr><th>ID</th><th>Pet</th><th>Adopter</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              ${allAdoptions.slice(-10).reverse().map(a => `
                <tr>
                  <td>#${a.id}</td>
                  <td>${a.petName}</td>
                  <td>${a.name}</td>
                  <td>${new Date(a.submittedDate).toLocaleDateString()}</td>
                  <td class="status-${a.status.toLowerCase()}">${a.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p><strong>Pet Heaven</strong> - Finding Forever Homes 🐾</p>
          <p>This report was automatically generated by the Pet Heaven Admin Dashboard</p>
        </div>
        
        <div class="no-print" style="text-align: center;">
          <button onclick="window.print()" style="padding: 15px 40px; background: #ff9a9e; color: white; border: none; border-radius: 8px; font-size: 1.1em; cursor: pointer; margin-right: 10px;">
            🖨️ Print / Save as PDF
          </button>
          <button onclick="window.close()" style="padding: 15px 40px; background: #6c757d; color: white; border: none; border-radius: 8px; font-size: 1.1em; cursor: pointer;">
            ✖️ Close
          </button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ========== RESET DATA FUNCTION ==========
  const resetAllData = () => {
    const allAdoptions = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
    const allReleases = JSON.parse(localStorage.getItem('releaseRequests') || '[]');
    
    // Check for pending requests
    const pendingAdoptions = allAdoptions.filter(a => a.status === 'Pending' || a.status === 'Approved');
    const pendingReleases = allReleases.filter(r => r.status === 'Pending' || r.status === 'Accepted');
    
    if (pendingAdoptions.length > 0 || pendingReleases.length > 0) {
      const proceed = window.confirm(
        `⚠️ WARNING: ACTIVE REQUESTS DETECTED!\n\n` +
        `There are:\n` +
        `• ${pendingAdoptions.length} pending/approved adoption request(s)\n` +
        `• ${pendingReleases.length} pending/accepted release request(s)\n\n` +
        `Click OK to keep active requests and clear only completed/cancelled data.\n` +
        `Click Cancel to abort.`
      );
      
      if (!proceed) return;
      
      // Partial reset - keep active requests
      const activeAdoptions = allAdoptions.filter(a => a.status === 'Pending' || a.status === 'Approved');
      const activeReleases = allReleases.filter(r => r.status === 'Pending' || r.status === 'Accepted');
      
      localStorage.setItem('adoptionRequests', JSON.stringify(activeAdoptions));
      localStorage.setItem('releaseRequests', JSON.stringify(activeReleases));
      
      // Update state
      setAdoptions(activeAdoptions.map(a => ({
        id: a.id, petName: a.petName, petType: a.petType || 'Not specified',
        adopter: a.name, email: a.email,
        date: new Date(a.submittedDate).toLocaleDateString(), status: a.status
      })));
      setReleases(activeReleases.map(r => ({
        id: r.id, petName: r.petName, petType: r.petType, owner: r.ownerName, email: r.email,
        phone: r.phone, date: new Date(r.submittedDate).toLocaleDateString(),
        reason: r.reason || 'Not specified', status: r.status
      })));
      
      alert(`✅ Partial reset completed!\n\n• Kept ${activeAdoptions.length} active adoption(s)\n• Kept ${activeReleases.length} active release(s)\n• Cleared completed/cancelled data`);
      return;
    }
    
    // Full reset - no active requests
    const confirmReset = window.confirm(
      '✅ NO ACTIVE REQUESTS\n\n' +
      'This will clear:\n' +
      '• All adoption requests\n' +
      '• All release requests\n' +
      '• Custom added pets\n' +
      '• Total adoptions counter\n\n' +
      '⚠️ User accounts will NOT be deleted.\n\n' +
      'Click OK to proceed with reset.'
    );
    
    if (!confirmReset) return;
    
    // Double confirmation
    const doubleConfirm = window.confirm('🔴 FINAL CONFIRMATION\n\nClick OK to permanently reset all data.\nClick Cancel to abort.');
    if (!doubleConfirm) return;
    
    // Full reset
    localStorage.removeItem('adoptionRequests');
    localStorage.removeItem('releaseRequests');
    localStorage.removeItem('customPets');
    resetTotalAdoptions();  // Reset total successful adoptions counter
    
    setAdoptions([]);
    setReleases([]);
    loadPets();
    
    alert('✅ Reset completed!\n\n• All requests cleared\n• Custom pets cleared\n• Adoption counter reset\n• User accounts preserved');
  };

  // ========== ACTIVITY FEED CALCULATION ==========
  const calculateActivityFeed = () => {
    const activities = [];
    const allAdoptions = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
    const allReleases = JSON.parse(localStorage.getItem('releaseRequests') || '[]');
    
    // Add adoption activities
    allAdoptions.forEach(a => {
      activities.push({
        type: 'adoption_submitted',
        message: `${a.name} submitted adoption request for ${a.petName}`,
        date: new Date(a.submittedDate),
        icon: '📝'
      });
      if (a.processedDate && a.status === 'Approved') {
        activities.push({
          type: 'adoption_approved',
          message: `Adoption approved: ${a.petName} → ${a.name}`,
          date: new Date(a.processedDate),
          icon: '✅'
        });
      }
      if (a.completedDate) {
        activities.push({
          type: 'adoption_completed',
          message: `${a.name} picked up ${a.petName}`,
          date: new Date(a.completedDate),
          icon: '🏠'
        });
      }
    });
    
    // Add release activities
    allReleases.forEach(r => {
      activities.push({
        type: 'release_submitted',
        message: `${r.ownerName} submitted release request for ${r.petName}`,
        date: new Date(r.submittedDate),
        icon: '📋'
      });
      if (r.processedDate && r.status === 'Accepted') {
        activities.push({
          type: 'release_accepted',
          message: `Release accepted: ${r.petName} from ${r.ownerName}`,
          date: new Date(r.processedDate),
          icon: '✅'
        });
      }
      if (r.completedDate) {
        activities.push({
          type: 'release_completed',
          message: `${r.petName} was dropped off at Pet Heaven`,
          date: new Date(r.completedDate),
          icon: '🐾'
        });
      }
    });
    
    // Add user signup activities
    if (users) {
      users.filter(u => u.role === 'user').forEach(u => {
        if (u.signupDate) {
          activities.push({
            type: 'signup',
            message: `${u.name} joined Pet Heaven`,
            date: new Date(u.signupDate),
            icon: '👤'
          });
        }
      });
    }
    
    // Sort by date (newest first) and take recent 10
    return activities.sort((a, b) => b.date - a.date).slice(0, 10);
  };

  // ========== ALERTS CALCULATION ==========
  const calculateAlerts = () => {
    const alerts = [];
    const now = new Date();
    const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);
    
    const allAdoptions = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
    const allReleases = JSON.parse(localStorage.getItem('releaseRequests') || '[]');
    
    // Pending adoptions older than 3 days
    allAdoptions.filter(a => a.status === 'Pending').forEach(a => {
      if (new Date(a.submittedDate) < threeDaysAgo) {
        alerts.push({
          type: 'pending_adoption',
          message: `Adoption request for ${a.petName} pending for over 3 days`,
          severity: 'warning',
          icon: '⏳'
        });
      }
    });
    
    // Approved adoptions waiting for pickup older than 3 days
    allAdoptions.filter(a => a.status === 'Approved').forEach(a => {
      if (a.processedDate && new Date(a.processedDate) < threeDaysAgo) {
        alerts.push({
          type: 'pending_pickup',
          message: `${a.petName} approved but not picked up for over 3 days`,
          severity: 'danger',
          icon: '🚨'
        });
      }
    });
    
    // Pending releases older than 3 days
    allReleases.filter(r => r.status === 'Pending').forEach(r => {
      if (new Date(r.submittedDate) < threeDaysAgo) {
        alerts.push({
          type: 'pending_release',
          message: `Release request for ${r.petName} pending for over 3 days`,
          severity: 'warning',
          icon: '⏳'
        });
      }
    });
    
    // Accepted releases waiting for dropoff older than 3 days
    allReleases.filter(r => r.status === 'Accepted').forEach(r => {
      if (r.processedDate && new Date(r.processedDate) < threeDaysAgo) {
        alerts.push({
          type: 'pending_dropoff',
          message: `${r.petName} accepted but not dropped off for over 3 days`,
          severity: 'danger',
          icon: '🚨'
        });
      }
    });
    
    return alerts;
  };

  // Get activity feed and alerts
  const activities = calculateActivityFeed();
  const alerts = calculateAlerts();

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
            className={`admin-nav-item ${activeSection === 'cats' ? 'active' : ''}`}
            onClick={() => setActiveSection('cats')}
          >
            🐈 Cats
          </button>
          <button 
            className={`admin-nav-item ${activeSection === 'dogs' ? 'active' : ''}`}
            onClick={() => setActiveSection('dogs')}
          >
            🐕 Dogs
          </button>
          <button 
            className={`admin-nav-item ${activeSection === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveSection('gallery')}
          >
            🖼️ Pet Gallery
          </button>
        </nav>

        <button className="btn btn-secondary admin-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-top">
            <div>
              <h1>Admin Dashboard</h1>
              <div className="admin-user-status">
                <span className="admin-status-item">
                  <span className={`admin-live-indicator ${isOnline ? 'online' : 'offline'}`}></span>
                  <span className="status-text">{isOnline ? 'Live' : 'Away'}</span>
                </span>
                <span className="admin-status-divider">|</span>
                <span className="admin-status-item">
                  <span className="admin-last-activity">⏱️ Last Activity: {formatLastActivity()}</span>
                </span>
              </div>
              <p className="admin-welcome">Welcome back, <strong>{user?.name}</strong>!</p>
            </div>
            <div className="admin-header-actions">
              <button className="btn-admin-action btn-report" onClick={generateMonthlyReport}>📊 Generate Report</button>
              <button className="btn-admin-action btn-reset" onClick={resetAllData}>🔄 Reset Data</button>
            </div>
          </div>
        </header>

        {activeSection === 'overview' && (
          <div className="admin-section">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">🐈</span>
                <div className="stat-info">
                  <h3>{stats.totalCats}</h3>
                  <p>Total Cats</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🐕</span>
                <div className="stat-info">
                  <h3>{stats.totalDogs}</h3>
                  <p>Total Dogs</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🏠</span>
                <div className="stat-info">
                  <h3>{stats.adoptedPets}</h3>
                  <p>Currently Adopted</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🎉</span>
                <div className="stat-info">
                  <h3>{stats.totalSuccessfulAdoptions}</h3>
                  <p>Successful Adoptions</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⏳</span>
                <div className="stat-info">
                  <h3>{stats.pendingApproval}</h3>
                  <p>Pending Approval</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🚚</span>
                <div className="stat-info">
                  <h3>{stats.pendingPickup}</h3>
                  <p>Pending Pickup</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div className="stat-info">
                  <h3>{stats.totalMembers}</h3>
                  <p>Members</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📦</span>
                <div className="stat-info">
                  <h3>{stats.completedReleases}</h3>
                  <p>Released</p>
                </div>
              </div>
            </div>

            {/* Alerts Section */}
            <div className="admin-alerts-section">
              <h3>⚠️ Alerts & Notifications</h3>
              <div className="alerts-container">
                {alerts.length === 0 ? (
                  <div className="no-alerts">
                    <span>✅</span>
                    <p>All systems operational. No alerts at this time.</p>
                  </div>
                ) : (
                  alerts.map((alert, index) => (
                    <div key={index} className={`alert-card alert-${alert.severity}`}>
                      <span className="alert-icon">{alert.icon}</span>
                      <span className="alert-message">{alert.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="admin-activity-section">
              <h3>🔔 Recent Activity</h3>
              <div className="activity-feed">
                {activities.length === 0 ? (
                  <div className="no-activity">
                    <p>No recent activity to display.</p>
                  </div>
                ) : (
                  activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <span className="activity-icon">{activity.icon}</span>
                      <div className="activity-content">
                        <span className="activity-message">{activity.message}</span>
                        <span className="activity-time">
                          {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="admin-cards">
              <div className="admin-card">
                <div className="card-header-row">
                  <h3>Recent Adoption Requests</h3>
                  <button className="btn-small btn-view" onClick={() => setActiveSection('adoptions')}>View All</button>
                </div>
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
                <div className="card-header-row">
                  <h3>Recent Release Requests</h3>
                  <button className="btn-small btn-view" onClick={() => setActiveSection('releases')}>View All</button>
                </div>
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
                        ) : adoption.status === 'Approved' ? (
                          <button className="btn-small btn-complete" onClick={() => handleCompleteAdoption(adoption.id)}>Mark Picked Up</button>
                        ) : (
                          <span className="action-done">{adoption.status}</span>
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
                        ) : release.status === 'Accepted' ? (
                          <button className="btn-small btn-complete" onClick={() => handleCompleteRelease(release.id)}>Mark Dropped Off</button>
                        ) : (
                          <span className="action-done">{release.status}</span>
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
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.map((member, index) => (
                    <tr key={member.id || index}>
                      <td>#{member.id || index + 1}</td>
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

        {activeSection === 'cats' && (
          <div className="admin-section">
            <h2>🐈 Cat Management</h2>
            <div className="admin-actions-bar">
              <button className="btn btn-primary" onClick={() => handleOpenPetModal()}>+ Add New Cat</button>
              <div className="admin-filters">
                <input
                  type="text"
                  placeholder="Search cats..."
                  value={petSearch}
                  onChange={(e) => setPetSearch(e.target.value)}
                  className="search-input"
                />
                <select value={petFilter} onChange={(e) => setPetFilter(e.target.value)} className="filter-select">
                  <option value="all">All Cats</option>
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
                    <th>Breed</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Color</th>
                    <th>Status</th>
                    <th>Vaccinated</th>
                    <th>Neutered/Spayed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCats.map(cat => (
                    <tr key={cat.id}>
                      <td>#{cat.id}</td>
                      <td>{cat.name}</td>
                      <td>{cat.breed}</td>
                      <td>{cat.age}</td>
                      <td>{cat.gender}</td>
                      <td>{cat.color || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${cat.status.toLowerCase()}`}>
                          {cat.status}
                        </span>
                      </td>
                      <td>{cat.vaccinated ? '✅' : '❌'}</td>
                      <td>{cat.neutered ? '✅' : '❌'}</td>
                      <td>
                        <button className="btn-small btn-edit" onClick={() => handleOpenPetModal(cat)}>Edit</button>
                        <button className="btn-small btn-reject" onClick={() => handleDeletePet(cat.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCats.length === 0 && (
                <p className="no-results">No cats found matching your criteria.</p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'dogs' && (
          <div className="admin-section">
            <h2>🐕 Dog Management</h2>
            <div className="admin-actions-bar">
              <button className="btn btn-primary" onClick={() => handleOpenPetModal()}>+ Add New Dog</button>
              <div className="admin-filters">
                <input
                  type="text"
                  placeholder="Search dogs..."
                  value={petSearch}
                  onChange={(e) => setPetSearch(e.target.value)}
                  className="search-input"
                />
                <select value={petFilter} onChange={(e) => setPetFilter(e.target.value)} className="filter-select">
                  <option value="all">All Dogs</option>
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
                    <th>Breed</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Vaccinated</th>
                    <th>Neutered/Spayed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDogs.map(dog => (
                    <tr key={dog.id}>
                      <td>#{dog.id}</td>
                      <td>{dog.name}</td>
                      <td>{dog.breed}</td>
                      <td>{dog.age}</td>
                      <td>{dog.gender}</td>
                      <td>{dog.size || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${dog.status.toLowerCase()}`}>
                          {dog.status}
                        </span>
                      </td>
                      <td>{dog.vaccinated ? '✅' : '❌'}</td>
                      <td>{dog.neutered ? '✅' : '❌'}</td>
                      <td>
                        <button className="btn-small btn-edit" onClick={() => handleOpenPetModal(dog)}>Edit</button>
                        <button className="btn-small btn-reject" onClick={() => handleDeletePet(dog.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDogs.length === 0 && (
                <p className="no-results">No dogs found matching your criteria.</p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'gallery' && (
          <div className="admin-section">
            <h2>🖼️ Pet Gallery</h2>
            <div className="admin-pets-gallery">
              <div className="gallery-section">
                <h3>🐱 Cats ({cats.length})</h3>
                <div className="pets-gallery-grid">
                  {cats.map(cat => (
                    <div key={cat.id} className={`pet-gallery-card status-${cat.status?.toLowerCase().replace(' ', '-') || 'available'}`}>
                      <div className="pet-gallery-image">
                        <img src={cat.image} alt={cat.name} />
                        <span className={`pet-status-badge ${cat.status?.toLowerCase().replace(' ', '-') || 'available'}`}>
                          {cat.status || 'Available'}
                        </span>
                      </div>
                      <div className="pet-gallery-info">
                        <span className="pet-id">ID: {cat.id}</span>
                        <span className="pet-name">{cat.name}</span>
                        <span className="pet-breed">{cat.breed}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="gallery-section">
                <h3>🐕 Dogs ({dogs.length})</h3>
                <div className="pets-gallery-grid">
                  {dogs.map(dog => (
                    <div key={dog.id} className={`pet-gallery-card status-${dog.status?.toLowerCase().replace(' ', '-') || 'available'}`}>
                      <div className="pet-gallery-image">
                        <img src={dog.image} alt={dog.name} />
                        <span className={`pet-status-badge ${dog.status?.toLowerCase().replace(' ', '-') || 'available'}`}>
                          {dog.status || 'Available'}
                        </span>
                      </div>
                      <div className="pet-gallery-info">
                        <span className="pet-id">ID: {dog.id}</span>
                        <span className="pet-name">{dog.name}</span>
                        <span className="pet-breed">{dog.breed}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                    <label>Color</label>
                    <input
                      type="text"
                      name="color"
                      value={petForm.color}
                      onChange={handlePetFormChange}
                      placeholder="e.g., White, Black, Brown"
                    />
                  </div>
                </div>
                <div className="form-row">
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
                <div className="form-group image-upload-group">
                  <label>Pet Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-upload-input"
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button 
                        type="button" 
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          setImagePreview(null);
                          setPetForm(prev => ({ ...prev, image: '' }));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <small className="form-hint">Max 2MB. Supported: JPG, PNG, GIF</small>
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

        {/* Confirmation Modal for Admin Actions */}
        {showConfirmModal && confirmAction && (
          <div className="modal-overlay" onClick={cancelConfirmAction}>
            <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={cancelConfirmAction}>×</button>
              <h2>{confirmAction.title}</h2>
              <p className="confirm-message">{confirmAction.message}</p>
              
              <div className="admin-notes-section">
                <label htmlFor="adminNotes">Admin Notes (Optional):</label>
                <textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes for the user (e.g., pickup instructions, reason for rejection)..."
                  rows="3"
                />
              </div>
              
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={cancelConfirmAction}>
                  Cancel
                </button>
                <button 
                  className={`btn ${confirmAction.action === 'reject' ? 'btn-danger' : 'btn-primary'}`}
                  onClick={executeConfirmedAction}
                >
                  {confirmAction.action === 'approve' ? '✓ Approve' : 
                   confirmAction.action === 'accept' ? '✓ Accept' : 
                   confirmAction.action === 'complete' ? '✓ Confirm' :
                   '✗ Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
