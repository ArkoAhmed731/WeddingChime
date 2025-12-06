import React, { useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useFormContext } from '../context/FormContext';
import useDropdownOptions from '../hooks/useDropdownOptions';

export default function StepFamilyInfo() {
  const { formData, setSection, nextStep, prevStep } = useFormContext();
  const maritalStatuses = useDropdownOptions('maritalStatuses');
  const familyFinancialStatuses = useDropdownOptions('familyFinancialStatuses');
  const familyTypes = useDropdownOptions('familyTypes');
  const occupations = useDropdownOptions('occupations');

  const hasChildren = useMemo(() => formData.religiousMarital?.hasChildren, [formData.religiousMarital]);

  const { register, handleSubmit, control } = useForm({
    defaultValues: formData.familyInfo,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'siblings' });
  const childrenArray = useFieldArray({ control, name: 'children' });

  const onSubmit = (values) => {
    setSection('familyInfo', values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">👪</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Family Information</h2>
          <p className="text-gray-600">Summarize financial status, family type, and siblings.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-dual">Family Financial Status</label>
          <select className="input-base" {...register('familyFinancialStatusId')}>
            <option value="">Select</option>
            {familyFinancialStatuses.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Family Type</label>
          <select className="input-base" {...register('familyTypeId')}>
            <option value="">Select</option>
            {familyTypes.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasChildren && (
        <div className="space-y-3 rounded-xl bg-white p-4 shadow-inner ring-1 ring-primary-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary-700">Children Details</h3>
            <button
              type="button"
              className="button-secondary"
              onClick={() => childrenArray.append({ name: '', gender: '', ageYears: '' })}
            >
              + Add Child
            </button>
          </div>
          {childrenArray.fields.length === 0 && (
            <p className="text-sm text-gray-500">Use the add button to document each child.</p>
          )}
          {childrenArray.fields.map((child, index) => (
            <div key={child.id} className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="label-dual">Name</label>
                <input className="input-base" {...register(`children.${index}.name`)} />
              </div>
              <div>
                <label className="label-dual">Gender</label>
                <select className="input-base" {...register(`children.${index}.gender`)}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="label-dual">Age (years)</label>
                <input type="number" min="0" className="input-base" {...register(`children.${index}.ageYears`)} />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="button" className="text-sm text-red-600" onClick={() => childrenArray.remove(index)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-700">Siblings</h3>
          <button
            type="button"
            className="button-secondary"
            onClick={() => append({ type: 'BROTHER', isElder: false, maritalStatusId: '', occupationId: '' })}
          >
            + Add Sibling
          </button>
        </div>
        {fields.length === 0 && <p className="text-sm text-gray-500">No siblings added yet.</p>}
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl bg-white p-4 shadow-inner ring-1 ring-primary-50">
            <div className="flex justify-between">
              <p className="font-semibold text-primary-700">Sibling {index + 1}</p>
              <button type="button" className="text-sm text-red-600" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <label className="label-dual">Type</label>
                <select className="input-base" {...register(`siblings.${index}.type`)}>
                  <option value="BROTHER">Brother</option>
                  <option value="SISTER">Sister</option>
                </select>
              </div>
              <div>
                <label className="label-dual">Elder?</label>
                <select className="input-base" {...register(`siblings.${index}.isElder`)}>
                  <option value="true">Elder</option>
                  <option value="false">Younger</option>
                </select>
              </div>
              <div>
                <label className="label-dual">Marital Status</label>
                <select className="input-base" {...register(`siblings.${index}.maritalStatusId`)}>
                  <option value="">Select</option>
                  {maritalStatuses.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-dual">Occupation</label>
                <select className="input-base" {...register(`siblings.${index}.occupationId`)}>
                  <option value="">Select</option>
                  {occupations.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
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
