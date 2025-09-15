// src/components/guide_dashboard/settings/DocumentsSection.jsx
import React from 'react';
import { FiUpload } from 'react-icons/fi';

const DocumentsSection = ({ documents, isSaving, onDocumentUpload }) => {
  return (
    <div className="p-6 bg-white shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Verification & Documents</h2>
      
      <div className="p-6 mb-6 text-center rounded-lg bg-gray-50">
        <div className="max-w-md mx-auto">
          <FiUpload className="mx-auto mb-3 text-3xl text-gray-400" />
          <h3 className="mb-1 text-sm font-medium text-gray-700">Upload Documents</h3>
          <p className="mb-3 text-xs text-gray-500">Government ID, Guide License, etc.</p>
          <label className="inline-block px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg cursor-pointer hover:bg-blue-50">
            Select Files
            <input
              type="file"
              onChange={(e) => onDocumentUpload(e, 'verification')}
              className="hidden"
              disabled={isSaving}
            />
          </label>
        </div>
      </div>
      
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 mr-3 bg-white rounded-lg shadow-sm">
                <FiUpload className="text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{doc.name}</p>
                <p className="text-xs text-gray-500">Uploaded on {doc.date}</p>
              </div>
            </div>
            <span className={`px-3 py-1 text-xs rounded-full ${
              doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
              doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {doc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsSection;