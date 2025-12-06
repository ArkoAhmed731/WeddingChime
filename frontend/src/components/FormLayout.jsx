import React from 'react';
import Stepper from './Stepper';

export default function FormLayout({ steps, currentStep, children }) {
  return (
    <div className="min-h-screen px-4 pb-10">
      <div className="mx-auto max-w-6xl pt-10">
        <header className="mb-8 flex flex-col gap-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 shadow-soft">
            <span className="text-2xl font-black">MC</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary-800">Marriage Biodata Form</h1>
            <p className="mt-2 text-base text-gray-600">
              A guided 12-step form to craft a beautiful biodata. Provide bilingual details where applicable.
            </p>
          </div>
        </header>
        <div className="section-shell mb-6">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
        <div className="card-gradient section-shell">{children}</div>
      </div>
    </div>
  );
}
