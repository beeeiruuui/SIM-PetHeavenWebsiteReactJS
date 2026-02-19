// Dog data for Pet Heaven website
// Centralized dog data with localStorage for status tracking

// ========== IMPORT DOG IMAGES ==========
import BuddyImg from '../assets/Dogs/Golden_Golden_Retriever_Dog.jpg';
import BellaImg from '../assets/Dogs/Chocolate_Labrador_Retriever_Dog.jpg';
import MaxImg from '../assets/Dogs/Black_and_Tan_German_Shepherd_Dog.jpg';
import CocoImg from '../assets/Dogs/White_Poodle_Dog.jpg';
import RockyImg from '../assets/Dogs/Brindle_Bulldog_Dog.jpg';
import DaisyImg from '../assets/Dogs/Brown_and_White_Shih_Tzu_Dog.jpg';
import CharlieImg from '../assets/Dogs/Tricolor_Beagle_Dog.jpg';
import MiloImg from '../assets/Dogs/Red_and_White_Corgi_Dog.jpg';

// ========== DOG DATA ==========
const localDogs = [
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
    image: CharlieImg
  },
  {
    id: 108,
    name: 'Milo',
    type: 'Dog',
    breed: 'Corgi',
    age: '1 year',
    gender: 'Male',
    size: 'Small',
    color: 'Red and White',
    personality: 'Playful and outgoing, loves attention',
    vaccinated: true,
    neutered: false,
    image: MiloImg
  }
];

// ========== HELPER FUNCTIONS ==========

// Get pet status from localStorage (default: 'Available')
const getDogStatus = (dogId) => {
  const stored = localStorage.getItem(`petStatus_${dogId}`);
  return stored || 'Available';
};

// Set dog status in localStorage
const setDogStatus = (dogId, status) => {
  localStorage.setItem(`petStatus_${dogId}`, status);
  // Dispatch event for real-time updates across components
  window.dispatchEvent(new CustomEvent('petStatusChanged', { detail: { petId: dogId, status, type: 'Dog' } }));
};

// Get base dog edits from localStorage
const getBaseDogEdits = (dogId) => {
  const stored = localStorage.getItem(`petEdits_${dogId}`);
  return stored ? JSON.parse(stored) : null;
};

// Set base dog edits in localStorage
const setBaseDogEdits = (dogId, edits) => {
  localStorage.setItem(`petEdits_${dogId}`, JSON.stringify(edits));
  window.dispatchEvent(new CustomEvent('petDataChanged', { detail: { type: 'Dog' } }));
};

// ========== DOG FUNCTIONS ==========

// Get all dogs with current status and edits from localStorage
export const getDogs = () => {
  return localDogs.map(dog => {
    const edits = getBaseDogEdits(dog.id);
    return {
      ...dog,
      ...(edits || {}),
      id: dog.id, // Ensure ID is never overwritten
      status: getDogStatus(dog.id)
    };
  });
};

// Get available dogs only
export const getAvailableDogs = () => {
  return getDogs().filter(dog => dog.status === 'Available');
};

// Get dog by ID
export const getDogById = (id) => {
  const dogs = getDogs();
  return dogs.find(dog => dog.id === id);
};

// Get dog by name
export const getDogByName = (name) => {
  const dogs = getDogs();
  return dogs.find(dog => dog.name.toLowerCase() === name.toLowerCase());
};

// Update dog status
export const updateDogStatus = (dogId, newStatus) => {
  setDogStatus(dogId, newStatus);
};

// Update dog status by name
export const updateDogStatusByName = (dogName, newStatus) => {
  const dog = getDogByName(dogName);
  if (dog) {
    setDogStatus(dog.id, newStatus);
    return true;
  }
  return false;
};
// Update base dog data (name, breed, age, color, gender, type, etc.)
export const updateBaseDog = (dogId, updatedData) => {
  // Check if this is a base dog
  const baseDog = localDogs.find(d => d.id === dogId);
  if (baseDog) {
    // Store ALL edits (excluding only id which must stay fixed)
    const { id, ...editableFields } = updatedData;
    setBaseDogEdits(dogId, editableFields);
    if (updatedData.status) {
      setDogStatus(dogId, updatedData.status);
    }
    return true;
  }
  return false;
};

// Check if dog is a base dog
export const isBaseDog = (dogId) => {
  return localDogs.some(d => d.id === dogId);
};
// ========== CUSTOM DOG FUNCTIONS (Admin) ==========

// Add new dog (stored in localStorage)
export const addDog = (dogData) => {
  const customDogs = JSON.parse(localStorage.getItem('petHeaven_customDogs') || '[]');
  const newDog = {
    ...dogData,
    id: Date.now(),
    type: 'Dog',
    status: 'Available',
    image: dogData.image || 'https://placehold.co/400x300/FFB6C1/333333?text=Dog+Photo'
  };
  customDogs.push(newDog);
  localStorage.setItem('petHeaven_customDogs', JSON.stringify(customDogs));
  window.dispatchEvent(new CustomEvent('petDataChanged', { detail: { type: 'Dog' } }));
  return newDog;
};

// Get custom dogs added by admin
export const getCustomDogs = () => {
  const customDogs = JSON.parse(localStorage.getItem('petHeaven_customDogs') || '[]');
  return customDogs.map(dog => ({
    ...dog,
    status: getDogStatus(dog.id)
  }));
};

// Get all dogs including custom ones
export const getAllDogsWithCustom = () => {
  return [...getDogs(), ...getCustomDogs()];
};

// Delete custom dog
export const deleteCustomDog = (dogId) => {
  const customDogs = JSON.parse(localStorage.getItem('petHeaven_customDogs') || '[]');
  const filtered = customDogs.filter(d => d.id !== dogId);
  localStorage.setItem('petHeaven_customDogs', JSON.stringify(filtered));
  localStorage.removeItem(`petStatus_${dogId}`);
  window.dispatchEvent(new CustomEvent('petDataChanged', { detail: { type: 'Dog' } }));
};

// Update custom dog data
export const updateCustomDog = (dogId, updatedData) => {
  const customDogs = JSON.parse(localStorage.getItem('petHeaven_customDogs') || '[]');
  const index = customDogs.findIndex(d => d.id === dogId);
  if (index !== -1) {
    customDogs[index] = { ...customDogs[index], ...updatedData, id: dogId, type: 'Dog' };
    localStorage.setItem('petHeaven_customDogs', JSON.stringify(customDogs));
    if (updatedData.status) {
      setDogStatus(dogId, updatedData.status);
    }
    window.dispatchEvent(new CustomEvent('petDataChanged', { detail: { type: 'Dog' } }));
    return true;
  }
  return false;
};

// ========== DOG STATS ==========

export const getDogStats = () => {
  const allDogs = getAllDogsWithCustom();
  
  return {
    totalDogs: allDogs.length,
    availableDogs: allDogs.filter(d => d.status === 'Available').length,
    adoptedDogs: allDogs.filter(d => d.status === 'Adopted').length,
    pendingDogs: allDogs.filter(d => d.status === 'Pending').length,
    vaccinatedDogs: allDogs.filter(d => d.vaccinated).length,
    neuteredDogs: allDogs.filter(d => d.neutered).length
  };
};

// Reset all dog statuses to Available
export const resetAllDogStatuses = () => {
  getDogs().forEach(dog => {
    localStorage.removeItem(`petStatus_${dog.id}`);
  });
  window.dispatchEvent(new CustomEvent('petDataChanged', { detail: { type: 'Dog' } }));
};

// Export raw data for reference
export { localDogs };
