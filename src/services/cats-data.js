// Cat data for Pet Heaven website
// Centralized cat data with localStorage for status tracking

// ========== IMPORT CAT IMAGES ==========
import WhiskersImg from '../assets/Cats/White_Persian_Cat.jpg';
import LunaImg from '../assets/Cats/Brown_Points_Siamese_Cat.jpg';
import OliverImg from '../assets/Cats/Grey_British_Shorthair_Cat.jpg';
import MochiImg from '../assets/Cats/Tabby_Scottish_Fold_Cat.jpg';
import ShadowImg from '../assets/Cats/Black_Domestic_Shorthair_Cat.jpg';
import GingerImg from '../assets/Cats/Orange_Tabby_Maine_Coon_Cat.jpg';

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
    image: WhiskersImg
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
    image: LunaImg
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
    image: OliverImg
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
    image: MochiImg
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
    image: ShadowImg
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
    image: GingerImg
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

// Get base cat edits from localStorage
const getBaseCatEdits = (catId) => {
  const stored = localStorage.getItem(`petEdits_${catId}`);
  return stored ? JSON.parse(stored) : null;
};

// Set base cat edits in localStorage
const setBaseCatEdits = (catId, edits) => {
  localStorage.setItem(`petEdits_${catId}`, JSON.stringify(edits));
  window.dispatchEvent(new CustomEvent('petDataChanged', { detail: { type: 'Cat' } }));
};

// ========== CAT FUNCTIONS ==========

// Get all cats with current status and edits from localStorage
export const getCats = () => {
  return localCats.map(cat => {
    const edits = getBaseCatEdits(cat.id);
    return {
      ...cat,
      ...(edits || {}),
      id: cat.id, // Ensure ID is never overwritten
      status: getCatStatus(cat.id)
    };
  });
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

// Update base cat data (name, breed, age, color, gender, type, etc.)
export const updateBaseCat = (catId, updatedData) => {
  // Check if this is a base cat
  const baseCat = localCats.find(c => c.id === catId);
  if (baseCat) {
    // Store ALL edits (excluding only id which must stay fixed)
    const { id, ...editableFields } = updatedData;
    setBaseCatEdits(catId, editableFields);
    if (updatedData.status) {
      setCatStatus(catId, updatedData.status);
    }
    return true;
  }
  return false;
};

// Check if cat is a base cat
export const isBaseCat = (catId) => {
  return localCats.some(c => c.id === catId);
};

// ========== CUSTOM CAT FUNCTIONS (Admin) ==========

// Add new cat (stored in localStorage)
export const addCat = (catData) => {
  const customCats = JSON.parse(localStorage.getItem('petHeaven_customCats') || '[]');
  const newCat = {
    ...catData,
    id: Date.now(),
    type: 'Cat',
    status: 'Available',
    image: catData.image || 'https://placehold.co/400x300/FFB6C1/333333?text=Cat+Photo'
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

// Update custom cat data
export const updateCustomCat = (catId, updatedData) => {
  const customCats = JSON.parse(localStorage.getItem('petHeaven_customCats') || '[]');
  const index = customCats.findIndex(c => c.id === catId);
  if (index !== -1) {
    customCats[index] = { ...customCats[index], ...updatedData, id: catId, type: 'Cat' };
    localStorage.setItem('petHeaven_customCats', JSON.stringify(customCats));
    if (updatedData.status) {
      setCatStatus(catId, updatedData.status);
    }
    window.dispatchEvent(new CustomEvent('petDataChanged', { detail: { type: 'Cat' } }));
    return true;
  }
  return false;
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
