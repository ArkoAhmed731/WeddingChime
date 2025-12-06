import React from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import FormLayout from './components/FormLayout';
import StepAuthentication from './steps/StepAuthentication';
import StepPersonalInfo from './steps/StepPersonalInfo';
import StepReligiousMarital from './steps/StepReligiousMarital';
import StepResidency from './steps/StepResidency';
import StepEducation from './steps/StepEducation';
import StepOccupation from './steps/StepOccupation';
import StepFamilyInfo from './steps/StepFamilyInfo';
import StepExtendedFamily from './steps/StepExtendedFamily';
import StepHabits from './steps/StepHabits';
import StepPartnerExpectations from './steps/StepPartnerExpectations';
import StepAboutMe from './steps/StepAboutMe';
import StepFileUploads from './steps/StepFileUploads';

const steps = [
  { id: 'authentication', title: 'Authentication', component: StepAuthentication },
  { id: 'personal', title: 'Personal Info', component: StepPersonalInfo },
  { id: 'religious', title: 'Religious & Marital', component: StepReligiousMarital },
  { id: 'residency', title: 'Residency', component: StepResidency },
  { id: 'education', title: 'Education', component: StepEducation },
  { id: 'occupation', title: 'Occupation', component: StepOccupation },
  { id: 'family', title: 'Family Info', component: StepFamilyInfo },
  { id: 'extended', title: 'Extended Family', component: StepExtendedFamily },
  { id: 'habits', title: 'Habits & Interests', component: StepHabits },
  { id: 'partner', title: 'Partner Expectations', component: StepPartnerExpectations },
  { id: 'about', title: 'About & Contact', component: StepAboutMe },
  { id: 'files', title: 'File Uploads', component: StepFileUploads },
];

function StepRenderer() {
  const { currentStep } = useFormContext();
  const StepComponent = steps[currentStep].component;
  return <StepComponent />;
}

function AppShell() {
  const { currentStep } = useFormContext();
  return (
    <FormLayout steps={steps} currentStep={currentStep}>
      <StepRenderer />
    </FormLayout>
  );
}

export default function App() {
  return (
    <FormProvider>
      <AppShell />
    </FormProvider>
  );
}
