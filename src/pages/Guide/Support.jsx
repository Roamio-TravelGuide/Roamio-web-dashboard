import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supportAPI } from '../../api/support';
import { useAuth } from '../../contexts/authContext';
import { 
  FiMessageSquare,
  FiAlertTriangle,
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
  FiHelpCircle,
  FiLoader,
  FiPlus,
  FiEdit,
  FiEye,
  FiBarChart2,
  FiSmartphone,
  FiUserCheck,
  FiToggleLeft,
  FiToggleRight,
  FiMic,
  FiImage,
  FiMap,
  FiStar,
  FiAward,
  FiPlay
} from 'react-icons/fi';

const Support = () => {
  const [activeTab, setActiveTab] = useState('guide-help');
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    urgency: 'medium'
  });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const [categories, setCategories] = useState([]);

  const { user } = useAuth();

    useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await supportAPI.getCategories();
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Failed to load support categories');
      }
    };

    loadCategories();
  }, []);

    useEffect(() => {
    if (activeTab === 'my-tickets') {
      loadUserTickets();
    }
  }, [activeTab]);

  const loadUserTickets = async (page = 1) => {
    setTicketsLoading(true);
    try {
      const response = await supportAPI.getUserTickets({
        page,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc'
      });
      
      setTickets(response.data.tickets);
      setPagination({
        page: response.data.pagination.page,
        totalPages: response.data.pagination.totalPages,
        total: response.data.pagination.total
      });
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ticketData = {
        category: formData.category,
        subject: formData.subject,
        description: formData.description,
        urgency: formData.urgency
      };

      await supportAPI.createTicket(ticketData);
      
      toast.success('Support ticket created successfully');
      
      // Reset form
      setFormData({
        category: '',
        subject: '',
        description: '',
        urgency: 'medium'
      });
      
      // Switch to tickets tab and reload
      setActiveTab('my-tickets');
      loadUserTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      
      let errorMessage = 'Failed to create support ticket';
      
      // Handle validation errors
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        errorMessage = validationErrors.map(err => err.message).join('. ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    setTicketsLoading(true);
    try {
      const response = await supportAPI.getUserTickets();
      if (response.success) {
        setTickets(response.data.tickets || []);
        setPagination(response.data.pagination || { page: 1, totalPages: 1, total: 0 });
      } else {
        toast.error('Failed to fetch support tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-tickets') {
      fetchTickets();
    }
  }, [activeTab]);

  const getTypeIcon = (category) => {
    switch(category) {
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

  const getCategoryLabel = (category) => {
    const categoryMap = {
      'safety':'Safety Concerns',
      'harassment':'Harassment/Discrimination',
      'workplace':'Workplace Conditions',
      'payment':'Payment Issues',
      'equipment':'Equipment/Resources',
      'management':'Management Issues',
      'customer':'Customer Behavior',
      'scheduling':'Scheduling Problems',
      'training':'Training Issues',
      
    };
     return categoryMap[category] || category;

  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'resolved': 
        return <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">Resolved</span>;
      case 'in_progress': 
        return <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">In Progress</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs text-red-800 bg-red-100 rounded-full">Rejected</span>;
      default: 
        return <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full">Open</span>;
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch(urgency) {
      case 'critical':
        return <span className="px-2 py-1 text-xs text-red-800 bg-red-100 rounded-full">Critical</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">Low</span>;
      default:
        return <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full">Medium</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            My Tickets {pagination.total > 0 && `(${pagination.total})`}
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
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {formData.category && (
                <p className="mt-1 text-xs text-gray-500">
                  {categories.find(c => c.value === formData.category)?.description}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Urgency*</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High (Urgent)</option>
                <option value="critical">Critical</option>
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
              className={`w-full p-3 border rounded-lg ${
                formData.subject.length > 0 && formData.subject.length < 5 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300'
              }`}
              placeholder="Brief description of your issue"
              required
              disabled={loading}
              minLength={5}
              maxLength={200}
            />
            <div className="flex justify-between mt-1">
              <p className={`text-xs ${
                formData.subject.length > 0 && formData.subject.length < 5 
                  ? 'text-red-500' 
                  : 'text-gray-500'
              }`}>
                {formData.subject.length < 5 && formData.subject.length > 0 
                  ? `Subject must be at least 5 characters (${5 - formData.subject.length} more needed)`
                  : 'Minimum 5 characters'
                }
              </p>
              <p className="text-xs text-gray-500">
                {formData.subject.length}/200
              </p>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Details*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`w-full p-3 border rounded-lg ${
                formData.description.length > 0 && formData.description.length < 20 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300'
              }`}
              placeholder="Please describe your issue in detail..."
              required
              disabled={loading}
              minLength={20}
              maxLength={2000}
            />
            <div className="flex justify-between mt-1">
              <p className={`text-xs ${
                formData.description.length > 0 && formData.description.length < 20 
                  ? 'text-red-500' 
                  : 'text-gray-500'
              }`}>
                {formData.description.length < 20 && formData.description.length > 0 
                  ? `Description must be at least 20 characters (${20 - formData.description.length} more needed)`
                  : 'Minimum 20 characters'
                }
              </p>
              <p className="text-xs text-gray-500">
                {formData.description.length}/2000
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <FiLoader className="animate-spin" />}
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      ) : activeTab === 'my-tickets' ? (
        <div className="space-y-4">
          {ticketsLoading ? (
            <div className="flex items-center justify-center py-12">
              <FiLoader className="w-6 h-6 text-indigo-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading tickets...</span>
            </div>
          ) : tickets.length > 0 ? (
            <>
              {tickets.map(ticket => (
                <div key={ticket.id} className="overflow-hidden border rounded-xl">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 mt-1 bg-gray-100 rounded-full">
                          {getTypeIcon(ticket.category)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{ticket.subject}</h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <FiClock size={14} /> {formatDate(ticket.created_at)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {getCategoryLabel(ticket.category)}
                            </span>
                            {getStatusBadge(ticket.status)}
                            {getUrgencyBadge(ticket.urgency)}
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiChevronRight />
                      </button>
                    </div>
                  </div>

                  {ticket.resolution && (
                    <div className="p-6 border-t bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="p-2 mt-1 text-blue-600 bg-blue-100 rounded-full">
                          <FiCheckCircle size={16} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Admin Response</h4>
                          <p className="mt-1 text-gray-700">{ticket.resolution}</p>
                          {ticket.resolved_at && (
                            <p className="mt-2 text-xs text-gray-500">
                              Resolved on {formatDate(ticket.resolved_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total tickets)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadUserTickets(pagination.page - 1)}
                      disabled={pagination.page === 1 || ticketsLoading}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => loadUserTickets(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages || ticketsLoading}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center bg-gray-50 rounded-xl">
              <FiMessageSquare className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">You haven't submitted any support tickets yet</p>
              <button
                onClick={() => setActiveTab('new')}
                className="px-4 py-2 mt-4 text-indigo-600 rounded-lg bg-indigo-50 hover:bg-indigo-100"
              >
                Create your first ticket
              </button>
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

export default Support;