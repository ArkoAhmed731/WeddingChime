/**
 * @typedef {Object} CandidateChild
 * @property {string} [name]
 * @property {string} [gender]
 * @property {number|string} [ageYears]
 *
 * @typedef {Object} CandidateSibling
 * @property {'BROTHER'|'SISTER'} type
 * @property {boolean|string|number} [isElder]
 * @property {number|string} [maritalStatusId]
 * @property {number|string} [occupationId]
 * @property {number|string} [workplaceCountryId]
 * @property {number|string} [workplaceCityId]
 *
 * @typedef {Object} CandidateRelative
 * @property {'UNCLE'|'AUNT'} type
 * @property {number|string} [occupationId]
 * @property {number|string} [workplaceCountryId]
 * @property {number|string} [workplaceCityId]
 *
 * @typedef {Object} CandidateEducationEntry
 * @property {number|string} educationLevelId
 * @property {string} [institution]
 * @property {string} [boardOrUniversity]
 * @property {string} [fieldOfStudy]
 * @property {string} [result]
 * @property {number|string} [passingYear]
 * @property {boolean} [isOngoing]
 *
 * @typedef {Object} CandidateFilePayload
 * @property {'PROFILE_PHOTO'|'ADDITIONAL_PHOTO'|'NID_OR_PASSPORT'|'OTHER'} fileType
 * @property {string} path
 * @property {string} [originalName]
 * @property {string} [mimeType]
 *
 * @typedef {Object} CandidatePartnerExpectation
 * @property {number|string} [preferredMinAge]
 * @property {number|string} [preferredMaxAge]
 * @property {number|string} [preferredMinHeightCm]
 * @property {number|string} [preferredMaxHeightCm]
 * @property {number|string} [preferredOccupationId]
 * @property {number|string} [preferredCountryId]
 * @property {number|string} [preferredCityId]
 * @property {number|string} [preferredResidencyStatusId]
 * @property {number|string} [preferredReligiousPracticeLevelId]
 * @property {number|string} [preferredMaritalStatusId]
 * @property {number|string} [preferredEducationLevelId]
 * @property {number|string} [preferredFamilyFinancialStatusId]
 * @property {number|string} [preferredFamilyTypeId]
 * @property {boolean|string|number} [acceptDivorceeWithChildren]
 * @property {string} [expectationNotes]
 *
 * @typedef {Object} CandidatePayload
 * @property {string} fullName
 * @property {string} gender
 * @property {string|Date} dateOfBirth
 * @property {number|string} religionId
 * @property {number|string} maritalStatusId
 * @property {number|string} highestEducationLevelId
 * @property {string} occupationType
 * @property {number|string} residencyStatusId
 * @property {number|string} currentCountryId
 * @property {number|string} currentCityId
 * @property {string} primaryContactNumber
 * @property {string} [whatsappNumber]
 * @property {string} [contactEmail]
 * @property {string} [aboutMe]
 * @property {number|string} [bloodGroupId]
 * @property {number|string} [occupationId]
 * @property {number|string} [incomeRangeId]
 * @property {number|string} [familyFinancialStatusId]
 * @property {number|string} [familyTypeId]
 * @property {number|string} [smokingHabitId]
 * @property {number|string} [drinkingHabitId]
 * @property {number|string} [birthCountryId]
 * @property {number|string} [birthCityId]
 * @property {number|string} [workplaceCountryId]
 * @property {number|string} [workplaceCityId]
 * @property {number|string} [casteId]
 * @property {number|string} [heightCm]
 * @property {number|string} [weightKg]
 * @property {Array<CandidateChild>} [children]
 * @property {Array<CandidateSibling>} [siblings]
 * @property {Array<CandidateRelative>} [maternalRelatives]
 * @property {Array<CandidateRelative>} [paternalRelatives]
 * @property {Array<CandidateEducationEntry>} [educationEntries]
 * @property {Array<{hobbyId:number|string, details?:string}>} [hobbies]
 * @property {CandidatePartnerExpectation} [partnerExpectation]
 * @property {Array<CandidateFilePayload>} [files]
 */

/**
 * Example payload shape for POST /api/candidates
 * @type {CandidatePayload}
 */
const exampleCandidatePayload = {
  fullName: 'John Doe',
  gender: 'Male',
  dateOfBirth: '1992-05-10',
  religionId: 1,
  casteId: 1,
  maritalStatusId: 2,
  highestEducationLevelId: 4,
  occupationType: 'Service',
  occupationId: 2,
  residencyStatusId: 1,
  currentCountryId: 1,
  currentCityId: 1,
  birthCountryId: 1,
  birthCityId: 2,
  incomeRangeId: 1,
  familyFinancialStatusId: 1,
  familyTypeId: 1,
  smokingHabitId: 1,
  drinkingHabitId: 2,
  primaryContactNumber: '+8801XXXXXXXXX',
  whatsappNumber: '+8801XXXXXXXXX',
  contactEmail: 'john@example.com',
  aboutMe: 'Short bio here',
  heightCm: 178,
  weightKg: 70,
  children: [
    { name: 'Child One', gender: 'Female', ageYears: 3 },
  ],
  siblings: [
    {
      type: 'BROTHER',
      isElder: true,
      maritalStatusId: 1,
      occupationId: 2,
      workplaceCountryId: 1,
      workplaceCityId: 1,
    },
  ],
  maternalRelatives: [
    { type: 'UNCLE', occupationId: 1, workplaceCountryId: 1, workplaceCityId: 1 },
  ],
  paternalRelatives: [{ type: 'AUNT', occupationId: 2 }],
  educationEntries: [
    {
      educationLevelId: 4,
      institution: 'University of Dhaka',
      fieldOfStudy: 'CSE',
      result: 'CGPA 3.8',
      passingYear: 2015,
    },
  ],
  hobbies: [
    {
      hobbyId: 1,
      details: 'Reading and hiking',
    },
  ],
  partnerExpectation: {
    preferredMinAge: 22,
    preferredMaxAge: 28,
    preferredOccupationId: 2,
    preferredCountryId: 1,
    preferredCityId: 1,
    preferredResidencyStatusId: 1,
    preferredReligiousPracticeLevelId: 1,
    preferredMaritalStatusId: 1,
    preferredEducationLevelId: 3,
    preferredFamilyFinancialStatusId: 1,
    preferredFamilyTypeId: 1,
    acceptDivorceeWithChildren: false,
    expectationNotes: 'Looking for someone caring and educated',
  },
  files: [
    {
      fileType: 'PROFILE_PHOTO',
      path: 'uploads/sample.jpg',
      originalName: 'sample.jpg',
      mimeType: 'image/jpeg',
    },
  ],
};

module.exports = { exampleCandidatePayload };
