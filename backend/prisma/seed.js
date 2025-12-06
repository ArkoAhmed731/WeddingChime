/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDropdowns() {
  const countries = [
    { name: 'Bangladesh', nameBn: 'বাংলাদেশ', isoCode: 'BD' },
    { name: 'United States', nameBn: 'যুক্তরাষ্ট্র', isoCode: 'US' },
  ];
  for (const country of countries) {
    await prisma.country.upsert({
      where: { name: country.name },
      update: country,
      create: country,
    });
  }

  const cities = [
    { name: 'Dhaka', nameBn: 'ঢাকা', countryName: 'Bangladesh', stateOrRegion: 'Dhaka' },
    { name: 'Chattogram', nameBn: 'চট্টগ্রাম', countryName: 'Bangladesh', stateOrRegion: 'Chattogram' },
    { name: 'New York', nameBn: 'নিউ ইয়র্ক', countryName: 'United States', stateOrRegion: 'NY' },
  ];
  for (const city of cities) {
    const country = await prisma.country.findUnique({ where: { name: city.countryName } });
    if (!country) continue;
    await prisma.city.upsert({
      where: { name_countryId: { name: city.name, countryId: country.id } },
      update: {
        nameBn: city.nameBn,
        stateOrRegion: city.stateOrRegion,
      },
      create: {
        name: city.name,
        nameBn: city.nameBn,
        countryId: country.id,
        stateOrRegion: city.stateOrRegion,
      },
    });
  }

  const religions = [
    { name: 'Islam', nameBn: 'ইসলাম' },
    { name: 'Hinduism', nameBn: 'হিন্দুধর্ম' },
  ];
  for (const religion of religions) {
    await prisma.religion.upsert({ where: { name: religion.name }, update: religion, create: religion });
  }

  const castes = [
    { name: 'Sunni', religionName: 'Islam' },
    { name: 'Shia', religionName: 'Islam' },
    { name: 'Brahmin', religionName: 'Hinduism' },
  ];
  for (const caste of castes) {
    const religion = await prisma.religion.findUnique({ where: { name: caste.religionName } });
    if (!religion) continue;
    await prisma.caste.upsert({
      where: { name_religionId: { name: caste.name, religionId: religion.id } },
      update: { nameBn: caste.nameBn },
      create: {
        name: caste.name,
        religionId: religion.id,
        nameBn: caste.nameBn,
      },
    });
  }

  const occupations = [
    { name: 'Engineer', nameBn: 'ইঞ্জিনিয়ার' },
    { name: 'Doctor', nameBn: 'ডাক্তার' },
    { name: 'Teacher', nameBn: 'শিক্ষক' },
  ];
  for (const occupation of occupations) {
    await prisma.occupation.upsert({ where: { name: occupation.name }, update: occupation, create: occupation });
  }

  const incomeRanges = [
    { label: '$0 - $1000', labelBn: '৳০ - ৳৮৫,০০০', minValue: 0, maxValue: 1000 },
    { label: '$1000 - $3000', labelBn: '৳৮৫,০০০ - ৳২,৫৫,০০০', minValue: 1000, maxValue: 3000 },
  ];
  for (const range of incomeRanges) {
    await prisma.incomeRange.upsert({ where: { label: range.label }, update: range, create: range });
  }

  const educationLevels = [
    { label: 'SSC', labelBn: 'এসএসসি' },
    { label: 'HSC', labelBn: 'এইচএসসি' },
    { label: 'Bachelor', labelBn: 'স্নাতক' },
    { label: 'Masters', labelBn: 'স্নাতকোত্তর' },
  ];
  for (const level of educationLevels) {
    await prisma.educationLevel.upsert({ where: { label: level.label }, update: level, create: level });
  }

  const habitLabels = [
    { model: prisma.smokingHabit, values: ['Non-smoker', 'Occasional'], bn: ['ধূমপান করেন না', 'মাঝে মাঝে'] },
    { model: prisma.drinkingHabit, values: ['Does not drink', 'Occasional'], bn: ['মদ্যপান করেন না', 'মাঝে মাঝে'] },
  ];
  for (const habit of habitLabels) {
    for (let i = 0; i < habit.values.length; i += 1) {
      const label = habit.values[i];
      const labelBn = habit.bn[i];
      await habit.model.upsert({ where: { label }, update: { label, labelBn }, create: { label, labelBn } });
    }
  }

  const maritalStatuses = [
    { label: 'Never Married', labelBn: 'অবিবাহিত' },
    { label: 'Married', labelBn: 'বিবাহিত' },
    { label: 'Divorced', labelBn: 'তালাকপ্রাপ্ত' },
  ];
  for (const status of maritalStatuses) {
    await prisma.maritalStatus.upsert({ where: { label: status.label }, update: status, create: status });
  }

  const residencyStatuses = [
    { label: 'Citizen', labelBn: 'নাগরিক' },
    { label: 'Permanent Resident', labelBn: 'স্থায়ী নিবাসী' },
    { label: 'Student Visa', labelBn: 'ছাত্র ভিসা' },
  ];
  for (const status of residencyStatuses) {
    await prisma.residencyStatus.upsert({ where: { label: status.label }, update: status, create: status });
  }

  const religiousPracticeLevels = [
    { label: 'Practicing', labelBn: 'অনুশীলনকারী' },
    { label: 'Moderate', labelBn: 'মধ্যম' },
    { label: 'Non-practicing', labelBn: 'অননুশীলনকারী' },
  ];
  for (const level of religiousPracticeLevels) {
    await prisma.religiousPracticeLevel.upsert({ where: { label: level.label }, update: level, create: level });
  }

  const familyFinancialStatuses = [
    { label: 'Upper Class', labelBn: 'উচ্চবিত্ত' },
    { label: 'Middle Class', labelBn: 'মধ্যবিত্ত' },
  ];
  for (const status of familyFinancialStatuses) {
    await prisma.familyFinancialStatus.upsert({ where: { label: status.label }, update: status, create: status });
  }

  const familyTypes = [
    { label: 'Joint', labelBn: 'যৌথ পরিবার' },
    { label: 'Nuclear', labelBn: 'স্বতন্ত্র পরিবার' },
  ];
  for (const type of familyTypes) {
    await prisma.familyType.upsert({ where: { label: type.label }, update: type, create: type });
  }

  const bloodGroups = [
    { label: 'A+', labelBn: 'এ পজিটিভ' },
    { label: 'B+', labelBn: 'বি পজিটিভ' },
    { label: 'O+', labelBn: 'ও পজিটিভ' },
  ];
  for (const group of bloodGroups) {
    await prisma.bloodGroup.upsert({ where: { label: group.label }, update: group, create: group });
  }

  const hobbies = [
    { name: 'Reading', nameBn: 'পড়া' },
    { name: 'Traveling', nameBn: 'ভ্রমণ' },
    { name: 'Cooking', nameBn: 'রান্না' },
  ];
  for (const hobby of hobbies) {
    await prisma.hobby.upsert({ where: { name: hobby.name }, update: hobby, create: hobby });
  }
}

async function main() {
  await seedDropdowns();
  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
