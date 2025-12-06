import React from 'react';
import { useFormContext } from '../context/FormContext';

export default function StepAuthentication() {
  const { nextStep } = useFormContext();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">🔒</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">Authentication</h2>
          <p className="text-gray-600">Start by confirming you are ready to complete the biodata in a secure session.</p>
        </div>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-inner ring-1 ring-primary-50">
        <p className="text-gray-700 leading-relaxed">
          For this demo, authentication is simplified. Proceed to begin filling out your biodata. Your progress is retained as
          you navigate between steps.
        </p>
      </div>
      <div className="flex justify-end">
        <button onClick={nextStep} className="button-primary">
          Start Form
        </button>
      </div>
    </div>
  );
}
