const prisma = require('../prismaClient');

const dropdownConfig = {
  countries: {
    query: prisma.country,
    select: { id: true, name: true, nameBn: true },
  },
  cities: {
    query: prisma.city,
    select: { id: true, name: true, nameBn: true, countryId: true },
  },
  occupations: {
    query: prisma.occupation,
    select: { id: true, name: true, nameBn: true },
  },
  incomeRanges: {
    query: prisma.incomeRange,
    select: { id: true, label: true, labelBn: true },
  },
  religions: {
    query: prisma.religion,
    select: { id: true, name: true, nameBn: true },
  },
  castes: {
    query: prisma.caste,
    select: { id: true, name: true, nameBn: true, religionId: true },
  },
  religiousPracticeLevels: {
    query: prisma.religiousPracticeLevel,
    select: { id: true, label: true, labelBn: true },
  },
  familyFinancialStatuses: {
    query: prisma.familyFinancialStatus,
    select: { id: true, label: true, labelBn: true },
  },
  familyTypes: {
    query: prisma.familyType,
    select: { id: true, label: true, labelBn: true },
  },
  smokingHabits: {
    query: prisma.smokingHabit,
    select: { id: true, label: true, labelBn: true },
  },
  drinkingHabits: {
    query: prisma.drinkingHabit,
    select: { id: true, label: true, labelBn: true },
  },
  educationLevels: {
    query: prisma.educationLevel,
    select: { id: true, label: true, labelBn: true },
  },
  residencyStatuses: {
    query: prisma.residencyStatus,
    select: { id: true, label: true, labelBn: true },
  },
  maritalStatuses: {
    query: prisma.maritalStatus,
    select: { id: true, label: true, labelBn: true },
  },
  bloodGroups: {
    query: prisma.bloodGroup,
    select: { id: true, label: true, labelBn: true },
  },
  hobbies: {
    query: prisma.hobby,
    select: { id: true, name: true, nameBn: true },
  },
};

function toLabel(row) {
  if (row.name || row.label) {
    const primary = row.name || row.label;
    const secondary = row.nameBn || row.labelBn;
    return secondary ? `${primary} / ${secondary}` : primary;
  }
  return `${row.id}`;
}

async function getDropdown(req, res) {
  const { type } = req.params;
  const config = dropdownConfig[type];

  if (!config) {
    return res.status(400).json({ error: 'Unknown dropdown type' });
  }

  const filters = {};
  if (type === 'cities' && req.query.countryId) {
    filters.countryId = Number(req.query.countryId);
  }
  if (type === 'castes' && req.query.religionId) {
    filters.religionId = Number(req.query.religionId);
  }

  try {
    const items = await config.query.findMany({
      where: filters,
      select: config.select,
      orderBy: { id: 'asc' },
    });

    const mapped = items.map((item) => ({ id: item.id, label: toLabel(item) }));
    res.json(mapped);
  } catch (error) {
    console.error('Error fetching dropdown', error);
    res.status(500).json({ error: 'Failed to load dropdown' });
  }
}

module.exports = { getDropdown };
