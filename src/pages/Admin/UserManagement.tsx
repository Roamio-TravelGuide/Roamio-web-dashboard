import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  Award,
  Globe,
  Download,
  CheckCircle,
  Clock,
  X,
  Star,
  Headphones,
  Users,
  AlertTriangle,
  Paperclip,
  DollarSign,
  Package,
  Upload,
  User,
  Building,
  Coffee
} from 'lucide-react';

interface TourPackage {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  downloads: number;
  duration: string;
  image: string;
  status: string;
}

interface SponsoredPlace {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  image: string;
  sponsorshipType: string;
  monthlyFee: number;
}

interface ReviewedPackage {
  id: string;
  title: string;
  guide: string;
  reviewDate: string;
  status: string;
  rating: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  type: 'Travel Guide' | 'Traveller' | 'Vendor' | 'Moderator';
  status: 'Active' | 'Inactive';
  joinDate: string;
  avatar: string;
  // Travel Guide specific fields
  documents?: string;
  contact?: { email: string; phone: string };
  certification?: 'Certified' | 'Pending';
  experience?: string;
  languagesSpoken?: string[];
  tourPackages?: TourPackage[];
  totalEarnings?: string;
  // Traveller specific fields
  downloadedPackages?: TourPackage[];
  // Moderator specific fields
  region?: string;
  reviewedPackages?: ReviewedPackage[];
  // Vendor specific fields
  location?: string;
  sponsoredPlaces?: SponsoredPlace[];
}

