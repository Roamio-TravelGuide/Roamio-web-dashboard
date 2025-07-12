import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User,
  Calendar,
  Eye,
  MessageCircle,
  Flag,
  MoreVertical,
  Check,
  X,
  ChevronDown,
  UserCheck,
  Trash2
} from 'lucide-react';

const ComplaintManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const complaintStats = [
    {
      title: 'Total Complaints',
      value: '127',
      change: '-8%',
      changeType: 'negative',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      title: 'Pending Review',
      value: '23',
      change: '+5%',
      changeType: 'positive',
      icon: Clock,
      color: 'amber'
    },
    {
      title: 'Resolved Today',
      value: '12',
      change: '+15%', 
      changeType: 'positive',
      icon: CheckCircle2,
      color: 'emerald'
    },
    {
      title: 'Critical Tasks',
      value: '8',
      change: '-2%',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const complaints = [
    {
      id: 'CMP-001',
      title: 'Audio quality issues in Paris tour',
      complainant: 'Mike Chen',
      complainantType: 'Traveller',
      against: 'Sarah Johnson (Travel Guide)',
      category: 'Audio Quality',
      priority: 'High',
      status: 'In Progress',
      date: '2024-01-15',
      description: 'The audio in the Louvre section was very quiet and had background noise',
      tourTitle: 'Historic Paris Walking Tour',
      response: 'Under review by technical team'
    },
    {
      id: 'CMP-002', 
      title: 'Inappropriate content in tour narration',
      complainant: 'Emma Wilson',
      complainantType: 'Traveller',
      against: 'Alex Rodriguez (Travel Guide)',
      category: 'Content Violation',
      priority: 'Critical',
      status: 'Pending',
      date: '2024-01-14',
      description: 'Tour guide included inappropriate jokes and offensive language',
      tourTitle: 'Barcelona Cultural Tour',
      response: null
    },
    {
      id: 'CMP-003',
      title: 'Vendor location incorrect',
      complainant: 'Lisa Park',
      complainantType: 'Travel Guide', 
      against: 'Café Central (Vendor)',
      category: 'Location Error',
      priority: 'Medium',
      status: 'Resolved',
      date: '2024-01-13',
      description: 'Restaurant marked as open but was closed for renovation',
      tourTitle: null,
      response: 'Vendor has updated their hours and location status'
    },
    {
      id: 'CMP-004',
      title: 'Tour guide no-show',
      complainant: 'John Smith',
      complainantType: 'Traveller',
      against: 'Maria Garcia (Travel Guide)',
      category: 'Service Issue',
      priority: 'High',
      status: 'In Progress',
      date: '2024-01-12',
      description: 'Booked private tour but guide never showed up at meeting point',
      tourTitle: 'Madrid Private Walking Tour',
      response: 'Attempting to contact guide for explanation'
    },
    {
      id: 'CMP-005',
      title: 'Billing discrepancy',
      complainant: 'Anna Chen',
      complainantType: 'Traveller',
      against: 'System/Admin',
      category: 'Billing',
      priority: 'Medium',
      status: 'Resolved',
      date: '2024-01-11',
      description: 'Charged twice for the same audio tour package',
      tourTitle: 'London Historic Tour',
      response: 'Refund processed within 3-5 business days'
    }
  ];

  // Filter complaints based on selected filter
  const filteredComplaints = complaints.filter(complaint => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'pending' && complaint.status === 'Pending') ||
      (selectedFilter === 'in-progress' && complaint.status === 'In Progress') ||
      (selectedFilter === 'resolved' && complaint.status === 'Resolved') ||
      (selectedFilter === 'critical' && complaint.priority === 'Critical');
    
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getFilterCount = (filterId) => {
    if (filterId === 'all') return complaints.length;
    if (filterId === 'pending') return complaints.filter(c => c.status === 'Pending').length;
    if (filterId === 'in-progress') return complaints.filter(c => c.status === 'In Progress').length;
    if (filterId === 'resolved') return complaints.filter(c => c.status === 'Resolved').length;
    if (filterId === 'critical') return complaints.filter(c => c.priority === 'Critical').length;
    return 0;
  };

  const filterOptions = [
    { id: 'all', label: 'All Complaints' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' },
    { id: 'critical', label: 'Critical' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-amber-100 text-amber-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-emerald-100 text-emerald-800',
      'Closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-800',
      'High': 'bg-orange-100 text-orange-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Audio Quality': 'bg-blue-100 text-blue-800',
      'Content Violation': 'bg-red-100 text-red-800',
      'Location Error': 'bg-amber-100 text-amber-800',
      'Service Issue': 'bg-purple-100 text-purple-800',
      'Billing': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      red: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[color];
  };

  const getIconBg = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      amber: 'bg-amber-500',
      emerald: 'bg-emerald-500',
      red: 'bg-red-500'
    };
    return colors[color];
  };

  const handleSelectComplaint = (complaintId) => {
    setSelectedComplaints(prev => 
      prev.includes(complaintId) 
        ? prev.filter(id => id !== complaintId)
        : [...prev, complaintId]
    );
  };

  const handleSelectAll = () => {
    if (selectedComplaints.length === filteredComplaints.length) {
      setSelectedComplaints([]);
    } else {
      setSelectedComplaints(filteredComplaints.map(c => c.id));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Applying ${action} to complaints:`, selectedComplaints);
    setSelectedComplaints([]);
    setShowBulkActions(false);
  };

  const bulkActions = [
    { id: 'resolved', label: 'Mark as Resolved', icon: CheckCircle2, color: 'text-emerald-600' },
    { id: 'in-progress', label: 'Move to In Progress', icon: Clock, color: 'text-blue-600' },
    { id: 'priority', label: 'Change Priority', icon: Flag, color: 'text-orange-600' },
    { id: 'assign', label: 'Assign to Agent', icon: UserCheck, color: 'text-purple-600' },
    { id: 'delete', label: 'Delete/Archive', icon: Trash2, color: 'text-red-600' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button 
              onClick={() => setShowBulkActions(!showBulkActions)}
              disabled={selectedComplaints.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedComplaints.length > 0 
                  ? 'bg-teal-600 text-white hover:bg-teal-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>Bulk Actions ({selectedComplaints.length})</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showBulkActions && selectedComplaints.length > 0 && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2">
                  {bulkActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleBulkAction(action.id)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <action.icon className={`w-4 h-4 ${action.color}`} />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complaint Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complaintStats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-xl border ${getColorClasses(stat.color)} hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last week</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${getIconBg(stat.color)} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedFilter(option.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedFilter === option.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label} ({getFilterCount(option.id)})
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedComplaints.length === filteredComplaints.length && filteredComplaints.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Complaint</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Complainant</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Against</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedComplaints.includes(complaint.id)}
                      onChange={() => handleSelectComplaint(complaint.id)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{complaint.id}</p>
                      <p className="text-sm text-gray-600 mt-1">{complaint.title}</p>
                      {complaint.tourTitle && (
                        <p className="text-xs text-teal-600 mt-1">{complaint.tourTitle}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{complaint.complainant}</p>
                        <p className="text-sm text-gray-500">{complaint.complainantType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900">{complaint.against}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(complaint.category)}`}>
                      {complaint.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(complaint.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="View Details">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Respond">
                        <MessageCircle className="w-4 h-4 text-teal-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredComplaints.length}</span> of{' '}
            <span className="font-medium">{filteredComplaints.length}</span> complaints
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagement;