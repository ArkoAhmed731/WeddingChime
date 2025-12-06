const request = require('supertest');

jest.mock('../src/prismaClient', () => {
  const mock = {
    country: { findMany: jest.fn() },
    city: { findMany: jest.fn() },
    occupation: { findMany: jest.fn() },
    incomeRange: { findMany: jest.fn() },
    religion: { findMany: jest.fn() },
    caste: { findMany: jest.fn() },
    religiousPracticeLevel: { findMany: jest.fn() },
    familyFinancialStatus: { findMany: jest.fn() },
    familyType: { findMany: jest.fn() },
    smokingHabit: { findMany: jest.fn() },
    drinkingHabit: { findMany: jest.fn() },
    educationLevel: { findMany: jest.fn() },
    residencyStatus: { findMany: jest.fn() },
    maritalStatus: { findMany: jest.fn() },
    bloodGroup: { findMany: jest.fn() },
    hobby: { findMany: jest.fn() },
    candidate: { create: jest.fn() },
    candidateChild: { createMany: jest.fn() },
    candidateSibling: { createMany: jest.fn() },
    candidateMaternalRelative: { createMany: jest.fn() },
    candidatePaternalRelative: { createMany: jest.fn() },
    candidateEducationEntry: { createMany: jest.fn() },
    candidateHobby: { createMany: jest.fn() },
    candidatePartnerExpectation: { create: jest.fn() },
    candidateFile: { createMany: jest.fn() },
  };
  mock.$transaction = jest.fn(async (cb) => cb(mock));
  return mock;
});

const prisma = require('../src/prismaClient');
const { createApp } = require('../src/app');

const app = createApp();

describe('API smoke tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/dropdowns/countries returns mapped data', async () => {
    prisma.country.findMany.mockResolvedValue([
      { id: 1, name: 'Bangladesh', nameBn: 'বাংলাদেশ' },
      { id: 2, name: 'USA', nameBn: 'যুক্তরাষ্ট্র' },
    ]);

    const res = await request(app).get('/api/dropdowns/countries');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, label: 'Bangladesh / বাংলাদেশ' },
      { id: 2, label: 'USA / যুক্তরাষ্ট্র' },
    ]);
    expect(prisma.country.findMany).toHaveBeenCalled();
  });

  test('POST /api/candidates persists core and relational data', async () => {
    prisma.candidate.create.mockResolvedValue({ id: 99 });
    prisma.candidatePartnerExpectation.create.mockResolvedValue({ id: 3 });

    const payload = {
      fullName: 'Test User',
      gender: 'Male',
      dateOfBirth: '1990-01-01',
      religionId: 1,
      maritalStatusId: 1,
      highestEducationLevelId: 3,
      occupationType: 'Service',
      residencyStatusId: 1,
      currentCountryId: 1,
      currentCityId: 1,
      primaryContactNumber: '+8801XXXXXXX',
      children: [{ name: 'Child', gender: 'Female', ageYears: 4 }],
      siblings: [{ type: 'BROTHER', isElder: 'true', maritalStatusId: 1 }],
      maternalRelatives: [{ type: 'UNCLE', occupationId: 2 }],
      paternalRelatives: [{ type: 'AUNT', occupationId: 3 }],
      educationEntries: [{ educationLevelId: 3, institution: 'Uni', passingYear: 2010 }],
      hobbies: [{ hobbyId: 1, details: 'Reading' }],
      partnerExpectation: { preferredMinAge: 22, preferredMaxAge: 30 },
      files: [{ fileType: 'PROFILE_PHOTO', path: 'uploads/sample.jpg' }],
    };

    const res = await request(app).post('/api/candidates').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 99 });
    expect(prisma.candidate.create).toHaveBeenCalled();
    expect(prisma.candidateChild.createMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.arrayContaining([expect.objectContaining({ candidateId: 99 })]) })
    );
    expect(prisma.candidatePartnerExpectation.create).toHaveBeenCalled();
    expect(prisma.candidateFile.createMany).toHaveBeenCalled();
  });
});
