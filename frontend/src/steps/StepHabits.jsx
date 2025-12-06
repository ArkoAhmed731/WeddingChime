import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormContext } from '../context/FormContext';
import useDropdownOptions from '../hooks/useDropdownOptions';

export default function StepHabits() {
  const { formData, setSection, nextStep, prevStep } = useFormContext();
  const smokingHabits = useDropdownOptions('smokingHabits');
  const drinkingHabits = useDropdownOptions('drinkingHabits');
  const hobbies = useDropdownOptions('hobbies');

  const { register, handleSubmit } = useForm({ defaultValues: formData.habits });

  const onSubmit = (values) => {
    const hobbyObjects = Array.from(values.hobbies || []).map((id) => ({ hobbyId: Number(id) }));
    setSection('habits', { ...values, hobbies: hobbyObjects });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">🌱</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Habits & Interests</h2>
          <p className="text-gray-600">Lifestyle choices and hobbies help match preferences.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-dual">Smoking Habit</label>
          <select className="input-base" {...register('smokingHabitId')}>
            <option value="">Select</option>
            {smokingHabits.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dual">Drinking Habit</label>
          <select className="input-base" {...register('drinkingHabitId')}>
            <option value="">Select</option>
            {drinkingHabits.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label-dual">Hobbies</label>
        <div className="flex flex-wrap gap-2">
          {hobbies.options.map((option) => (
            <label key={option.id} className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-primary-50">
              <input type="checkbox" value={option.id} className="h-4 w-4" {...register('hobbies')} />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
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
