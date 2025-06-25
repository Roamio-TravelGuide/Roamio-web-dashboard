import React from 'react';
import type { TourPackage } from '../../types/tour';

interface BasicInfoStepProps {
  tourData: TourPackage;
  onUpdate: (data: Partial<TourPackage>) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  tourData,
  onUpdate
}) => {
  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Basic Tour Information
        </h2>
        <p className="text-gray-600">
          Provide the essential details about your tour package
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
            Tour Title *
          </label>
          <input
            type="text"
            id="title"
            value={tourData.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter an engaging title for your tour"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={tourData.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe what makes your tour special..."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">
              Price (LKR) *
            </label>
            <input
              type="number"
              id="price"
              value={tourData.price || ''}
              onChange={(e) => onUpdate({ price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-700">
              Estimated Duration (minutes) *
            </label>
            <input
              type="number"
              id="duration"
              value={tourData.duration_minutes || ''}
              onChange={(e) => onUpdate({ duration_minutes: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="60"
              min="1"
              required
            />
          </div>
        </div>

        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h4 className="mb-2 font-medium text-blue-900">💡 Tips for Success</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Use a descriptive, engaging title that captures the essence of your tour</li>
            <li>• Include key highlights and unique features in your description</li>
            <li>• Price competitively based on tour length and content quality</li>
            <li>• Duration will be validated against your audio content length</li>
          </ul>
        </div>
      </div>
    </div>
  );
};