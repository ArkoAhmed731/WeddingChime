import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormContext } from '../context/FormContext';
import useDropdownOptions from '../hooks/useDropdownOptions';

export default function StepPartnerExpectations() {
  const { formData, setSection, nextStep, prevStep } = useFormContext();
  const educationLevels = useDropdownOptions('educationLevels');
  const maritalStatuses = useDropdownOptions('maritalStatuses');
  const occupations = useDropdownOptions('occupations');
  const countries = useDropdownOptions('countries');

  const { register, handleSubmit } = useForm({ defaultValues: formData.partnerExpectations });

  const onSubmit = (values) => {
    setSection('partnerExpectations', values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">🤝</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Partner Expectations</h2>
          <p className="text-gray-600">Outline your ideal partner's attributes.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-dual">Preferred Age Range</label>
          <div className="flex gap-3">
            <input type="number" placeholder="Min" className="input-base" {...register('preferredMinAge')} />
            <input type="number" placeholder="Max" className="input-base" {...register('preferredMaxAge')} />
          </div>
        </div>
        <div>
          <label className="label-dual">Preferred Occupation</label>
          <select className="input-base" {...register('preferredOccupationId')}>
            <option value="">Select</option>
            {occupations.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Preferred Education Level</label>
          <select className="input-base" {...register('preferredEducationLevelId')}>
            <option value="">Select</option>
            {educationLevels.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Preferred Country</label>
          <select className="input-base" {...register('preferredCountryId')}>
            <option value="">Select</option>
            {countries.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Preferred Marital Status</label>
          <select className="input-base" {...register('preferredMaritalStatusId')}>
            <option value="">Select</option>
            {maritalStatuses.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label-dual">Expectations / মন্তব্য</label>
        <textarea className="input-base min-h-[120px]" placeholder="Describe what you are looking for" {...register('expectationNotes')} />
      </div>

      <div className="flex items-center justify-between pt-4">
        <button type="button" onClick={prevStep} className="button-secondary">
          Back
        </button>
        <button type="submit" className="button-primary">
          Next
        </button>
      </div>
    </form>
  );
}
