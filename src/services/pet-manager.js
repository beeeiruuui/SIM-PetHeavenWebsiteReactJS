// ========== PET MANAGER - Unified Pet Data Management ==========
// This file consolidates all pet data operations in one place

// Import images - correct filenames from assets folder
import WhiskersImg from '../assets/Cats/White_Persian_Cat.jpg';
import LunaImg from '../assets/Cats/Brown_Points_Siamese_Cat.jpg';
import OliverImg from '../assets/Cats/Grey_British_Shorthair_Cat.jpg';
import MochiImg from '../assets/Cats/Tabby_Scottish_Fold_Cat.jpg';
import ShadowImg from '../assets/Cats/Black_Domestic_Shorthair_Cat.jpg';
import GingerImg from '../assets/Cats/Orange_Tabby_Maine_Coon_Cat.jpg';

import BuddyImg from '../assets/Dogs/Golden_Golden_Retriever_Dog.jpg';
import BellaImg from '../assets/Dogs/Chocolate_Labrador_Retriever_Dog.jpg';
import MaxImg from '../assets/Dogs/Black_and_Tan_German_Shepherd_Dog.jpg';
import CocoImg from '../assets/Dogs/White_Poodle_Dog.jpg';
import RockyImg from '../assets/Dogs/Brindle_Bulldog_Dog.jpg';
import DaisyImg from '../assets/Dogs/Brown_and_White_Shih_Tzu_Dog.jpg';
import CharlieImg from '../assets/Dogs/Tricolor_Beagle_Dog.jpg';
import MiloImg from '../assets/Dogs/Red_and_White_Corgi_Dog.jpg';

// ========== BASE PETS (Original Data) ==========
const BASE_CATS = [
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
    status: 'Available',
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
    status: 'Available',
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
    status: 'Available',
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
    status: 'Available',
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
    status: 'Available',
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
    status: 'Available',
    image: GingerImg
  }
];

const BASE_DOGS = [
  {
    id: 101,
    name: 'Buddy',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: '3 years',
    gender: 'Male',
    size: 'Large',
    color: 'Golden',
    personality: 'Friendly and loyal, great with families and children',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: BuddyImg
  },
  {
    id: 102,
    name: 'Bella',
    type: 'Dog',
    breed: 'Labrador Retriever',
    age: '2 years',
    gender: 'Female',
    size: 'Large',
    color: 'Chocolate',
    personality: 'Energetic and playful, loves outdoor activities',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: BellaImg
  },
  {
    id: 103,
    name: 'Max',
    type: 'Dog',
    breed: 'German Shepherd',
    age: '4 years',
    gender: 'Male',
    size: 'Large',
    color: 'Black and Tan',
    personality: 'Intelligent and protective, excellent guard dog',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: MaxImg
  },
  {
    id: 104,
    name: 'Coco',
    type: 'Dog',
    breed: 'Poodle',
    age: '1 year',
    gender: 'Female',
    size: 'Medium',
    color: 'White',
    personality: 'Smart and elegant, hypoallergenic coat',
    vaccinated: true,
    neutered: false,
    status: 'Available',
    image: CocoImg
  },
  {
    id: 105,
    name: 'Rocky',
    type: 'Dog',
    breed: 'Bulldog',
    age: '5 years',
    gender: 'Male',
    size: 'Medium',
    color: 'Brindle',
    personality: 'Calm and courageous, good for apartment living',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: RockyImg
  },
  {
    id: 106,
    name: 'Daisy',
    type: 'Dog',
    breed: 'Shih Tzu',
    age: '2 years',
    gender: 'Female',
    size: 'Small',
    color: 'Brown and White',
    personality: 'Affectionate lap dog, great companion',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: DaisyImg
  },
  {
    id: 107,
    name: 'Charlie',
    type: 'Dog',
    breed: 'Beagle',
    age: '3 years',
    gender: 'Male',
    size: 'Medium',
    color: 'Tricolor',
    personality: 'Curious and merry, loves to explore',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: CharlieImg
  },
  {
    id: 108,
    name: 'Milo',
    type: 'Dog',
    breed: 'Corgi',
    age: '2 years',
    gender: 'Male',
    size: 'Small',
    color: 'Red and White',
    personality: 'Outgoing and playful, loves to herd',
    vaccinated: true,
    neutered: true,
    status: 'Available',
    image: MiloImg
  }
];

