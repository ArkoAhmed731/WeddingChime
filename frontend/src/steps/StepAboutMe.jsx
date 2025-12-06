import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormContext } from '../context/FormContext';

export default function StepAboutMe() {
  const { formData, updateSection, nextStep, prevStep } = useFormContext();
  const { register, handleSubmit } = useForm({ defaultValues: formData.about });

  const onSubmit = (values) => {
    updateSection('about', values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">📱</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">About You & Contact</h2>
          <p className="text-gray-600">Share your story and how we can reach you.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-dual">Primary Contact Number *</label>
          <input className="input-base" placeholder="+8801XXXXXXXXX" {...register('primaryContactNumber', { required: true })} />
        </div>
        <div>
          <label className="label-dual">WhatsApp Number</label>
          <input className="input-base" placeholder="+8801XXXXXXXXX" {...register('whatsappNumber')} />
        </div>
        <div>
          <label className="label-dual">Contact Email</label>
          <input className="input-base" type="email" placeholder="you@example.com" {...register('contactEmail')} />
        </div>
      </div>

      <div>
        <label className="label-dual">About Me / পরিচিতি</label>
        <textarea className="input-base min-h-[120px]" placeholder="Describe yourself" {...register('aboutMe')} />
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
