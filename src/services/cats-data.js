// Cat data for Pet Heaven website
// Centralized cat data with localStorage for status tracking

// ========== CAT DATA ==========
const localCats = [
  {
    id: 1,
    name: 'Whiskers',
    type: 'Cat',
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
    type: 'Cat',
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
    type: 'Cat',
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
    type: 'Cat',
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
    type: 'Cat',
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
    type: 'Cat',
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

// ========== HELPER FUNCTIONS ==========

// Get pet status from localStorage (default: 'Available')
const getCatStatus = (catId) => {
  const stored = localStorage.getItem(`petStatus_${catId}`);
  return stored || 'Available';
};

// Set cat status in localStorage
const setCatStatus = (catId, status) => {
  localStorage.setItem(`petStatus_${catId}`, status);
  // Dispatch event for real-time updates across components
  window.dispatchEvent(new CustomEvent('petStatusChanged', { detail: { petId: catId, status, type: 'Cat' } }));
};

// ========== CAT FUNCTIONS ==========

// Get all cats with current status from localStorage
export const getCats = () => {
  return localCats.map(cat => ({
    ...cat,
    status: getCatStatus(cat.id)
  }));
};

// Get available cats only
export const getAvailableCats = () => {
  return getCats().filter(cat => cat.status === 'Available');
};

// Get cat by ID
export const getCatById = (id) => {
  const cats = getCats();
  return cats.find(cat => cat.id === id);
};

// Get cat by name
export const getCatByName = (name) => {
  const cats = getCats();
  return cats.find(cat => cat.name.toLowerCase() === name.toLowerCase());
};

// Update cat status
export const updateCatStatus = (catId, newStatus) => {
  setCatStatus(catId, newStatus);
};

// Update cat status by name
export const updateCatStatusByName = (catName, newStatus) => {
  const cat = getCatByName(catName);
  if (cat) {
    setCatStatus(cat.id, newStatus);
    return true;
  }
  return false;
};

// ========== CUSTOM CAT FUNCTIONS (Admin) ==========

// Add new cat (stored in localStorage)
export const addCat = (catData) => {
  const customCats = JSON.parse(localStorage.getItem('petHeaven_customCats') || '[]');
  const newCat = {
    ...catData,
    id: Date.now(),
    type: 'Cat',
    status: 'Available'
  };
  customCats.push(newCat);
  localStorage.setItem('petHeaven_customCats', JSON.stringify(customCats));
  window.dispatchEvent(new CustomEvent('petDataChanged', { detail: { type: 'Cat' } }));
  return newCat;
};

// Get custom cats added by admin
export const getCustomCats = () => {
  const customCats = JSON.parse(localStorage.getItem('petHeaven_customCats') || '[]');
  return customCats.map(cat => ({
    ...cat,
    status: getCatStatus(cat.id)
  }));
};

// Get all cats including custom ones
export const getAllCatsWithCustom = () => {
  return [...getCats(), ...getCustomCats()];
};

// Delete custom cat
export const deleteCustomCat = (catId) => {
  const customCats = JSON.parse(localStorage.getItem('petHeaven_customCats') || '[]');
  const filtered = customCats.filter(c => c.id !== catId);
  localStorage.setItem('petHeaven_customCats', JSON.stringify(filtered));
  localStorage.removeItem(`petStatus_${catId}`);
  window.dispatchEvent(new CustomEvent('petDataChanged', { detail: { type: 'Cat' } }));
};

// ========== CAT STATS ==========

export const getCatStats = () => {
  const allCats = getAllCatsWithCustom();
  
  return {
    totalCats: allCats.length,
    availableCats: allCats.filter(c => c.status === 'Available').length,
    adoptedCats: allCats.filter(c => c.status === 'Adopted').length,
    pendingCats: allCats.filter(c => c.status === 'Pending').length,
    vaccinatedCats: allCats.filter(c => c.vaccinated).length,
    neuteredCats: allCats.filter(c => c.neutered).length
  };
};

// Reset all cat statuses to Available
export const resetAllCatStatuses = () => {
  getCats().forEach(cat => {
    localStorage.removeItem(`petStatus_${cat.id}`);
  });
  window.dispatchEvent(new CustomEvent('petDataChanged', { detail: { type: 'Cat' } }));
};

// Export raw data for reference
export { localCats };
