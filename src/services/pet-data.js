// Pet data for Pet Heaven website
// Combined data management - imports from cats-data.js and dogs-data.js

// ========== IMPORT FROM SEPARATE DATA FILES ==========
import { 
  getCats, 
  getAvailableCats, 
  getCatById, 
  getCatByName, 
  updateCatStatus,
  updateCatStatusByName,
  addCat, 
  getCustomCats, 
  getAllCatsWithCustom, 
  deleteCustomCat,
  getCatStats,
  resetAllCatStatuses,
  localCats 
} from './cats-data';

import { 
  getDogs, 
  getAvailableDogs, 
  getDogById, 
  getDogByName, 
  updateDogStatus,
  updateDogStatusByName,
  addDog, 
  getCustomDogs, 
  getAllDogsWithCustom, 
  deleteCustomDog,
  getDogStats,
  resetAllDogStatuses,
  localDogs 
} from './dogs-data';

// ========== RE-EXPORT INDIVIDUAL DATA FUNCTIONS ==========
export { 
  getCats, 
  getAvailableCats, 
  getCatById, 
  getCatByName,
  updateCatStatus,
  updateCatStatusByName,
  addCat, 
  getCustomCats, 
  getAllCatsWithCustom, 
  deleteCustomCat,
  getCatStats,
  resetAllCatStatuses,
  localCats 
};

export { 
  getDogs, 
  getAvailableDogs, 
  getDogById, 
  getDogByName,
  updateDogStatus,
  updateDogStatusByName,
  addDog, 
  getCustomDogs, 
  getAllDogsWithCustom, 
  deleteCustomDog,
  getDogStats,
  resetAllDogStatuses,
  localDogs 
};

// ========== COMBINED PET FUNCTIONS ==========

// Get all pets (cats + dogs)
export const getAllPets = () => {
  return [...getCats(), ...getDogs()];
};

// Get all available pets
export const getAvailablePets = () => {
  return getAllPets().filter(pet => pet.status === 'Available');
};

// Get pet by ID (any type)
export const getPetById = (id) => {
  return getAllPets().find(pet => pet.id === id);
};

// Get pet by name (any type)
export const getPetByName = (name) => {
  return getAllPets().find(pet => pet.name.toLowerCase() === name.toLowerCase());
};

// Update pet status (determines type and calls appropriate function)
export const updatePetStatus = (petId, newStatus) => {
  const pet = getPetById(petId);
  if (pet) {
    if (pet.type === 'Cat') {
      updateCatStatus(petId, newStatus);
    } else {
      updateDogStatus(petId, newStatus);
    }
  } else {
    // If not found in base data, check custom pets
    const customCats = getCustomCats();
    const customDogs = getCustomDogs();
    const customCat = customCats.find(c => c.id === petId);
    const customDog = customDogs.find(d => d.id === petId);
    
    if (customCat) {
      updateCatStatus(petId, newStatus);
    } else if (customDog) {
      updateDogStatus(petId, newStatus);
    }
  }
};

// Update pet status by name
export const updatePetStatusByName = (petName, newStatus) => {
  const pet = getPetByName(petName);
  if (pet) {
    updatePetStatus(pet.id, newStatus);
    return true;
  }
  return false;
};

// ========== TOTAL SUCCESSFUL ADOPTIONS TRACKING ==========

// Get total successful adoptions (historical count that never decreases)
export const getTotalAdoptions = () => {
  const stored = localStorage.getItem('totalSuccessfulAdoptions');
  return stored ? parseInt(stored, 10) : 0;
};

// Increment total successful adoptions
export const incrementTotalAdoptions = () => {
  const current = getTotalAdoptions();
  localStorage.setItem('totalSuccessfulAdoptions', (current + 1).toString());
  window.dispatchEvent(new CustomEvent('adoptionStatsChanged'));
  return current + 1;
};

// Reset total successful adoptions (for admin reset)
export const resetTotalAdoptions = () => {
  localStorage.removeItem('totalSuccessfulAdoptions');
  window.dispatchEvent(new CustomEvent('adoptionStatsChanged'));
};

// ========== COMBINED STATS FUNCTIONS ==========

export const getPetStats = () => {
  const catStats = getCatStats();
  const dogStats = getDogStats();
  
  return {
    totalPets: catStats.totalCats + dogStats.totalDogs,
    totalCats: catStats.totalCats,
    totalDogs: dogStats.totalDogs,
    availablePets: catStats.availableCats + dogStats.availableDogs,
    adoptedPets: catStats.adoptedCats + dogStats.adoptedDogs,  // Current adopted (can decrease when released back)
    pendingPets: catStats.pendingCats + dogStats.pendingDogs,
    availableCats: catStats.availableCats,
    availableDogs: dogStats.availableDogs,
    vaccinatedPets: catStats.vaccinatedCats + dogStats.vaccinatedDogs,
    neuteredPets: catStats.neuteredCats + dogStats.neuteredDogs,
    totalSuccessfulAdoptions: getTotalAdoptions()  // Historical total (never decreases)
  };
};

// ========== COMBINED ADMIN FUNCTIONS ==========

// Add new pet (routes to correct data file based on type)
export const addPet = (petData) => {
  if (petData.type === 'Cat') {
    return addCat(petData);
  } else {
    return addDog(petData);
  }
};

// Get all custom pets
export const getCustomPets = () => {
  return [...getCustomCats(), ...getCustomDogs()];
};

// Get all pets including custom ones
export const getAllPetsWithCustom = () => {
  return [...getAllCatsWithCustom(), ...getAllDogsWithCustom()];
};

// Delete custom pet (determines type and calls appropriate function)
export const deleteCustomPet = (petId) => {
  const customCats = getCustomCats();
  const customDogs = getCustomDogs();
  
  if (customCats.find(c => c.id === petId)) {
    deleteCustomCat(petId);
  } else if (customDogs.find(d => d.id === petId)) {
    deleteCustomDog(petId);
  }
};

// Reset all pet statuses to Available
export const resetAllPetStatuses = () => {
  resetAllCatStatuses();
  resetAllDogStatuses();
};
