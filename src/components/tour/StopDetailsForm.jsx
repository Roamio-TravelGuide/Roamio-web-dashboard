import React, { useState, useEffect } from 'react';

export const StopDetailsForm = ({ stop, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState(stop);

  useEffect(() => {
    setFormData(stop);
  }, [stop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.stop_name.trim() === '') {
      alert('Stop name is required');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl w-96">
      <div className="p-4 bg-gradient-to-r from-teal-500 to-blue-500">
        <h3 className="text-lg font-semibold text-white">Stop Details</h3>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Stop Name</label>
          <input
            type="text"
            name="stop_name"
            value={formData.stop_name}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="p-3 border border-gray-100 rounded-lg bg-gray-50">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Coordinates</label>
            <div className="mt-1 text-sm text-gray-600">
              Lat: {formData.location.latitude.toFixed(6)}, Lng: {formData.location.longitude.toFixed(6)}
            </div>
          </div>
          
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <div className="mt-1 text-sm text-gray-600">
              {formData.location.address || 'Address not available'}
            </div>
          </div>
          
          {(formData.location.city || formData.location.district || formData.location.province || formData.location.postal_code) && (
            <div className="grid grid-cols-2 gap-2">
              {formData.location.city && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <div className="mt-1 text-sm text-gray-600">
                    {formData.location.city}
                  </div>
                </div>
              )}
              
              {formData.location.district && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <div className="mt-1 text-sm text-gray-600">
                    {formData.location.district}
                  </div>
                </div>
              )}
              
              {formData.location.province && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Province</label>
                  <div className="mt-1 text-sm text-gray-600">
                    {formData.location.province}
                  </div>
                </div>
              )}
              
              {formData.location.postal_code && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <div className="mt-1 text-sm text-gray-600">
                    {formData.location.postal_code}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={() => stop.id && onDelete(stop.id)}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-lg shadow-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={!stop.id}
          >
            Delete
          </button>
          
          <div className="space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg shadow-xs hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};