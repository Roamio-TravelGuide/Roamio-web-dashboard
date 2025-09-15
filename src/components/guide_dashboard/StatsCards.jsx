import { FiDollarSign, FiStar, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import RatingStars from './RatingStars';

const StatsCards = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        icon={<FiDollarSign className="w-6 h-6" />}
        iconColor="text-amber-600"
        iconBg="bg-amber-100"
        title="Total Earnings"
        value={formatCurrency(stats.totalEarnings)}
        trend="+12% from last month"
        trendColor="text-green-600"
      />
      
      <StatCard 
        icon={<FiStar className="w-6 h-6" />}
        iconColor="text-purple-600"
        iconBg="bg-purple-100"
        title="Average Rating"
        value={<RatingStars rating={stats.averageRating} />}
      />
      
      <StatCard 
        icon={<FiMapPin className="w-6 h-6" />}
        iconColor="text-blue-600"
        iconBg="bg-blue-100"
        title="Hidden Places"
        value={stats.hiddenPlaces}
      />
      
      <StatCard 
        icon={<FiCheckCircle className="w-6 h-6" />}
        iconColor="text-green-600"
        iconBg="bg-green-100"
        title="Published Tours"
        value={stats.publishedTours}
        trend={`${stats.totalTours} total`}
        trendColor="text-gray-600"
      />
    </div>
  );
};

const StatCard = ({ icon, iconColor, iconBg, title, value, trend, trendColor, additionalText }) => (
  <div className="p-6 bg-white rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="mt-1 text-2xl font-semibold text-gray-800">{value}</div>
        <p className={`text-sm ${trendColor}`}>{trend}</p>
        {additionalText && <p className="text-sm text-gray-500">{additionalText}</p>}
      </div>
      <div className={`p-3 rounded-lg ${iconBg} ${iconColor}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default StatsCards;