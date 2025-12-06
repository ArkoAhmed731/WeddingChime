const prisma = require('../prismaClient');
const { validateCandidatePayload } = require('../utils/validateCandidate');

function normalizeDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1' || value === 1) return true;
  if (value === 'false' || value === '0' || value === 0) return false;
  return undefined;
}

function mapChildren(children = []) {
  return children
    .filter((child) => child && Object.keys(child).length)
    .map((child) => ({
      name: child.name || null,
      gender: child.gender || null,
      ageYears: toNumber(child.ageYears),
    }));
}

function mapSiblings(siblings = []) {
  return siblings
    .filter((sibling) => sibling && Object.keys(sibling).length)
    .map((sibling) => ({
      type: sibling.type,
      isElder: toBoolean(sibling.isElder),
      maritalStatusId: toNumber(sibling.maritalStatusId),
      occupationId: toNumber(sibling.occupationId),
      workplaceCountryId: toNumber(sibling.workplaceCountryId),
      workplaceCityId: toNumber(sibling.workplaceCityId),
    }));
}

function mapRelatives(relatives = []) {
  return relatives
    .filter((relative) => relative && Object.keys(relative).length)
    .map((relative) => ({
      type: relative.type,
      occupationId: toNumber(relative.occupationId),
      workplaceCountryId: toNumber(relative.workplaceCountryId),
      workplaceCityId: toNumber(relative.workplaceCityId),
    }));
}

function mapEducation(entries = []) {
  return entries
    .filter((entry) => entry && Object.keys(entry).length)
    .map((entry) => ({
      educationLevelId: toNumber(entry.educationLevelId),
      institution: entry.institution || null,
      boardOrUniversity: entry.boardOrUniversity || null,
      fieldOfStudy: entry.fieldOfStudy || null,
      result: entry.result || null,
      passingYear: toNumber(entry.passingYear),
      isOngoing: Boolean(entry.isOngoing),
    }));
}

function mapHobbies(hobbies = []) {
  return hobbies
    .filter((hobby) => hobby && Object.keys(hobby).length)
    .map((hobby) => ({
      hobbyId: toNumber(hobby.hobbyId),
      details: hobby.details || null,
    }));
}

function mapPartnerExpectation(data = {}) {
  if (!data || !Object.keys(data).length) return null;
  return {
    preferredMinAge: toNumber(data.preferredMinAge),
    preferredMaxAge: toNumber(data.preferredMaxAge),
    preferredMinHeightCm: toNumber(data.preferredMinHeightCm),
    preferredMaxHeightCm: toNumber(data.preferredMaxHeightCm),
    preferredOccupationId: toNumber(data.preferredOccupationId),
    preferredCountryId: toNumber(data.preferredCountryId),
    preferredCityId: toNumber(data.preferredCityId),
    preferredResidencyStatusId: toNumber(data.preferredResidencyStatusId),
    preferredReligiousPracticeLevelId: toNumber(data.preferredReligiousPracticeLevelId),
    preferredMaritalStatusId: toNumber(data.preferredMaritalStatusId),
    preferredEducationLevelId: toNumber(data.preferredEducationLevelId),
    preferredFamilyFinancialStatusId: toNumber(data.preferredFamilyFinancialStatusId),
    preferredFamilyTypeId: toNumber(data.preferredFamilyTypeId),
    acceptDivorceeWithChildren: toBoolean(data.acceptDivorceeWithChildren),
    expectationNotes: data.expectationNotes || null,
  };
}

const validFileTypes = new Set(['PROFILE_PHOTO', 'ADDITIONAL_PHOTO', 'NID_OR_PASSPORT', 'OTHER']);

function mapFiles(files = []) {
  return files
    .filter((file) => file && Object.keys(file).length)
    .map((file) => ({
      fileType: validFileTypes.has(file.fileType) ? file.fileType : 'OTHER',
      path: file.path,
      originalName: file.originalName || null,
      mimeType: file.mimeType || null,
    }));
}