// Storage keys
const STORAGE_KEYS = {
  CUSTOM_PETS: 'petHeaven_allCustomPets',
  PET_EDITS: 'petHeaven_petEdits',
  TOTAL_ADOPTIONS: 'petHeaven_totalAdoptions'
};

// ========== HELPER FUNCTIONS ==========

// Get all edits from localStorage
const getAllEdits = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.PET_EDITS);
  return stored ? JSON.parse(stored) : {};
};

// Save all edits to localStorage
const saveAllEdits = (edits) => {
  localStorage.setItem(STORAGE_KEYS.PET_EDITS, JSON.stringify(edits));
};

// Get edits for a specific pet
const getPetEdits = (petId) => {
  const allEdits = getAllEdits();
  return allEdits[petId] || null;
};

// Save edits for a specific pet
const savePetEdits = (petId, edits) => {
  const allEdits = getAllEdits();
  allEdits[petId] = edits;
  saveAllEdits(allEdits);
};

// Dispatch update event
const dispatchUpdate = (type = 'all') => {
  window.dispatchEvent(new CustomEvent('petDataChanged', { detail: { type } }));
};

// ========== CUSTOM PETS (Admin Added) ==========

// Get all custom pets
export const getCustomPets = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_PETS);
  return stored ? JSON.parse(stored) : [];
};

// Save custom pets
const saveCustomPets = (pets) => {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_PETS, JSON.stringify(pets));
};

// Add a new custom pet
export const addPet = (petData) => {
  const customPets = getCustomPets();
  const newPet = {
    id: Date.now(),
    name: petData.name || 'New Pet',
    breed: petData.breed || 'Mixed',
    age: petData.age || 1,
    gender: petData.gender || 'Male',
    type: petData.type || 'Cat',
    color: petData.color || '',
    personality: petData.personality || '',
    description: petData.description || '',
    status: 'Available',
    image: petData.image || `https://placehold.co/400x300/${petData.type === 'Dog' ? '87CEEB' : 'FFB6C1'}/333333?text=${petData.type || 'Pet'}+Photo`,
    isCustom: true
  };
  customPets.push(newPet);
  saveCustomPets(customPets);
  dispatchUpdate(newPet.type);
  return newPet;
};

// Delete a custom pet
export const deleteCustomPet = (petId) => {
  const customPets = getCustomPets();
  const filtered = customPets.filter(p => p.id !== petId);
  saveCustomPets(filtered);
  dispatchUpdate();
  return true;
};

// ========== GET ALL PETS (Combined) ==========

// Get all cats (base + custom, with edits applied)
export const getAllCats = () => {
  // Get base cats with edits applied
  const baseCats = BASE_CATS.map(cat => {
    const edits = getPetEdits(cat.id);
    if (edits) {
      return { ...cat, ...edits, id: cat.id, image: cat.image };
    }
    return { ...cat };
  });
  
  // Get custom cats
  const customPets = getCustomPets();
  const customCats = customPets.filter(p => p.type === 'Cat');
  
  return [...baseCats, ...customCats];
};

// Get all dogs (base + custom, with edits applied)
export const getAllDogs = () => {
  // Get base dogs with edits applied
  const baseDogs = BASE_DOGS.map(dog => {
    const edits = getPetEdits(dog.id);
    if (edits) {
      return { ...dog, ...edits, id: dog.id, image: dog.image };
    }
    return { ...dog };
  });
  
  // Get custom dogs
  const customPets = getCustomPets();
  const customDogs = customPets.filter(p => p.type === 'Dog');
  
  return [...baseDogs, ...customDogs];
};

// Get all pets combined
export const getAllPets = () => {
  return [...getAllCats(), ...getAllDogs()];
};

// Get available cats only
export const getAvailableCats = () => {
  return getAllCats().filter(cat => cat.status === 'Available');
};

