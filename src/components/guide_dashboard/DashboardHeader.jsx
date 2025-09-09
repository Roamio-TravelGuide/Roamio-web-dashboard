import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const DashboardHeader = ({ timeRange, setTimeRange }) => {
  return (
    <div className="flex flex-col justify-between pb-6 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Guide Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your performance overview.</p>
      </div>
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <div className="relative">
          <select 
            className="py-2 pl-3 pr-8 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
          </select>
        </div>
        <Link
          to="/guide/tourcreate"
          className="flex items-center px-5 py-2 text-sm text-white transition-all duration-300 bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" />
          New Tour
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;