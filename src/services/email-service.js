// Fixed admin email that receives all form submissions
const ADMIN_EMAIL = 'beeeiruuui@gmail.com';

/**
 * Open email client with adoption form data
 * @param {Object} formData - The adoption form data
 * @returns {Object} - Success status
 */
export const sendAdoptionEmail = (formData) => {
  const subject = encodeURIComponent(`[Pet Heaven] Adoption Request - ${formData.petName}`);
  
  const body = encodeURIComponent(
`PET ADOPTION REQUEST
====================

APPLICANT INFORMATION
---------------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}

PET INFORMATION
---------------
Pet Name: ${formData.petName}
Pet Type: ${formData.petType || 'Not specified'}

ADOPTION DETAILS
----------------
Reason for Adoption: ${formData.reason}
Pet Experience: ${formData.experience || 'Not specified'}
Housing Type: ${formData.housing}
Has Other Pets: ${formData.hasOtherPets}
Other Pets Details: ${formData.otherPetsDetails || 'N/A'}

Submitted: ${new Date().toLocaleString('en-SG')}
`);

  const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
  
  window.open(mailtoLink, '_blank');
  
  console.log('Adoption email client opened');
  return { success: true };
};

/**
 * Open email client with release form data
 * @param {Object} formData - The release form data
 * @returns {Object} - Success status
 */
export const sendReleaseEmail = (formData) => {
  const subject = encodeURIComponent(`[Pet Heaven] Pet Release Request - ${formData.petName}`);
  
  const body = encodeURIComponent(
`PET RELEASE REQUEST
====================

OWNER INFORMATION
-----------------
Name: ${formData.ownerName}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address || 'Not provided'}

PET INFORMATION
---------------
Pet Name: ${formData.petName}
Pet Type: ${formData.petType}
Breed: ${formData.petBreed}
Age: ${formData.petAge}
Gender: ${formData.petGender}
Vaccinated: ${formData.isVaccinated}
Neutered/Spayed: ${formData.isNeutered}

ADDITIONAL DETAILS
------------------
Health Condition: ${formData.healthCondition || 'No known issues'}
Personality: ${formData.personality || 'Not provided'}
Reason for Release: ${formData.reason}
Urgency: ${formData.urgency}

Submitted: ${new Date().toLocaleString('en-SG')}
`);

  const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
  
  window.open(mailtoLink, '_blank');
  
  console.log('Release email client opened');
  return { success: true };
};

// Export admin email for reference
export { ADMIN_EMAIL };
