import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, Filter, Search, Calendar } from 'lucide-react';

const Reviews: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const reviews = [
    {
      id: 1,
      customer: 'John Smith',
      avatar: 'JS',
      rating: 5,
      date: '2024-01-15',
      title: 'Exceptional experience!',
      content: 'The Royal Hotel exceeded all my expectations. The staff was incredibly friendly and professional, the room was spotless and beautifully decorated. The restaurant serves amazing food with great presentation.',
      helpful: 12,
      response: {
        date: '2024-01-16',
        content: 'Thank you so much for your wonderful review, John! We\'re thrilled to hear that you had an exceptional experience with us.'
      }
    },
    {
      id: 2,
      customer: 'Sarah Johnson',
      avatar: 'SJ',
      rating: 4,
      date: '2024-01-12',
      title: 'Great location and service',
      content: 'Perfect location in the city center. Easy access to all major attractions. The spa services were relaxing and the pool area was clean and well-maintained. Only minor issue was the WiFi speed.',
      helpful: 8,
      response: null
    },
    {
      id: 3,
      customer: 'Mike Wilson',
      avatar: 'MW',
      rating: 5,
      date: '2024-01-10',
      title: 'Outstanding hospitality',
      content: 'From check-in to check-out, every interaction with the staff was pleasant. The concierge helped us plan our city tour and made excellent restaurant recommendations.',
      helpful: 15,
      response: {
        date: '2024-01-11',
        content: 'We\'re so glad our team could help make your stay memorable, Mike! Thank you for choosing Royal Hotel.'
      }
    },
    {
      id: 4,
      customer: 'Emma Davis',
      avatar: 'ED',
      rating: 3,
      date: '2024-01-08',
      title: 'Good but room for improvement',
      content: 'The hotel has a great ambiance and the food was delicious. However, the check-in process took longer than expected and the room service was slow.',
      helpful: 3,
      response: {
        date: '2024-01-09',
        content: 'Thank you for your feedback, Emma. We apologize for the delays and are working to improve our service efficiency.'
      }
    },
    {
      id: 5,
      customer: 'David Brown',
      avatar: 'DB',
      rating: 5,
      date: '2024-01-05',
      title: 'Perfect for business travelers',
      content: 'Stayed here for a business conference. The business center was well-equipped, rooms were quiet, and the breakfast buffet was excellent. Will definitely return.',
      helpful: 7,
      response: null
    }
  ];

  const ratingStats = {
    average: 4.4,
    total: reviews.length,
    distribution: {
      5: 3,
      4: 1,
      3: 1,
      2: 0,
      1: 0
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating;
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-gray-600">Monitor and respond to customer feedback</p>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{ratingStats.average}</div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(ratingStats.average))}
            </div>
            <p className="text-gray-600">{ratingStats.total} reviews</p>
          </div>
          
          {/* Rating Distribution */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-8">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(ratingStats.distribution[rating as keyof typeof ratingStats.distribution] / ratingStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {ratingStats.distribution[rating as keyof typeof ratingStats.distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map(review => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{review.avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{review.customer}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                      {review.rating}/5
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{review.date}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 leading-relaxed">{review.content}</p>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">Helpful ({review.helpful})</span>
              </button>
              {!review.response && (
                <button className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Reply</span>
                </button>
              )}
            </div>
            
            {review.response && (
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-600">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">RH</span>
                  </div>
                  <span className="font-medium text-gray-900">Royal Hotel</span>
                  <span className="text-sm text-gray-500">• {review.response.date}</span>
                </div>
                <p className="text-gray-700">{review.response.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;