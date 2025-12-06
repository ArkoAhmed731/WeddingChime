function isPresent(value) {
  return value !== undefined && value !== null && `${value}`.trim() !== '';
}

function isValidDate(value) {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

function validateCandidatePayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return ['Payload must be an object'];
  }

  if (!isPresent(payload.fullName)) errors.push('fullName is required');
  if (!isPresent(payload.gender)) errors.push('gender is required');
  if (!isPresent(payload.dateOfBirth)) errors.push('dateOfBirth is required');
  if (payload.dateOfBirth && !isValidDate(payload.dateOfBirth)) errors.push('dateOfBirth must be a valid date');
  if (!isPresent(payload.religionId)) errors.push('religionId is required');
  if (!isPresent(payload.maritalStatusId)) errors.push('maritalStatusId is required');
  if (!isPresent(payload.highestEducationLevelId)) errors.push('highestEducationLevelId is required');
  if (!isPresent(payload.occupationType)) errors.push('occupationType is required');
  if (!isPresent(payload.residencyStatusId)) errors.push('residencyStatusId is required');
  if (!isPresent(payload.currentCountryId)) errors.push('currentCountryId is required');
  if (!isPresent(payload.currentCityId)) errors.push('currentCityId is required');
  if (!isPresent(payload.primaryContactNumber)) errors.push('primaryContactNumber is required');

  return errors;
}

module.exports = { validateCandidatePayload };
