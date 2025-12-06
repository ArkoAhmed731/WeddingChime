import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFormContext } from '../context/FormContext';
import useDropdownOptions from '../hooks/useDropdownOptions';

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  gender: yup.string().required('Gender is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  heightCm: yup.number().typeError('Height must be a number').nullable(),
  weightKg: yup.number().typeError('Weight must be a number').nullable(),
  bloodGroupId: yup.string().nullable(),
});

const genders = [
  { value: 'Male', label: 'Male / পুরুষ' },
  { value: 'Female', label: 'Female / নারী' },
  { value: 'Other', label: 'Other / অন্যান্য' },
];

export default function StepPersonalInfo() {
  const { formData, updateSection, nextStep, prevStep } = useFormContext();
  const bloodGroups = useDropdownOptions('bloodGroups');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: formData.personalInfo,
  });

  const onSubmit = (values) => {
    updateSection('personalInfo', values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">👤</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Personal Information</h2>
          <p className="text-gray-600">Enter your core identity details. Fields marked with * are required.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-dual">Full Name / পূর্ণ নাম *</label>
          <input className="input-base" placeholder="e.g., Rahim Uddin" {...register('fullName')} />
          {errors.fullName && <p className="field-error">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="label-dual">Gender / লিঙ্গ *</label>
          <select className="input-base" {...register('gender')}>
            <option value="">Select</option>
            {genders.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
          {errors.gender && <p className="field-error">{errors.gender.message}</p>}
        </div>
        <div>
          <label className="label-dual">Date of Birth / জন্ম তারিখ *</label>
          <input type="date" className="input-base" {...register('dateOfBirth')} />
          {errors.dateOfBirth && <p className="field-error">{errors.dateOfBirth.message}</p>}
        </div>
        <div>
          <label className="label-dual">Blood Group / রক্তের গ্রুপ</label>
          <select className="input-base" {...register('bloodGroupId')}>
            <option value="">Select</option>
            {bloodGroups.options.map((bg) => (
              <option key={bg.id} value={bg.id}>
                {bg.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Height (cm) / উচ্চতা</label>
          <input className="input-base" placeholder="172" type="number" {...register('heightCm')} />
          {errors.heightCm && <p className="field-error">{errors.heightCm.message}</p>}
        </div>
        <div>
          <label className="label-dual">Weight (kg) / ওজন</label>
          <input className="input-base" placeholder="65" type="number" {...register('weightKg')} />
          {errors.weightKg && <p className="field-error">{errors.weightKg.message}</p>}
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
