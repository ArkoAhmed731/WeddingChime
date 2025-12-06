import React from 'react';
import classNames from 'classnames';

export default function Stepper({ steps, currentStep }) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {steps.map((step, index) => {
          const active = index === currentStep;
          const completed = index < currentStep;
          return (
            <div
              key={step.id}
              className={classNames(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
                active && 'bg-primary-600 text-white shadow-soft',
                completed && !active && 'bg-primary-100 text-primary-700',
                !active && !completed && 'bg-white text-gray-500 border border-gray-200'
              )}
            >
              <span
                className={classNames(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                  active ? 'bg-white/20 text-white' : 'bg-white text-primary-700 shadow'
                )}
              >
                {index + 1}
              </span>
              <span>{step.title}</span>
            </div>
          );
        })}
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs font-medium text-gray-500">Step {currentStep + 1} of {steps.length}</div>
    </div>
  );
}
