import React, { useState } from 'react';
import { 
  FiMessageSquare,
  FiAlertTriangle,
  FiMapPin,
  FiMail,
  FiClock,
  FiCheckCircle,
  FiChevronRight
} from 'react-icons/fi';

const VendorSupport = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [formData, setFormData] = useState({
    type: 'location',
    subject: '',
    message: '',
    urgency: 'medium'
  });
  const [tickets, setTickets] = useState([
    {
      id: 1,
      type: 'location',
      subject: 'Incorrect pin location',
      message: 'Our cafe is actually 50m north of the marked location',
      date: '2023-08-15',
      status: 'resolved',
      adminResponse: 'Location updated on 8/16/2023'
    },
    {
      id: 2,
      type: 'technical',
      subject: 'Promotions not showing',
      message: 'Created 3 promotions but not appearing in app',
      date: '2023-08-10',
      status: 'in-progress',
      adminResponse: 'Investigating with tech team'
    }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicket = {
      id: tickets.length + 1,
      type: formData.type,
      subject: formData.subject,
      message: formData.message,
      date: new Date().toISOString().split('T')[0],
      status: 'new',
      adminResponse: null
    };
    setTickets([newTicket, ...tickets]);
    setFormData({
      type: 'location',
      subject: '',
      message: '',
      urgency: 'medium'
    });
    setActiveTab('my-tickets');
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'location': return <FiMapPin className="text-blue-600" />;
      case 'technical': return <FiAlertTriangle className="text-amber-600" />;
      default: return <FiMessageSquare className="text-indigo-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'resolved': 
        return <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">Resolved</span>;
      case 'in-progress': 
        return <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">In Progress</span>;
      default: 
        return <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full">New</span>;
    }
  };

  return (
    <section className="p-6 bg-white shadow-sm vendor-section rounded-xl">
      <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Admin Support</h2>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'new' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            New Request
          </button>
          <button
            onClick={() => setActiveTab('my-tickets')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'my-tickets' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            My Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'contact' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            Contact Admin
          </button>
        </div>
      </div>

      {activeTab === 'new' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Request Type*</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="location">Location Edit</option>
                <option value="technical">Technical Issue</option>
                <option value="account">Account Help</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Urgency*</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High (Urgent)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Subject*</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Details*</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Please describe your issue in detail..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      ) : activeTab === 'my-tickets' ? (
        <div className="space-y-4">
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <div key={ticket.id} className="overflow-hidden border rounded-xl">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 mt-1 bg-gray-100 rounded-full">
                        {getTypeIcon(ticket.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{ticket.subject}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <FiClock size={14} /> {ticket.date}
                          </span>
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FiChevronRight />
                    </button>
                  </div>
                </div>

                {ticket.adminResponse && (
                  <div className="p-6 border-t bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 mt-1 text-blue-600 bg-blue-100 rounded-full">
                        <FiCheckCircle size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Admin Response</h4>
                        <p className="mt-1 text-gray-700">{ticket.adminResponse}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-gray-50 rounded-xl">
              <p className="text-gray-500">You haven't submitted any support tickets yet</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 bg-blue-50 rounded-xl">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">Contact Roamio Admin</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 text-blue-600 bg-blue-100 rounded-full">
                  <FiMail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <a href="mailto:support@roamio.com" className="text-blue-600 hover:underline">
                    support@roamio.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 text-blue-600 bg-blue-100 rounded-full">
                  <FiClock size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response Time</p>
                  <p className="text-gray-800">Typically within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white border rounded-xl">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h3>
            </div>
            <div className="divide-y">
              <div className="p-6">
                <h4 className="font-medium text-gray-800">How do I update my business location?</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Submit a "Location Edit" request through the support form. Include your correct address and any supporting documents.
                </p>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-800">Why aren't my promotions showing?</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Promotions may take up to 2 hours to appear. If still not visible after this time, submit a technical support ticket.
                </p>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-800">How can I improve my recommendations?</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Ensure your profile is complete with high-quality photos, accurate hours, and detailed descriptions. Respond promptly to reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VendorSupport;