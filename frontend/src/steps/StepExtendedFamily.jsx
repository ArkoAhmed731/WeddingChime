import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useFormContext } from '../context/FormContext';

export default function StepExtendedFamily() {
  const { formData, setSection, nextStep, prevStep } = useFormContext();
  const { control, register, handleSubmit } = useForm({ defaultValues: formData.extendedFamily });
  const maternalArray = useFieldArray({ control, name: 'maternalRelatives' });
  const paternalArray = useFieldArray({ control, name: 'paternalRelatives' });

  const onSubmit = (values) => {
    setSection('extendedFamily', values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">🌿</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Extended Family</h2>
          <p className="text-gray-600">Optional details about maternal and paternal relatives.</p>
        </div>
      </div>

      {[{ title: 'Maternal Relatives', array: maternalArray, name: 'maternalRelatives' }, { title: 'Paternal Relatives', array: paternalArray, name: 'paternalRelatives' }].map((group) => (
        <div key={group.name} className="space-y-3 rounded-xl bg-white p-4 shadow-inner ring-1 ring-primary-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary-700">{group.title}</h3>
            <button
              type="button"
              className="button-secondary"
              onClick={() => group.array.append({ type: 'UNCLE', occupationId: '', workplaceCountryId: '', workplaceCityId: '' })}
            >
              + Add
            </button>
          </div>
          {group.array.fields.length === 0 && <p className="text-sm text-gray-500">No relatives added.</p>}
          {group.array.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="label-dual">Type</label>
                <select className="input-base" {...register(`${group.name}.${index}.type`)}>
                  <option value="UNCLE">Uncle</option>
                  <option value="AUNT">Aunt</option>
                </select>
              </div>
              <div>
                <label className="label-dual">Occupation Id</label>
                <input className="input-base" {...register(`${group.name}.${index}.occupationId`)} />
              </div>
              <div>
                <label className="label-dual">Workplace Country Id</label>
                <input className="input-base" {...register(`${group.name}.${index}.workplaceCountryId`)} />
              </div>
              <div>
                <label className="label-dual">Workplace City Id</label>
                <input className="input-base" {...register(`${group.name}.${index}.workplaceCityId`)} />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="button" className="text-sm text-red-600" onClick={() => group.array.remove(index)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

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
