import React, { useState } from 'react';
import { 
  FiMessageSquare,
  FiAlertTriangle,
  FiMapPin,
  FiMail,
  FiClock,
  FiCheckCircle,
  FiChevronRight,
  FiShield,
  FiUser,
  FiDollarSign,
  FiTool,
  FiBriefcase,
  FiUsers,
  FiCalendar,
  FiBook,
  FiHelpCircle
} from 'react-icons/fi';

const Support = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    message: '',
    urgency: 'medium'
  });
  const [tickets, setTickets] = useState([
    {
      id: 1,
      type: 'safety',
      subject: 'Unsafe working conditions',
      message: 'The equipment in our workspace is outdated and potentially dangerous',
      date: '2023-08-15',
      status: 'resolved',
      adminResponse: 'Safety inspection scheduled for 8/20/2023'
    },
    {
      id: 2,
      type: 'payment',
      subject: 'Delayed payments',
      message: 'Haven\'t received payment for last month\'s work',
      date: '2023-08-10',
      status: 'in-progress',
      adminResponse: 'Finance team is processing the payment'
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
      type: '',
      subject: '',
      message: '',
      urgency: 'medium'
    });
    setActiveTab('my-tickets');
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'safety': return <FiShield className="text-red-600" />;
      case 'harassment': return <FiUser className="text-purple-600" />;
      case 'workplace': return <FiBriefcase className="text-amber-600" />;
      case 'payment': return <FiDollarSign className="text-green-600" />;
      case 'equipment': return <FiTool className="text-blue-600" />;
      case 'management': return <FiUsers className="text-indigo-600" />;
      case 'customer': return <FiUser className="text-pink-600" />;
      case 'scheduling': return <FiCalendar className="text-teal-600" />;
      case 'training': return <FiBook className="text-orange-600" />;
      default: return <FiHelpCircle className="text-gray-600" />;
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'safety': return 'Safety Concerns';
      case 'harassment': return 'Harassment/Discrimination';
      case 'workplace': return 'Workplace Conditions';
      case 'payment': return 'Payment Issues';
      case 'equipment': return 'Equipment/Resources';
      case 'management': return 'Management Issues';
      case 'customer': return 'Customer Behavior';
      case 'scheduling': return 'Scheduling Problems';
      case 'training': return 'Training Issues';
      default: return 'Other';
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
        <h2 className="text-2xl font-bold text-gray-800">Vendor Support</h2>
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
              <label className="block mb-1 text-sm font-medium text-gray-700">Category*</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select a category</option>
                <option value="safety">Safety Concerns</option>
                <option value="harassment">Harassment/Discrimination</option>
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
                          <span className="text-sm text-gray-500">
                            {getTypeLabel(ticket.type)}
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
            <h3 className="mb-3 text-lg font-semibold text-gray-800">Contact Support Team</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 text-blue-600 bg-blue-100 rounded-full">
                  <FiMail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                    support@example.com
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
                <h4 className="font-medium text-gray-800">How quickly are safety concerns addressed?</h4>
                <p className="mt-2 text-sm text-gray-600">
                  All safety concerns are prioritized and typically addressed within 24 hours. Emergency situations are handled immediately.
                </p>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-800">What payment issues can I report?</h4>
                <p className="mt-2 text-sm text-gray-600">
                  You can report missing payments, incorrect amounts, or payment delays. Please include invoice numbers and dates for faster resolution.
                </p>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-800">How are harassment complaints handled?</h4>
                <p className="mt-2 text-sm text-gray-600">
                  All harassment complaints are treated with strict confidentiality and investigated promptly by our HR team.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Support;