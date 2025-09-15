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

  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ticketData = {
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        urgency: formData.urgency
      };

      const response = await supportAPI.createTicket(ticketData);
      
      if (response.success) {
        toast.success('Support ticket created successfully!');
        setFormData({
          category: '',
          subject: '',
          description: '',
          urgency: 'medium'
        });
        setActiveTab('my-tickets');
        fetchTickets();
      } else {
        toast.error(response.message || 'Failed to create support ticket');
      }
    } catch (error) {
      console.error('Error creating support ticket:', error);
      
      if (error.response?.data?.details) {
        const errorDetails = error.response.data.details;
        const errorMessages = [];
        
        if (errorDetails.subject) {
          errorMessages.push(`Subject: ${errorDetails.subject}`);
        }
        if (errorDetails.description) {
          errorMessages.push(`Description: ${errorDetails.description}`);
        }
        if (errorDetails.category) {
          errorMessages.push(`Category: ${errorDetails.category}`);
        }
        
        if (errorMessages.length > 0) {
          toast.error(`Please fix the following:\n${errorMessages.join('\n')}`);
        } else {
          toast.error(error.response.data.message || 'Validation failed');
        }
      } else {
        toast.error(error.response?.data?.message || 'Failed to create support ticket. Please try again.');
      }
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
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="pb-12 mt-5">
        <div className="mx-auto sm:px-6 lg:px-12">
          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab('guide-help')}
              className={`px-5 py-3 rounded-xl transition-all duration-300 flex items-center ${
                activeTab === 'guide-help' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              <FiAward className="mr-2" />
              Guide Help Center
            </button>
            <button
              onClick={() => setActiveTab('my-tickets')}
              className={`px-5 py-3 rounded-xl transition-all duration-300 flex items-center ${
                activeTab === 'my-tickets' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              <FiMessageSquare className="mr-2" />
              My Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-5 py-3 rounded-xl transition-all duration-300 flex items-center ${
                activeTab === 'contact' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              <FiMail className="mr-2" />
              Contact Us
            </button>
          </div>

          {activeTab === 'guide-help' ? (
            <div className="space-y-8">
              {/* Welcome Card */}
              <div className="p-8 bg-white shadow-lg rounded-2xl">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 mb-4 bg-indigo-100 rounded-full">
                    <FiMap className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-gray-800">Tour Guide Playbook</h2>
                  <p className="max-w-2xl text-gray-600">
                    Everything you need to create amazing tours and grow your audience, explained simply!
                  </p>
                </div>
              </div>

              {/* Quick Start Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Create Tour Card */}
                <div className="p-6 transition-shadow duration-300 bg-white shadow-md rounded-2xl hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="p-3 mr-3 text-white bg-green-500 rounded-lg">
                      <FiPlus className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Create Your First Tour</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white bg-indigo-500 rounded-full">1</span>
                      <p>Click "Create New Tour" in your dashboard</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white bg-indigo-500 rounded-full">2</span>
                      <p>Add a catchy title and description</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white bg-indigo-500 rounded-full">3</span>
                      <p>Record your audio clips (1-3 mins each)</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white bg-indigo-500 rounded-full">4</span>
                      <p>Upload beautiful photos of locations</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        <FiClock className="inline mr-1" /> Takes about 20-30 minutes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Make It Great Card */}
                <div className="p-6 transition-shadow duration-300 bg-white shadow-md rounded-2xl hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="p-3 mr-3 text-white bg-purple-500 rounded-lg">
                      <FiStar className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Make It Awesome</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white bg-purple-500 rounded-full">★</span>
                      <p>Share personal stories - travelers love them!</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white bg-purple-500 rounded-full">★</span>
                      <p>Add fun facts about each location</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white bg-purple-500 rounded-full">★</span>
                      <p>Keep audio energetic and clear</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white bg-purple-500 rounded-full">★</span>
                      <p>Use high-quality images (1200x800px)</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        <FiMic className="inline mr-1" /> Speak naturally like you're talking to a friend
                      </p>
                    </div>
                  </div>
                </div>

                {/* Traveler Mode Card */}
                <div className="p-6 transition-shadow duration-300 bg-white shadow-md rounded-2xl hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="p-3 mr-3 text-white rounded-lg bg-amber-500">
                      <FiSmartphone className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Try Traveler Mode</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white rounded-full bg-amber-500">➤</span>
                      <p>Open the app on your phone</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white rounded-full bg-amber-500">➤</span>
                      <p>Tap your profile picture</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white rounded-full bg-amber-500">➤</span>
                      <p>Select "Switch to Traveler Mode"</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 mt-1 mr-2 text-sm font-bold text-white rounded-full bg-amber-500">➤</span>
                      <p>Experience tours like your travelers do!</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        <FiToggleRight className="inline mr-1" /> Switch back anytime
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Tutorial Section */}
              <div className="p-6 bg-indigo-50 rounded-2xl">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 mb-4 bg-white rounded-full shadow-md">
                    <FiPlay className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-800">Quick Video Guides</h3>
                  <p className="mb-4 text-gray-600">Watch these short tutorials to get started</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-white shadow-sm rounded-xl">
                      <div className="mb-3 bg-gray-200 rounded-lg aspect-w-16 aspect-h-9"></div>
                      <h4 className="font-medium text-gray-800">Creating Your First Tour</h4>
                      <p className="text-sm text-gray-500">2:15 min</p>
                    </div>
                    <div className="p-4 bg-white shadow-sm rounded-xl">
                      <div className="mb-3 bg-gray-200 rounded-lg aspect-w-16 aspect-h-9"></div>
                      <h4 className="font-medium text-gray-800">Recording Great Audio</h4>
                      <p className="text-sm text-gray-500">3:42 min</p>
                    </div>
                    <div className="p-4 bg-white shadow-sm rounded-xl">
                      <div className="mb-3 bg-gray-200 rounded-lg aspect-w-16 aspect-h-9"></div>
                      <h4 className="font-medium text-gray-800">Using Traveler Mode</h4>
                      <p className="text-sm text-gray-500">1:58 min</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="p-6 bg-white shadow-md rounded-2xl">
                <h3 className="mb-4 text-xl font-bold text-gray-800">Quick Answers</h3>
                <div className="space-y-4">
                  <div className="p-4 transition-colors duration-200 border border-gray-100 rounded-lg hover:border-indigo-200 hover:bg-indigo-50">
                    <h4 className="flex items-center font-medium text-gray-800">
                      <FiHelpCircle className="mr-2 text-indigo-500" />
                      How long does approval take?
                    </h4>
                    <p className="mt-2 text-gray-600">
                      Usually 24-48 hours! We check audio quality, content, and images to make sure travelers get the best experience.
                    </p>
                  </div>
                  <div className="p-4 transition-colors duration-200 border border-gray-100 rounded-lg hover:border-indigo-200 hover:bg-indigo-50">
                    <h4 className="flex items-center font-medium text-gray-800">
                      <FiHelpCircle className="mr-2 text-indigo-500" />
                      When do I get paid?
                    </h4>
                    <p className="mt-2 text-gray-600">
                      Payments come monthly on the 15th. You earn 80% of each tour price (we take 20% to keep the platform running).
                    </p>
                  </div>
                  <div className="p-4 transition-colors duration-200 border border-gray-100 rounded-lg hover:border-indigo-200 hover:bg-indigo-50">
                    <h4 className="flex items-center font-medium text-gray-800">
                      <FiHelpCircle className="mr-2 text-indigo-500" />
                      Can I update my tours?
                    </h4>
                    <p className="mt-2 text-gray-600">
                      Absolutely! Edit anytime, but changes need quick re-approval (usually faster than the first review).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'my-tickets' ? (
            <div className="space-y-4">
              {ticketsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <FiLoader className="w-6 h-6 text-indigo-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Loading tickets...</span>
                </div>
              ) : tickets.length > 0 ? (
                tickets.map(ticket => (
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
                                {getTypeLabel(ticket.category)}
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
                ))
              ) : (
                <div className="py-12 text-center bg-gray-50 rounded-xl">
                  <FiMessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">You haven't submitted any support tickets yet</p>
                  <button 
                    onClick={() => setActiveTab('contact')} 
                    className="mt-3 font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Create your first ticket
                  </button>
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
        </div>
      </div>
    </div>
  );
};

export default Support;