import React, { useState } from 'react';
import { 
  FiMapPin, 
  FiClock, 
  FiEye, 
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit2
} from 'react-icons/fi';

const VendorLocation = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [hours, setHours] = useState({
    monday: { open: '08:00', close: '20:00' },
    tuesday: { open: '08:00', close: '20:00' },
    wednesday: { open: '08:00', close: '20:00' },
    thursday: { open: '08:00', close: '20:00' },
    friday: { open: '08:00', close: '22:00' },
    saturday: { open: '09:00', close: '22:00' },
    sunday: { open: '09:00', close: '18:00' }
  });

  // Mock coordinates (replace with actual data)
  const location = {
    lat: 40.7128,
    lng: -74.0060,
    address: '123 Business Ave, New York, NY 10001'
  };

  const handleTimeChange = (day, field, value) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    // TODO: API call to update availability
  };

  const saveHours = () => {
    setEditMode(false);
    // TODO: API call to save hours
  };

  return (
    <section className="p-6 bg-white shadow-sm vendor-section rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Location & Visibility</h2>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 text-sm ${isAvailable ? 'text-green-600' : 'text-amber-600'}`}>
            {isAvailable ? (
              <>
                <FiCheckCircle /> Currently Visible
              </>
            ) : (
              <>
                <FiAlertCircle /> Hidden from Travelers
              </>
            )}
          </span>
          <button
            onClick={toggleAvailability}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${isAvailable ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}
          >
            {isAvailable ? <FiEyeOff size={14} /> : <FiEye size={14} />}
            {isAvailable ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Map Section */}
        <div className="space-y-4 lg:col-span-2">
          <div className="h-64 overflow-hidden bg-gray-200 rounded-xl">
            <iframe
              title="Business Location"
              className="w-full h-full"
              src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
            <FiMapPin className="flex-shrink-0 mt-1 text-blue-600" />
            <div>
              <p className="font-medium text-gray-800">Business Address</p>
              <p className="text-gray-600">{location.address}</p>
              <p className="mt-2 text-sm text-gray-500">
                Status: <span className="text-green-600">Verified by Admin</span>
              </p>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <FiClock /> Operating Hours
            </h3>
            {editMode ? (
              <button
                onClick={saveHours}
                className="px-3 py-1 text-sm text-white bg-green-600 rounded-lg"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-lg"
              >
                <FiEdit2 size={14} /> Edit
              </button>
            )}
          </div>

          <div className="space-y-3">
            {Object.entries(hours).map(([day, times]) => (
              <div key={day} className="flex items-center justify-between">
                <span className="w-24 font-medium text-gray-700 capitalize">
                  {day}
                </span>
                {editMode ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={times.open}
                      onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                      className="p-2 text-sm border rounded-lg"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={times.close}
                      onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                      className="p-2 text-sm border rounded-lg"
                    />
                  </div>
                ) : (
                  <span className="text-gray-600">
                    {times.open} - {times.close}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Special Hours Notice */}
          <div className="p-3 mt-6 border rounded-lg bg-amber-50 border-amber-200">
            <p className="text-sm text-amber-800">
              <span className="font-medium">Note:</span> Special holiday hours may override these schedules.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorLocation;