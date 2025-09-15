// src/components/guide_dashboard/settings/LanguagesSection.jsx
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const LanguagesSection = ({ languages, isSaving, onLanguageAdd, onLanguageRemove }) => {
  const [newLanguage, setNewLanguage] = useState('');
  const [newLanguageProficiency, setNewLanguageProficiency] = useState('Basic');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newLanguage) {
      onLanguageAdd(newLanguage, newLanguageProficiency);
      setNewLanguage('');
    }
  };

  return (
    <div className="p-6 bg-white shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Languages</h2>
      
      <div className="mb-6 space-y-4">
        {languages.map((lang, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div>
              <p className="font-medium text-gray-800">{lang.language}</p>
              <p className="text-sm text-gray-500 capitalize">{lang.proficiency.toLowerCase()}</p>
            </div>
            <button
              onClick={() => onLanguageRemove(index)}
              disabled={isSaving}
              className="px-3 py-1 text-sm text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Add New Language</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Language"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSaving}
            />
          </div>
          <div>
            <select
              value={newLanguageProficiency}
              onChange={(e) => setNewLanguageProficiency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              disabled={isSaving}
            >
              <option value="Basic">Basic</option>
              <option value="Fluent">Fluent</option>
              <option value="Native">Native</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSaving ? 'Adding...' : 'Add Language'}
        </button>
      </form>
    </div>
  );
};

export default LanguagesSection;