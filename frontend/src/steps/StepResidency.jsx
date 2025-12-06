import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormContext } from '../context/FormContext';
import useDropdownOptions from '../hooks/useDropdownOptions';

export default function StepResidency() {
  const { formData, updateSection, nextStep, prevStep } = useFormContext();
  const countries = useDropdownOptions('countries');
  const cities = useDropdownOptions('cities', { countryId: formData.residency.currentCountryId });
  const residencyStatuses = useDropdownOptions('residencyStatuses');

  const { register, handleSubmit } = useForm({ defaultValues: formData.residency });

  const onSubmit = (values) => {
    updateSection('residency', values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">🏡</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Residency</h2>
          <p className="text-gray-600">Birth place and current location details.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-dual">Current Country / বর্তমান দেশ</label>
          <select className="input-base" {...register('currentCountryId')}>
            <option value="">Select country</option>
            {countries.options.map((country) => (
              <option key={country.id} value={country.id}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Current City / বর্তমান শহর</label>
          <select className="input-base" {...register('currentCityId')}>
            <option value="">Select city</option>
            {cities.options.map((city) => (
              <option key={city.id} value={city.id}>
                {city.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Residency Status / অবস্থান</label>
          <select className="input-base" {...register('residencyStatusId')}>
            <option value="">Select status</option>
            {residencyStatuses.options.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Birth Country / জন্ম দেশ</label>
          <select className="input-base" {...register('birthCountryId')}>
            <option value="">Select country</option>
            {countries.options.map((country) => (
              <option key={country.id} value={country.id}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Birth City / জন্ম শহর</label>
          <input className="input-base" placeholder="City" {...register('birthCityId')} />
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
