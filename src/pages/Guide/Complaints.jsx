import React from "react";
import {
  AlertTriangle,
  FileText,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  Send,
  Upload,
  Shield,
} from "lucide-react";

function Complaints() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Tour Guide Complaint Center
                </h1>
                <p className="text-gray-600 text-lg">
                  Report incidents, concerns, or workplace issues safely and
                  confidentially
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-1" />
              Confidential
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center text-blue-700 mb-2">
                <Shield className="w-5 h-5 mr-2" />
                <span className="font-semibold">Confidential Process</span>
              </div>
              <p className="text-blue-600 text-sm">
                Your identity is protected throughout the investigation
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center text-green-700 mb-2">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-semibold">24-48 Hour Response</span>
              </div>
              <p className="text-green-600 text-sm">
                We respond to all complaints within 2 business days
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center text-purple-700 mb-2">
                <FileText className="w-5 h-5 mr-2" />
                <span className="font-semibold">Documentation</span>
              </div>
              <p className="text-purple-600 text-sm">
                All cases are properly documented and tracked
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter your last name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tour Guide ID / Employee Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter your identification number"
                  />
                </div>
              </div>
            </div>

            {/* Incident Details Section */}
            <div>
              <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Incident Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date of Incident <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Tour location or venue"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Complaint Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Brief summary of the issue"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-white">
                    <option value="">Select a category</option>
                    <option value="safety">Safety Concerns</option>
                    <option value="harassment">
                      Harassment/Discrimination
                    </option>
                    <option value="workplace">Workplace Conditions</option>
                    <option value="payment">Payment Issues</option>
                    <option value="equipment">Equipment/Resources</option>
                    <option value="management">Management Issues</option>
                    <option value="customer">Customer Behavior</option>
                    <option value="scheduling">Scheduling Problems</option>
                    <option value="training">Training Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-white">
                    <option value="">Select priority</option>
                    <option value="low">🟢 Low - Minor inconvenience</option>
                    <option value="medium">
                      🟡 Medium - Significant concern
                    </option>
                    <option value="high">
                      🟠 High - Urgent attention needed
                    </option>
                    <option value="critical">
                      🔴 Critical - Immediate action required
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 resize-none"
                  placeholder="Please provide a detailed description of the incident, including:
• What happened exactly?
• Who was involved?
• When did it occur?
• Were there any witnesses?
• What was the impact?
• Any other relevant information..."
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    Be as specific as possible to help us understand and address
                    your concern
                  </span>
                  <span>0/2000 characters</span>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Information
              </h3>

              <div className="space-y-4"></div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Supporting Documents (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Upload photos, documents, emails, or other evidence (PDF, DOC,
                  DOCX, JPG, PNG, TXT - Max 10MB per file)
                </p>
              </div>
            </div>

            {/* Submit Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">
                    By submitting this complaint:
                  </p>
                  <ul className="text-xs space-y-1 text-gray-500">
                    <li>
                      • You confirm that the information provided is accurate
                    </li>
                    <li>
                      • You understand this will be investigated confidentially
                    </li>
                    <li>• You may be contacted for additional information</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Complaint
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
      </div>
    </div>
  );
}

export default Complaints;
