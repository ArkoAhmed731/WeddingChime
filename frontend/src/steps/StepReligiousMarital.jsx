import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFormContext } from '../context/FormContext';
import useDropdownOptions from '../hooks/useDropdownOptions';

const schema = yup.object({
  religionId: yup.string().required('Religion is required'),
  casteId: yup.string().nullable(),
  maritalStatusId: yup.string().required('Marital status is required'),
  hasChildren: yup.boolean(),
  numberOfChildren: yup.number().when('hasChildren', {
    is: true,
    then: (schemaNumber) => schemaNumber.min(0, 'Number of children cannot be negative'),
    otherwise: (schemaNumber) => schemaNumber.optional(),
  }),
});

export default function StepReligiousMarital() {
  const { formData, updateSection, nextStep, prevStep } = useFormContext();
  const religions = useDropdownOptions('religions');
  const castes = useDropdownOptions('castes', { religionId: formData.religiousMarital.religionId });
  const maritalStatuses = useDropdownOptions('maritalStatuses');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: formData.religiousMarital,
  });

  const religionId = watch('religionId');
  const hasChildren = watch('hasChildren');

  useEffect(() => {
    if (!hasChildren) {
      setValue('numberOfChildren', 0);
    }
  }, [hasChildren, setValue]);

  useEffect(() => {
    if (religionId && casteIdNotMatching(castes.options, watch('casteId'))) {
      setValue('casteId', '');
    }
  }, [religionId, castes.options, watch, setValue]);

  const onSubmit = (values) => {
    updateSection('religiousMarital', values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">🕌</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Religious & Marital Info</h2>
          <p className="text-gray-600">Select your faith background and marital status. Children fields appear when relevant.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-dual">Religion / ধর্ম *</label>
          <select className="input-base" {...register('religionId')}>
            <option value="">Select religion</option>
            {religions.options.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          {errors.religionId && <p className="field-error">{errors.religionId.message}</p>}
        </div>

        <div>
          <label className="label-dual">Caste / জাত</label>
          <select className="input-base" {...register('casteId')} disabled={!religionId}>
            <option value="">Select caste</option>
            {castes.options.map((caste) => (
              <option key={caste.id} value={caste.id}>
                {caste.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-dual">Marital Status / বৈবাহিক অবস্থা *</label>
          <select className="input-base" {...register('maritalStatusId')}>
            <option value="">Select status</option>
            {maritalStatuses.options.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
          {errors.maritalStatusId && <p className="field-error">{errors.maritalStatusId.message}</p>}
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" className="h-5 w-5 rounded border-gray-300" {...register('hasChildren')} />
          <div>
            <p className="label-dual">I have children / সন্তান আছে</p>
            <p className="text-sm text-gray-500">Enabling adds the child section in later steps.</p>
          </div>
        </div>
      </div>

      {hasChildren && (
        <div className="grid gap-4 md:grid-cols-2 rounded-xl bg-white p-4 shadow-inner ring-1 ring-primary-50">
          <div>
            <label className="label-dual">Number of Children / সন্তানের সংখ্যা</label>
            <input type="number" className="input-base" min="0" {...register('numberOfChildren')} />
            {errors.numberOfChildren && <p className="field-error">{errors.numberOfChildren.message}</p>}
          </div>
          <div className="text-sm text-gray-600">
            Add detailed child entries in the Family step when children > 0.
          </div>
        </div>
      )}

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

function casteIdNotMatching(casteOptions, casteId) {
  if (!casteId) return false;
  return !casteOptions.some((caste) => String(caste.id) === String(casteId));
}
