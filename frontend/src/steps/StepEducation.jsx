import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFormContext } from '../context/FormContext';
import useDropdownOptions from '../hooks/useDropdownOptions';

const schema = yup.object({
  highestEducationLevelId: yup.string().required('Highest education is required'),
  educationEntries: yup
    .array()
    .of(
      yup.object({
        educationLevelId: yup.string().required('Level is required'),
        institution: yup.string().required('Institution is required'),
        fieldOfStudy: yup.string().nullable(),
        result: yup.string().nullable(),
        passingYear: yup.number().typeError('Year must be numeric').nullable(),
      })
    )
    .min(1, 'Please add at least one education entry'),
});

export default function StepEducation() {
  const { formData, setSection, nextStep, prevStep } = useFormContext();
  const educationLevels = useDropdownOptions('educationLevels');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      highestEducationLevelId: formData.education.highestEducationLevelId,
      educationEntries:
        formData.education.educationEntries.length > 0
          ? formData.education.educationEntries
          : [
              {
                educationLevelId: '',
                institution: '',
                fieldOfStudy: '',
                result: '',
                passingYear: '',
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'educationEntries' });

  const onSubmit = (values) => {
    setSection('education', values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">🎓</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Education</h2>
          <p className="text-gray-600">Tell us about your academic journey. Add multiple entries as needed.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-dual">Highest Education Level / সর্বোচ্চ ডিগ্রি *</label>
          <select className="input-base" {...register('highestEducationLevelId')}>
            <option value="">Select level</option>
            {educationLevels.options.map((level) => (
              <option key={level.id} value={level.id}>
                {level.label}
              </option>
            ))}
          </select>
          {errors.highestEducationLevelId && <p className="field-error">{errors.highestEducationLevelId.message}</p>}
        </div>
        <div className="rounded-xl bg-white p-4 text-sm text-gray-600 shadow-inner ring-1 ring-primary-50">
          Add SSC/HSC/Bachelor/Masters/PhD blocks based on your highest level. You can list multiple institutions if needed.
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-2xl bg-white p-5 shadow-inner ring-1 ring-primary-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary-700">Education Entry {index + 1}</h3>
              {fields.length > 1 && (
                <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => remove(index)}>
                  Remove
                </button>
              )}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="label-dual">Level / শিক্ষা ধাপ *</label>
                <select className="input-base" {...register(`educationEntries.${index}.educationLevelId`)}>
                  <option value="">Select</option>
                  {educationLevels.options.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.educationEntries?.[index]?.educationLevelId && (
                  <p className="field-error">{errors.educationEntries[index].educationLevelId?.message}</p>
                )}
              </div>
              <div>
                <label className="label-dual">Institution / প্রতিষ্ঠান *</label>
                <input className="input-base" placeholder="University of Dhaka" {...register(`educationEntries.${index}.institution`)} />
                {errors.educationEntries?.[index]?.institution && (
                  <p className="field-error">{errors.educationEntries[index].institution?.message}</p>
                )}
              </div>
              <div>
                <label className="label-dual">Field of Study / বিভাগ</label>
                <input className="input-base" placeholder="Computer Science" {...register(`educationEntries.${index}.fieldOfStudy`)} />
              </div>
              <div>
                <label className="label-dual">Result / ফলাফল</label>
                <input className="input-base" placeholder="CGPA 3.8" {...register(`educationEntries.${index}.result`)} />
              </div>
              <div>
                <label className="label-dual">Passing Year / পাসের বছর</label>
                <input className="input-base" placeholder="2018" type="number" {...register(`educationEntries.${index}.passingYear`)} />
                {errors.educationEntries?.[index]?.passingYear && (
                  <p className="field-error">{errors.educationEntries[index].passingYear?.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          className="button-secondary"
          onClick={() =>
            append({ educationLevelId: '', institution: '', fieldOfStudy: '', result: '', passingYear: '' })
          }
        >
          + Add Education Entry
        </button>
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