const UserManagement: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGuideProfile, setShowGuideProfile] = useState(false);
  const [showEditGuide, setShowEditGuide] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<User | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    active: false,
    inactive: false,
    certified: false
  });

  const users: User[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      type: 'Travel Guide',
      status: 'Active',
      joinDate: '2024-01-15',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      documents: 'Documents Available',
      contact: { email: 'sarah.johnson@email.com', phone: '+33 1 23 45 67 89' },
      certification: 'Certified',
      experience: '5 years',
      languagesSpoken: ['English', 'French', 'Spanish'],
      totalEarnings: '$12,450',
      tourPackages: [
        {
          id: 'T1',
          title: 'Historic Paris Walking Tour',
          location: 'Paris, France',
          price: 24.99,
          rating: 4.8,
          downloads: 1250,
          duration: '2.5 hours',
          image: 'https://images.pexels.com/photos/161853/paris-france-tower-eiffel-161853.jpeg?auto=compress&cs=tinysrgb&w=400',
          status: 'Published'
        },
        {
          id: 'T2',
          title: 'Louvre Museum Audio Guide',
          location: 'Paris, France',
          price: 19.99,
          rating: 4.9,
          downloads: 890,
          duration: '3 hours',
          image: 'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg?auto=compress&cs=tinysrgb&w=400',
          status: 'Published'
        },
        {
          id: 'T3',
          title: 'Montmartre Art District Tour',
          location: 'Paris, France',
          price: 22.99,
          rating: 4.7,
          downloads: 650,
          duration: '2 hours',
          image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400',
          status: 'Draft'
        }
      ]
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      type: 'Traveller',
      status: 'Active',
      joinDate: '2024-02-20',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      contact: { email: 'mike.chen@email.com', phone: '+81 90 1234 5678' },
      downloadedPackages: [
        {
          id: 'D1',
          title: 'Tokyo Street Food Adventure',
          location: 'Tokyo, Japan',
          price: 18.99,
          rating: 4.6,
          downloads: 2340,
          duration: '3 hours',
          image: 'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=400',
          status: 'Downloaded'
        },
        {
          id: 'D2',
          title: 'Kyoto Temple Walk',
          location: 'Kyoto, Japan',
          price: 22.99,
          rating: 4.8,
          downloads: 1890,
          duration: '2.5 hours',
          image: 'https://images.pexels.com/photos/161401/fushimi-inari-taisha-shrine-kyoto-japan-temple-161401.jpeg?auto=compress&cs=tinysrgb&w=400',
          status: 'Downloaded'
        }
      ]
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      type: 'Vendor',
      status: 'Active',
      joinDate: '2024-01-08',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      location: 'London, UK',
      contact: { email: 'emma.davis@email.com', phone: '+44 20 7123 4567' },
      sponsoredPlaces: [
        {
          id: 'SP1',
          name: 'The Crown & Anchor Pub',
          type: 'Restaurant',
          location: 'Covent Garden, London',
          rating: 4.5,
          image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=400',
          sponsorshipType: 'Premium Listing',
          monthlyFee: 299
        },
        {
          id: 'SP2',
          name: 'Borough Market Café',
          type: 'Café',
          location: 'Borough Market, London',
          rating: 4.7,
          image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
          sponsorshipType: 'Featured Placement',
          monthlyFee: 199
        }
      ]
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@email.com',
      type: 'Moderator',
      status: 'Active',
      joinDate: '2023-12-01',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      region: 'Europe',
      reviewedPackages: [
        {
          id: 'RP1',
          title: 'Barcelona Gothic Quarter Tour',
          guide: 'Maria Santos',
          reviewDate: '2024-01-10',
          status: 'Approved',
          rating: 4.8
        },
        {
          id: 'RP2',
          title: 'Madrid Flamenco Experience',
          guide: 'Carlos Mendez',
          reviewDate: '2024-01-08',
          status: 'Approved',
          rating: 4.6
        },
        {
          id: 'RP3',
          title: 'Seville Cathedral Audio Guide',
          guide: 'Ana Lopez',
          reviewDate: '2024-01-05',
          status: 'Rejected',
          rating: 3.2
        }
      ]
    },
    {
      id: 5,
      name: 'Lisa Park',
      email: 'lisa.park@email.com',
      type: 'Travel Guide',
      status: 'Inactive',
      joinDate: '2023-11-12',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      documents: 'Documents Available',
      contact: { email: 'lisa.park@email.com', phone: '+82 10 1234 5678' },
      certification: 'Pending',
      experience: '3 years',
      languagesSpoken: ['English', 'Korean', 'Japanese'],
      totalEarnings: '$8,230',
      tourPackages: [
        {
          id: 'T4',
          title: 'Seoul Traditional Culture Tour',
          location: 'Seoul, South Korea',
          price: 26.99,
          rating: 4.6,
          downloads: 420,
          duration: '3.5 hours',
          image: 'https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg?auto=compress&cs=tinysrgb&w=400',
          status: 'Published'
        }
      ]
    },
    {
      id: 6,
      name: 'John Smith',
      email: 'john.smith@email.com',
      type: 'Traveller',
      status: 'Active',
      joinDate: '2024-01-25',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      contact: { email: 'john.smith@email.com', phone: '+1 555 123 4567' },
      downloadedPackages: [
        {
          id: 'D3',
          title: 'New York Central Park Tour',
          location: 'New York, USA',
          price: 15.99,
          rating: 4.4,
          downloads: 3200,
          duration: '2 hours',
          image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
          status: 'Downloaded'
        }
      ]
    },
    {
      id: 7,
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      type: 'Moderator',
      status: 'Active',
      joinDate: '2023-10-15',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      region: 'Americas',
      reviewedPackages: [
        {
          id: 'RP4',
          title: 'Mexico City Historic Center',
          guide: 'Diego Rivera',
          reviewDate: '2024-01-12',
          status: 'Approved',
          rating: 4.9
        }
      ]
    },
    {
      id: 8,
      name: 'Café Central',
      email: 'info@cafecentral.com',
      type: 'Vendor',
      status: 'Active',
      joinDate: '2024-01-10',
      avatar: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&h=150&fit=crop&crop=center',
      location: 'Vienna, Austria',
      contact: { email: 'info@cafecentral.com', phone: '+43 1 533 3763' },
      sponsoredPlaces: [
        {
          id: 'SP3',
          name: 'Café Central Vienna',
          type: 'Historic Café',
          location: 'Herrengasse 14, Vienna',
          rating: 4.8,
          image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400',
          sponsorshipType: 'Premium Listing',
          monthlyFee: 399
        }
      ]
    }
  ];

  // Filter users based on selected filter and active filters
  const filteredUsers = users.filter(user => {
    const matchesFilter = selectedFilter === 'all' ||
      (selectedFilter === 'travellers' && user.type === 'Traveller') ||
      (selectedFilter === 'guides' && user.type === 'Travel Guide') ||
      (selectedFilter === 'vendors' && user.type === 'Vendor') ||
      (selectedFilter === 'moderators' && user.type === 'Moderator');

    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply active filters
    let matchesActiveFilters = true;
    if (activeFilters.active && user.status !== 'Active') matchesActiveFilters = false;
    if (activeFilters.inactive && user.status !== 'Inactive') matchesActiveFilters = false;
    if (activeFilters.certified && user.certification !== 'Certified') matchesActiveFilters = false;

    return matchesFilter && matchesSearch && matchesActiveFilters;
  });

  const getFilterCount = (filterId: string) => {
    if (filterId === 'all') return users.length;
    if (filterId === 'travellers') return users.filter(u => u.type === 'Traveller').length;
    if (filterId === 'guides') return users.filter(u => u.type === 'Travel Guide').length;
    if (filterId === 'vendors') return users.filter(u => u.type === 'Vendor').length;
    if (filterId === 'moderators') return users.filter(u => u.type === 'Moderator').length;
    return 0;
  };

  const userTypes = [
    { id: 'all', label: 'All Users' },
    { id: 'travellers', label: 'Travellers' },
    { id: 'guides', label: 'Travel Guides' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'moderators', label: 'Moderators' },
  ];

  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Travel Guide': 'bg-blue-100 text-blue-800',
      'Traveller': 'bg-purple-100 text-purple-800',
      'Vendor': 'bg-amber-100 text-amber-800',
      'Moderator': 'bg-emerald-100 text-emerald-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCertificationColor = (certification: string) => {
    return certification === 'Certified'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-amber-100 text-amber-800';
  };

  const getCertificationIcon = (certification: string) => {
    return certification === 'Certified'
      ? <CheckCircle className="w-3 h-3" />
      : <Clock className="w-3 h-3" />;
  };

  const handleViewUser = (user: User) => {
    setSelectedGuide(user);
    setShowGuideProfile(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedGuide(user);
    setShowEditGuide(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedGuide(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log('Deleting user:', selectedGuide?.name);
    setShowDeleteConfirm(false);
    setSelectedGuide(null);
  };

  const handleDeletePackage = (packageId: string) => {
    console.log('Deleting package:', packageId);
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'Published'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-amber-100 text-amber-800';
  };

  const handleFilterChange = (filterKey: keyof typeof activeFilters) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const renderTableHeaders = () => {
    const baseHeaders = (
      <>
        <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
        <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
        <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
      </>
    );

    let specificHeaders;
    switch (selectedFilter) {
      case 'guides':
        specificHeaders = (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Documents</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Certification</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Experience</th>
          </>
        );
        break;
      case 'travellers':
        specificHeaders = (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Downloaded Packages</th>
          </>
        );
        break;
      case 'moderators':
        specificHeaders = (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Region</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Reviewed Packages</th>
          </>
        );
        break;
      case 'vendors':
        specificHeaders = (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
          </>
        );
        break;
      default:
        specificHeaders = null;
    }

    return (
      <>
        {baseHeaders}
        {specificHeaders}
        <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
      </>
    );
  };

  const renderUserSpecificColumns = (user: User) => {
    switch (selectedFilter) {
      case 'guides':
        if (user.type === 'Travel Guide') {
          return (
            <>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-gray-600" />
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    {user.documents}
                  </a>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  {getCertificationIcon(user.certification!)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificationColor(user.certification!)}`}>
                    {user.certification}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-900">{user.experience}</span>
              </td>
            </>
          );
        }
        return <td colSpan={3} className="py-4 px-4 text-center text-gray-500">-</td>;

      case 'travellers':
        if (user.type === 'Traveller') {
          return (
            <td className="py-4 px-4">
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-gray-900">{user.downloadedPackages?.length || 0}</span>
              </div>
            </td>
          );
        }
        return <td className="py-4 px-4 text-center text-gray-500">-</td>;

      case 'moderators':
        if (user.type === 'Moderator') {
          return (
            <>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{user.region}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">{user.reviewedPackages?.length || 0}</span>
                </div>
              </td>
            </>
          );
        }
        return <td colSpan={2} className="py-4 px-4 text-center text-gray-500">-</td>;

      case 'vendors':
        if (user.type === 'Vendor') {
          return (
            <td className="py-4 px-4">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{user.location}</span>
              </div>
            </td>
          );
        }
        return <td className="py-4 px-4 text-center text-gray-500">-</td>;

      default:
        return null;
    }
  };

  const renderActionButtons = (user: User) => {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleViewUser(user)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="View Profile"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() => handleEditUser(user)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Edit User"
        >
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() => handleDeleteUser(user)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Delete User"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedFilter(type.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${selectedFilter === type.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type.label} ({getFilterCount(type.id)})
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Filter Options"
              >
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={activeFilters.active}
                          onChange={() => handleFilterChange('active')}
                        />
                        <span className="text-sm">Active Users</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={activeFilters.inactive}
                          onChange={() => handleFilterChange('inactive')}
                        />
                        <span className="text-sm">Inactive Users</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={activeFilters.certified}
                          onChange={() => handleFilterChange('certified')}
                        />
                        <span className="text-sm">Certified Guides</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {renderTableHeaders()}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(user.type)}`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{user.contact?.phone}</span>
                      </div>
                    </div>
                  </td>
                  {renderUserSpecificColumns(user)}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {renderActionButtons(user)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{filteredUsers.length}</span> results
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

      {/* User Profile Modal */}
      {showGuideProfile && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
              <button
                onClick={() => setShowGuideProfile(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* User Details Section */}
              <div className="space-y-6 mb-8">
                {/* User Info */}
                <div className="flex items-start space-x-6">
                  <img
                    src={selectedGuide.avatar}
                    alt={selectedGuide.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-6 mb-4">
                      {/* Name and Email stacked vertically */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{selectedGuide.name}</h3>
                        <p className="text-gray-600">{selectedGuide.email}</p>
                      </div>

                      {/* Certification and Status badges, aligned next to name/email */}
                      <div className="flex items-center space-x-4">
                        {selectedGuide.certification && (
                          <div className="flex items-center space-x-2">
                            {getCertificationIcon(selectedGuide.certification)}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getCertificationColor(
                                selectedGuide.certification
                              )}`}
                            >
                              {selectedGuide.certification}
                            </span>
                          </div>
                        )}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            selectedGuide.status
                          )}`}
                        >
                          {selectedGuide.status}
                        </span>
                      </div>
                    </div>



                    {/* Stats Cards for Travel Guides */}
                    {selectedGuide.type === 'Travel Guide' && (
                      <div className="grid grid-cols-2 gap-3 mb-4 max-w-xs">
                        <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 text-emerald-600" />
                            <div>
                              <p className="text-xs text-emerald-600 font-medium">Earnings</p>
                              <p className="text-sm font-bold text-emerald-700">{selectedGuide.totalEarnings}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                          <div className="flex items-center space-x-1">
                            <Package className="w-3 h-3 text-blue-600" />
                            <div>
                              <p className="text-xs text-blue-600 font-medium">Packages</p>
                              <p className="text-sm font-bold text-blue-700">{selectedGuide.tourPackages?.length || 0}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {selectedGuide.experience && (
                        <div>
                          <span className="text-gray-500">Experience:</span>
                          <span className="ml-2 font-medium">{selectedGuide.experience}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2 font-medium">{selectedGuide.contact?.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Joined:</span>
                        <span className="ml-2 font-medium">{new Date(selectedGuide.joinDate).toLocaleDateString()}</span>
                      </div>
                      {selectedGuide.type === 'Traveller' && (
                        <div>
                          <span className="text-gray-500">Downloaded:</span>
                          <span className="ml-2 font-medium">{selectedGuide.downloadedPackages?.length || 0} packages</span>
                        </div>
                      )}
                      {selectedGuide.type === 'Vendor' && (
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <span className="ml-2 font-medium">{selectedGuide.location}</span>
                        </div>
                      )}
                      {selectedGuide.type === 'Moderator' && (
                        <>
                          <div>
                            <span className="text-gray-500">Region:</span>
                            <span className="ml-2 font-medium">{selectedGuide.region}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Reviewed:</span>
                            <span className="ml-2 font-medium">{selectedGuide.reviewedPackages?.length || 0} packages</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documents for Travel Guides */}
                {selectedGuide.type === 'Travel Guide' && selectedGuide.documents && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Paperclip className="w-4 h-4" />
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        {selectedGuide.documents}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Content based on user type */}
              {selectedGuide.type === 'Travel Guide' && selectedGuide.tourPackages && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Tour Packages ({selectedGuide.tourPackages.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedGuide.tourPackages.map((tour) => (
                      <div key={tour.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(tour.status)}`}>
                              {tour.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-gray-900 text-sm">{tour.title}</h5>
                            <span className="text-lg font-bold text-teal-600">${tour.price}</span>
                          </div>

                          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                            <MapPin className="w-3 h-3" />
                            <span>{tour.location}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span>{tour.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Download className="w-3 h-3 text-gray-400" />
                                <span>{tour.downloads}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span>{tour.duration}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex space-x-2">
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="View">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleDeletePackage(tour.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Traveller Downloaded Packages */}
              {selectedGuide.type === 'Traveller' && selectedGuide.downloadedPackages && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Downloaded Tour Packages ({selectedGuide.downloadedPackages.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGuide.downloadedPackages.map((tour) => (
                      <div key={tour.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="w-full h-32 object-cover"
                          />
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-gray-900 text-sm">{tour.title}</h5>
                            <span className="text-lg font-bold text-teal-600">${tour.price}</span>
                          </div>

                          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                            <MapPin className="w-3 h-3" />
                            <span>{tour.location}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span>{tour.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span>{tour.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vendor Sponsored Places */}
              {selectedGuide.type === 'Vendor' && selectedGuide.sponsoredPlaces && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Sponsored Places ({selectedGuide.sponsoredPlaces.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGuide.sponsoredPlaces.map((place) => (
                      <div key={place.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img
                            src={place.image}
                            alt={place.name}
                            className="w-full h-32 object-cover"
                          />
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-gray-900 text-sm">{place.name}</h5>
                            <span className="text-sm font-bold text-teal-600">${place.monthlyFee}/mo</span>
                          </div>

                          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                            <Building className="w-3 h-3" />
                            <span>{place.type}</span>
                          </div>

                          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                            <MapPin className="w-3 h-3" />
                            <span>{place.location}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>{place.rating}</span>
                            </div>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              {place.sponsorshipType}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Moderator Reviewed Packages */}
              {selectedGuide.type === 'Moderator' && selectedGuide.reviewedPackages && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Reviewed Packages ({selectedGuide.reviewedPackages.length})</h4>
                  <div className="space-y-4">
                    {selectedGuide.reviewedPackages.map((review) => (
                      <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-semibold text-gray-900">{review.title}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${review.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {review.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Guide:</span> {review.guide}
                          </div>
                          <div>
                            <span className="font-medium">Review Date:</span> {new Date(review.reviewDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">Rating:</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span>{review.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal - Enhanced UI */}
      {showEditGuide && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Edit User</h2>
                  <p className="text-teal-100">Update user information and settings</p>
                </div>
                <button
                  onClick={() => setShowEditGuide(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={selectedGuide.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={selectedGuide.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue={selectedGuide.contact?.phone}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  {selectedGuide.type === 'Travel Guide' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                      <input
                        type="text"
                        defaultValue={selectedGuide.experience}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Certification Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Settings</h3>
                <div className="grid grid-cols-2 gap-6">
                  {selectedGuide.type === 'Travel Guide' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Certification Status</label>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer">
                          <input
                            type="radio"
                            name="certification"
                            value="Certified"
                            defaultChecked={selectedGuide.certification === 'Certified'}
                            className="mr-3 text-teal-600 focus:ring-teal-500"
                          />
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium">Certified</span>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer">
                          <input
                            type="radio"
                            name="certification"
                            value="Pending"
                            defaultChecked={selectedGuide.certification === 'Pending'}
                            className="mr-3 text-teal-600 focus:ring-teal-500"
                          />
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium">Pending Review</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Account Status</label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="Active"
                          defaultChecked={selectedGuide.status === 'Active'}
                          className="mr-3 text-teal-600 focus:ring-teal-500"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm font-medium">Active</span>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="Inactive"
                          defaultChecked={selectedGuide.status === 'Inactive'}
                          className="mr-3 text-teal-600 focus:ring-teal-500"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-sm font-medium">Inactive</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section for Travel Guides */}
              {selectedGuide.type === 'Travel Guide' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                        <input type="file" className="hidden" multiple accept=".pdf,.doc,.docx" />
                        <button type="button" className="mt-3 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors">
                          Choose Files
                        </button>
                      </div>
                    </div>

                    {/* Current Documents */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Documents</label>
                      <div className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg">
                        <Paperclip className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-900">{selectedGuide.documents}</span>
                        <button type="button" className="ml-auto text-xs text-red-600 hover:text-red-800">Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditGuide(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all font-medium shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{selectedGuide.name}</strong>?
                This will permanently remove their profile and all associated data.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;