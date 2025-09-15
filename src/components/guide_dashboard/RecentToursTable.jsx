import { FiEye, FiEdit, FiClock, FiMoreHorizontal } from 'react-icons/fi';

const RecentToursTable = ({ tours = [] }) => {
  // Filter and sort pending tours by creation date (newest first)
  const pendingTours = tours
    .filter(tour => tour.status === 'pending_approval')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysWaiting = (createdAt) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-800">Pending Approval</h3>
          {pendingTours.length > 0 && (
            <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
              {pendingTours.length} waiting
            </span>
          )}
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">
          View All Pending
        </button>
      </div>

      {pendingTours.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm font-medium text-left text-gray-600 border-b">
                <th className="pb-3">Tour</th>
                <th className="pb-3">Guide</th>
                <th className="pb-3">Submitted</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {pendingTours.slice(0, 3).map((tour) => {
                const daysWaiting = getDaysWaiting(tour.created_at);
                return (
                  <tr key={tour.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-gray-100 rounded-md">
                          {tour.cover_image ? (
                            <img 
                              src={tour.cover_image.url} 
                              alt={tour.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-200">
                              <FiClock className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{tour.title}</div>
                          <div className="text-xs text-gray-500">
                            {tour.tour_stops?.length || 0} stops
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 overflow-hidden bg-gray-100 rounded-full">
                          {tour.guide.user.profile_picture_url ? (
                            <img 
                              src={tour.guide.user.profile_picture_url} 
                              alt={tour.guide.user.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-blue-600 bg-blue-100">
                              <span className="text-xs font-medium">
                                {tour.guide.user.name?.charAt(0) || 'G'}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                          {tour.guide.user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-gray-800">{formatDate(tour.created_at)}</div>
                      <div className="text-xs text-gray-500">
                        {daysWaiting} {daysWaiting === 1 ? 'day' : 'days'} waiting
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-gray-800">
                        {Math.floor(tour.duration_minutes / 60)}h {tour.duration_minutes % 60}m
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="font-semibold text-gray-800">
                        LKR {tour.price?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 text-gray-500 rounded-md hover:bg-gray-100"
                          title="Preview"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-500 rounded-md hover:bg-gray-100"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-500 rounded-md hover:bg-gray-100"
                          title="More options"
                        >
                          <FiMoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-3 mb-3 bg-gray-100 rounded-full">
            <FiClock className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="mb-1 font-medium text-gray-700">No pending tours</h4>
          <p className="text-sm text-gray-500">All tours have been reviewed</p>
        </div>
      )}
    </div>
  );
};

export default RecentToursTable;