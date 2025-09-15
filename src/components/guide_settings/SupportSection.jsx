// src/components/guide_dashboard/settings/SupportSection.jsx
import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';

const SupportSection = ({ tickets, onCreateTicket }) => {
  return (
    <div className="p-6 bg-white shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Support Center</h2>
      
      <button 
        onClick={onCreateTicket}
        className="w-full px-6 py-3 mb-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create New Ticket
      </button>
      
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-gray-700">Recent Tickets</h3>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800">{ticket.title}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">Ticket #{ticket.id}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h3 className="mb-3 text-sm font-medium text-gray-700">Help Resources</h3>
        <div className="space-y-2">
          <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
            <FiHelpCircle className="mr-2 text-blue-600" />
            Help Center
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
            <FiHelpCircle className="mr-2 text-blue-600" />
            Community Guidelines
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
            <FiHelpCircle className="mr-2 text-blue-600" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;