// Get available dogs only
export const getAvailableDogs = () => {
  return getAllDogs().filter(dog => dog.status === 'Available');
};

// Get pet by ID
export const getPetById = (petId) => {
  const allPets = getAllPets();
  return allPets.find(p => p.id === petId);
};

// Get pet by name
export const getPetByName = (name) => {
  const allPets = getAllPets();
  return allPets.find(p => p.name.toLowerCase() === name.toLowerCase());
};

// ========== UPDATE PET ==========

// Check if pet is a base pet
export const isBasePet = (petId) => {
  return BASE_CATS.some(c => c.id === petId) || BASE_DOGS.some(d => d.id === petId);
};

// Check if pet is a custom pet
export const isCustomPet = (petId) => {
  const customPets = getCustomPets();
  return customPets.some(p => p.id === petId);
};

// Update any pet (works for both base and custom)
export const updatePet = (petId, updatedData) => {
  // Check if it's a custom pet
  if (isCustomPet(petId)) {
    const customPets = getCustomPets();
    const index = customPets.findIndex(p => p.id === petId);
    if (index !== -1) {
      // Update custom pet directly
      customPets[index] = {
        ...customPets[index],
        ...updatedData,
        id: petId, // Keep original ID
        isCustom: true
      };
      saveCustomPets(customPets);
      dispatchUpdate(updatedData.type);
      return true;
    }
    return false;
  }
  
  // It's a base pet - save edits
  if (isBasePet(petId)) {
    const { id, image, ...editableFields } = updatedData;
    savePetEdits(petId, editableFields);
    dispatchUpdate(updatedData.type);
    return true;
  }
  
  return false;
};

// Update pet status only
export const updatePetStatus = (petId, newStatus) => {
  const pet = getPetById(petId);
  if (pet) {
    return updatePet(petId, { ...pet, status: newStatus });
  }
  return false;
};

// Update pet status by name
export const updatePetStatusByName = (petName, newStatus) => {
  const pet = getPetByName(petName);
  if (pet) {
    return updatePet(pet.id, { ...pet, status: newStatus });
  }
  return false;
};

// ========== ADOPTION TRACKING ==========

// Get total successful adoptions count
export const getTotalAdoptions = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.TOTAL_ADOPTIONS);
  return stored ? parseInt(stored, 10) : 0;
};

// Increment total adoptions counter
export const incrementTotalAdoptions = () => {
  const current = getTotalAdoptions();
  localStorage.setItem(STORAGE_KEYS.TOTAL_ADOPTIONS, String(current + 1));
  return current + 1;
};

// Reset total adoptions (for testing)
export const resetTotalAdoptions = () => {
  localStorage.setItem(STORAGE_KEYS.TOTAL_ADOPTIONS, '0');
};

// ========== RESET FUNCTIONS ==========

// Reset all pet statuses to Available
export const resetAllPetStatuses = () => {
  // Reset base pet edits
  const allEdits = getAllEdits();
  for (const petId in allEdits) {
    if (allEdits[petId]) {
      allEdits[petId].status = 'Available';
    }
  }
  saveAllEdits(allEdits);
  
  // Reset custom pets status
  const customPets = getCustomPets();
  customPets.forEach(pet => {
    pet.status = 'Available';
  });
  saveCustomPets(customPets);
  
  dispatchUpdate();
};

// Reset everything (clear all custom data)
export const resetAll = () => {
  localStorage.removeItem(STORAGE_KEYS.CUSTOM_PETS);
  localStorage.removeItem(STORAGE_KEYS.PET_EDITS);
  localStorage.removeItem(STORAGE_KEYS.TOTAL_ADOPTIONS);
  dispatchUpdate();
};

// ========== LEGACY EXPORTS (for compatibility) ==========
// These maintain backwards compatibility with existing code

export const getAllCatsWithCustom = getAllCats;
export const getAllDogsWithCustom = getAllDogs;
export const getCats = getAllCats;
export const getDogs = getAllDogs;
export const getAvailablePets = () => getAllPets().filter(p => p.status === 'Available');
