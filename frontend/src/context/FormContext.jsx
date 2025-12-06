import React, { createContext, useContext, useMemo, useState } from 'react';
import axios from 'axios';

const FormContext = createContext();

const initialData = {
  personalInfo: {
    fullName: '',
    gender: '',
    dateOfBirth: '',
    heightCm: '',
    weightKg: '',
    bloodGroupId: '',
  },
  religiousMarital: {
    religionId: '',
    casteId: '',
    maritalStatusId: '',
    numberOfChildren: 0,
    hasChildren: false,
  },
  residency: {
    birthCountryId: '',
    birthCityId: '',
    currentCountryId: '',
    currentCityId: '',
    residencyStatusId: '',
  },
  education: {
    highestEducationLevelId: '',
    educationEntries: [],
  },
  occupation: {
    occupationType: '',
    occupationId: '',
    incomeRangeId: '',
    workplaceCountryId: '',
    workplaceCityId: '',
  },
  familyInfo: {
    familyFinancialStatusId: '',
    familyTypeId: '',
    siblings: [],
    children: [],
  },
  extendedFamily: {
    maternalRelatives: [],
    paternalRelatives: [],
  },
  habits: {
    smokingHabitId: '',
    drinkingHabitId: '',
    hobbies: [],
  },
  partnerExpectations: {
    preferredMinAge: '',
    preferredMaxAge: '',
    preferredOccupationId: '',
    preferredCountryId: '',
    preferredCityId: '',
    preferredResidencyStatusId: '',
    preferredMaritalStatusId: '',
    preferredEducationLevelId: '',
    expectationNotes: '',
  },
  about: {
    aboutMe: '',
    primaryContactNumber: '',
    whatsappNumber: '',
    contactEmail: '',
  },
  files: {
    profilePhoto: null,
    nidPassport: null,
    biodataDoc: null,
  },
};

const API_BASE = 'http://localhost:4000/api';

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1' || value === 1) return true;
  if (value === 'false' || value === '0' || value === 0) return false;
  return undefined;
};