async function createCandidate(req, res) {
  const payload = req.body;
  const errors = validateCandidatePayload(payload);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const {
    children = [],
    siblings = [],
    maternalRelatives = [],
    paternalRelatives = [],
    educationEntries = [],
    hobbies = [],
    partnerExpectation,
    files = [],
    ...candidateFields
  } = payload;

  const candidateData = {
    ...candidateFields,
    heightCm: toNumber(candidateFields.heightCm ?? candidateFields.height),
    weightKg: toNumber(candidateFields.weightKg ?? candidateFields.weight),
    bloodGroupId: toNumber(candidateFields.bloodGroupId),
    religionId: toNumber(candidateFields.religionId),
    casteId: toNumber(candidateFields.casteId),
    maritalStatusId: toNumber(candidateFields.maritalStatusId),
    highestEducationLevelId: toNumber(candidateFields.highestEducationLevelId),
    occupationId: toNumber(candidateFields.occupationId),
    incomeRangeId: toNumber(candidateFields.incomeRangeId),
    residencyStatusId: toNumber(candidateFields.residencyStatusId),
    birthCountryId: toNumber(candidateFields.birthCountryId),
    birthCityId: toNumber(candidateFields.birthCityId),
    currentCountryId: toNumber(candidateFields.currentCountryId),
    currentCityId: toNumber(candidateFields.currentCityId),
    workplaceCountryId: toNumber(candidateFields.workplaceCountryId),
    workplaceCityId: toNumber(candidateFields.workplaceCityId),
    familyFinancialStatusId: toNumber(candidateFields.familyFinancialStatusId),
    familyTypeId: toNumber(candidateFields.familyTypeId),
    smokingHabitId: toNumber(candidateFields.smokingHabitId),
    drinkingHabitId: toNumber(candidateFields.drinkingHabitId),
    dateOfBirth: normalizeDate(candidateFields.dateOfBirth),
  };

  const mappedChildren = mapChildren(children);
  const mappedSiblings = mapSiblings(siblings);
  const mappedMaternal = mapRelatives(maternalRelatives);
  const mappedPaternal = mapRelatives(paternalRelatives);
  const mappedEducation = mapEducation(educationEntries);
  const mappedHobbies = mapHobbies(hobbies);
  const mappedPartnerExpectation = mapPartnerExpectation(partnerExpectation);
  const mappedFiles = mapFiles(files);

  try {
    const candidateId = await prisma.$transaction(async (tx) => {
      const candidate = await tx.candidate.create({ data: candidateData });

      if (mappedChildren.length) {
        await tx.candidateChild.createMany({
          data: mappedChildren.map((child) => ({
            ...child,
            candidateId: candidate.id,
          })),
        });
      }

      if (mappedSiblings.length) {
        await tx.candidateSibling.createMany({
          data: mappedSiblings.map((sibling) => ({
            ...sibling,
            candidateId: candidate.id,
          })),
        });
      }

      if (mappedMaternal.length) {
        await tx.candidateMaternalRelative.createMany({
          data: mappedMaternal.map((relative) => ({
            ...relative,
            candidateId: candidate.id,
          })),
        });
      }

      if (mappedPaternal.length) {
        await tx.candidatePaternalRelative.createMany({
          data: mappedPaternal.map((relative) => ({
            ...relative,
            candidateId: candidate.id,
          })),
        });
      }

      if (mappedEducation.length) {
        await tx.candidateEducationEntry.createMany({
          data: mappedEducation.map((entry) => ({
            ...entry,
            candidateId: candidate.id,
          })),
        });
      }

      if (mappedHobbies.length) {
        await tx.candidateHobby.createMany({
          data: mappedHobbies.map((hobby) => ({
            ...hobby,
            candidateId: candidate.id,
          })),
        });
      }

      if (mappedPartnerExpectation) {
        await tx.candidatePartnerExpectation.create({
          data: {
            ...mappedPartnerExpectation,
            candidateId: candidate.id,
          },
        });
      }

      if (mappedFiles.length) {
        await tx.candidateFile.createMany({
          data: mappedFiles.map((file) => ({ ...file, candidateId: candidate.id })),
        });
      }

      return candidate.id;
    });

    res.status(201).json({ id: candidateId });
  } catch (error) {
    console.error('Error creating candidate', error);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
}

module.exports = { createCandidate };
