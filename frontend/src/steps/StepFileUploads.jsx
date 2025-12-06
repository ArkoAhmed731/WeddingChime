import React, { useState } from 'react';
import { useFormContext } from '../context/FormContext';

export default function StepFileUploads() {
  const { formData, updateSection, submitForm, prevStep, submittedId, submitting } = useFormContext();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleFileChange = (field, file) => {
    updateSection('files', { ...formData.files, [field]: file });
  };

  const handleSubmit = async () => {
    setStatus('submitting');
    setError('');
    try {
      await submitForm();
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError('Submission failed. Please try again.');
    }
  };

  if (submittedId && status === 'success') {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 shadow-soft">
          ✅
        </div>
        <h2 className="text-3xl font-bold text-primary-800">Thank you!</h2>
        <p className="text-gray-600">
          Your biodata has been submitted successfully. Reference ID: <span className="font-semibold">{submittedId}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-soft">📂</div>
        <div>
          <h2 className="text-2xl font-bold text-primary-800">File Uploads</h2>
          <p className="text-gray-600">Attach your profile photo, national ID/passport, and biodata document.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-inner ring-1 ring-primary-50">
          <label className="label-dual">Profile Photo</label>
          <input type="file" accept="image/*" className="mt-2" onChange={(e) => handleFileChange('profilePhoto', e.target.files[0])} />
          {formData.files.profilePhoto && <p className="text-sm text-gray-600 mt-2">{formData.files.profilePhoto.name}</p>}
        </div>
        <div className="rounded-xl bg-white p-4 shadow-inner ring-1 ring-primary-50">
          <label className="label-dual">NID / Passport</label>
          <input type="file" className="mt-2" onChange={(e) => handleFileChange('nidPassport', e.target.files[0])} />
          {formData.files.nidPassport && <p className="text-sm text-gray-600 mt-2">{formData.files.nidPassport.name}</p>}
        </div>
        <div className="rounded-xl bg-white p-4 shadow-inner ring-1 ring-primary-50 md:col-span-2">
          <label className="label-dual">Biodata Document (PDF/Doc)</label>
          <input type="file" accept=".pdf,.doc,.docx" className="mt-2" onChange={(e) => handleFileChange('biodataDoc', e.target.files[0])} />
          {formData.files.biodataDoc && <p className="text-sm text-gray-600 mt-2">{formData.files.biodataDoc.name}</p>}
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex items-center justify-between pt-4">
        <button type="button" onClick={prevStep} className="button-secondary" disabled={submitting}>
          Back
        </button>
        <button type="button" onClick={handleSubmit} className="button-primary" disabled={submitting}>
          {submitting || status === 'submitting' ? 'Submitting...' : 'Submit Biodata'}
        </button>
      </div>
    </div>
  );
}
