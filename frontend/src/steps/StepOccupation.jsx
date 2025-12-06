import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormContext } from '../context/FormContext';
import useDropdownOptions from '../hooks/useDropdownOptions';

export default function StepOccupation() {
  const { formData, updateSection, nextStep, prevStep } = useFormContext();
  const occupations = useDropdownOptions('occupations');
  const incomeRanges = useDropdownOptions('incomeRanges');
  const countries = useDropdownOptions('countries');
  const cities = useDropdownOptions('cities', { countryId: formData.occupation.workplaceCountryId });

  const { register, handleSubmit } = useForm({ defaultValues: formData.occupation });

  const onSubmit = (values) => {
    updateSection('occupation', values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">💼</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Occupation</h2>
          <p className="text-gray-600">Share your profession and workplace details.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-dual">Occupation Type / পেশার ধরণ</label>
          <input className="input-base" placeholder="Service, Business" {...register('occupationType')} />
        </div>
        <div>
          <label className="label-dual">Occupation / পেশা</label>
          <select className="input-base" {...register('occupationId')}>
            <option value="">Select occupation</option>
            {occupations.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Income Range / আয়ের পরিসর</label>
          <select className="input-base" {...register('incomeRangeId')}>
            <option value="">Select income</option>
            {incomeRanges.options.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Workplace Country / কর্মস্থল দেশ</label>
          <select className="input-base" {...register('workplaceCountryId')}>
            <option value="">Select country</option>
            {countries.options.map((country) => (
              <option key={country.id} value={country.id}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Workplace City / কর্মস্থল শহর</label>
          <select className="input-base" {...register('workplaceCityId')}>
            <option value="">Select city</option>
            {cities.options.map((city) => (
              <option key={city.id} value={city.id}>
                {city.label}
              </option>
            ))}
          </select>
        </div>
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