export function FormProvider({ children }) {
  const [formData, setFormData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const totalSteps = 12;

  const updateSection = (section, values) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...values },
    }));
  };

  const setSection = (section, values) => {
    setFormData((prev) => ({
      ...prev,
      [section]: values,
    }));
  };

  const nextStep = () => setCurrentStep((s) => Math.min(totalSteps - 1, s + 1));
  const prevStep = () => setCurrentStep((s) => Math.max(0, s - 1));

  const uploadFile = async (endpoint, file) => {
    if (!file) return null;
    const payload = new FormData();
    payload.append('file', file);
    const response = await axios.post(`${API_BASE}/uploads/${endpoint}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  };

  const buildPayload = (data, uploadResults = {}) => {
    const childrenPayload = data.religiousMarital.hasChildren
      ? data.familyInfo.children.map((child) => ({
          name: child.name,
          gender: child.gender,
          ageYears: toNumber(child.ageYears),
        }))
      : [];

    const educationEntries = data.education.educationEntries.map((entry) => ({
      educationLevelId: toNumber(entry.educationLevelId) || undefined,
      institution: entry.institution,
      boardOrUniversity: entry.boardOrUniversity,
      fieldOfStudy: entry.fieldOfStudy,
      result: entry.result,
      passingYear: entry.passingYear ? Number(entry.passingYear) : undefined,
      isOngoing: Boolean(entry.isOngoing),
    }));

    const siblings = data.familyInfo.siblings.map((sibling) => ({
      type: sibling.type,
      isElder: toBoolean(sibling.isElder),
      maritalStatusId: toNumber(sibling.maritalStatusId),
      occupationId: toNumber(sibling.occupationId),
      workplaceCountryId: toNumber(sibling.workplaceCountryId),
      workplaceCityId: toNumber(sibling.workplaceCityId),
    }));

    const relativesMapper = (list = []) =>
      list.map((relative) => ({
        type: relative.type,
        occupationId: toNumber(relative.occupationId),
        workplaceCountryId: toNumber(relative.workplaceCountryId),
        workplaceCityId: toNumber(relative.workplaceCityId),
      }));

    const hobbies = data.habits.hobbies.map((hobby) => ({
      hobbyId: toNumber(hobby.hobbyId ?? hobby.value ?? hobby.id ?? hobby),
      details: hobby.details,
    }));

    const partnerExpectation = {
      preferredMinAge: toNumber(data.partnerExpectations.preferredMinAge),
      preferredMaxAge: toNumber(data.partnerExpectations.preferredMaxAge),
      preferredOccupationId: toNumber(data.partnerExpectations.preferredOccupationId),
      preferredCountryId: toNumber(data.partnerExpectations.preferredCountryId),
      preferredCityId: toNumber(data.partnerExpectations.preferredCityId),
      preferredResidencyStatusId: toNumber(data.partnerExpectations.preferredResidencyStatusId),
      preferredMaritalStatusId: toNumber(data.partnerExpectations.preferredMaritalStatusId),
      preferredEducationLevelId: toNumber(data.partnerExpectations.preferredEducationLevelId),
      expectationNotes: data.partnerExpectations.expectationNotes,
    };

    const files = Object.entries(uploadResults)
      .filter(([, value]) => !!value)
      .map(([key, value]) => ({
        fileType: key.toUpperCase(),
        path: value.path || value.filePath,
        originalName: value.originalName || value.filename,
        mimeType: value.mimeType,
      }));

    return {
      fullName: data.personalInfo.fullName,
      gender: data.personalInfo.gender,
      dateOfBirth: data.personalInfo.dateOfBirth,
      heightCm: toNumber(data.personalInfo.heightCm),
      weightKg: toNumber(data.personalInfo.weightKg),
      bloodGroupId: toNumber(data.personalInfo.bloodGroupId),
      religionId: toNumber(data.religiousMarital.religionId) || undefined,
      casteId: data.religiousMarital.casteId ? Number(data.religiousMarital.casteId) : undefined,
      maritalStatusId: toNumber(data.religiousMarital.maritalStatusId) || undefined,
      highestEducationLevelId: toNumber(data.education.highestEducationLevelId) || undefined,
      occupationType: data.occupation.occupationType,
      occupationId: data.occupation.occupationId ? Number(data.occupation.occupationId) : undefined,
      residencyStatusId: Number(data.residency.residencyStatusId) || undefined,
      currentCountryId: Number(data.residency.currentCountryId) || undefined,
      currentCityId: Number(data.residency.currentCityId) || undefined,
      birthCountryId: toNumber(data.residency.birthCountryId),
      birthCityId: toNumber(data.residency.birthCityId),
      incomeRangeId: data.occupation.incomeRangeId ? Number(data.occupation.incomeRangeId) : undefined,
      familyFinancialStatusId: data.familyInfo.familyFinancialStatusId
        ? Number(data.familyInfo.familyFinancialStatusId)
        : undefined,
      familyTypeId: data.familyInfo.familyTypeId ? Number(data.familyInfo.familyTypeId) : undefined,
      smokingHabitId: data.habits.smokingHabitId ? Number(data.habits.smokingHabitId) : undefined,
      drinkingHabitId: data.habits.drinkingHabitId ? Number(data.habits.drinkingHabitId) : undefined,
      workplaceCountryId: toNumber(data.occupation.workplaceCountryId),
      workplaceCityId: toNumber(data.occupation.workplaceCityId),
      primaryContactNumber: data.about.primaryContactNumber,
      whatsappNumber: data.about.whatsappNumber,
      contactEmail: data.about.contactEmail,
      aboutMe: data.about.aboutMe,
      children: childrenPayload,
      siblings,
      maternalRelatives: relativesMapper(data.extendedFamily.maternalRelatives),
      paternalRelatives: relativesMapper(data.extendedFamily.paternalRelatives),
      educationEntries,
      hobbies,
      partnerExpectation,
      files,
    };
  };

  const submitForm = async () => {
    setSubmitting(true);
    try {
      const uploads = {};
      if (formData.files.profilePhoto) {
        uploads.profile_photo = await uploadFile('profile-photo', formData.files.profilePhoto);
      }
      if (formData.files.nidPassport) {
        uploads.nid_passport = await uploadFile('nid-passport', formData.files.nidPassport);
      }
      if (formData.files.biodataDoc) {
        uploads.biodata_doc = await uploadFile('biodata-doc', formData.files.biodataDoc);
      }
      const payload = buildPayload(formData, uploads);
      const response = await axios.post(`${API_BASE}/candidates`, payload);
      setSubmittedId(response.data?.id || null);
      return response.data;
    } finally {
      setSubmitting(false);
    }
  };

  const value = useMemo(
    () => ({
      formData,
      setFormData,
      updateSection,
      setSection,
      currentStep,
      totalSteps,
      nextStep,
      prevStep,
      submitForm,
      submitting,
      submittedId,
    }),
    [formData, currentStep, submitting, submittedId]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export const useFormContext = () => useContext(FormContext);
