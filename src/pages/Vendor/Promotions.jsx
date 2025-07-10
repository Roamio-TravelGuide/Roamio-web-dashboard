import React, { useState } from 'react';
import { 
  FiPlus, 
  FiTrendingUp, 
  FiDollarSign, 
  FiUsers,
  FiClock,
  FiTrash2,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

const VendorPromotions = () => {
  const [activeTab, setActiveTab] = useState('promotions');
  const [showForm, setShowForm] = useState(false);
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: "Summer Special",
      description: "15% off all drinks in August",
      discount: 15,
      type: "percentage",
      startDate: "2023-08-01",
      endDate: "2023-08-31",
      status: "active",
      views: 124,
      conversions: 32
    },
    {
      id: 2,
      title: "Weekend Brunch",
      description: "Free pastry with any coffee order on weekends",
      discount: "free",
      type: "item",
      startDate: "2023-07-15",
      endDate: "2023-09-30",
      status: "active",
      views: 89,
      conversions: 21
    }
  ]);

  const [newPromotion, setNewPromotion] = useState({
    title: "",
    description: "",
    discount: "",
    type: "percentage",
    startDate: "",
    endDate: ""
  });

  const recommendationStats = {
    totalRecommendations: 156,
    monthlyTrend: "+18%",
    topTours: ["City Highlights", "Food Lovers Tour"],
    conversionRate: "12%"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const promotion = {
      ...newPromotion,
      id: promotions.length + 1,
      status: "active",
      views: 0,
      conversions: 0
    };
    setPromotions([...promotions, promotion]);
    setNewPromotion({
      title: "",
      description: "",
      discount: "",
      type: "percentage",
      startDate: "",
      endDate: ""
    });
    setShowForm(false);
  };

  const togglePromotionStatus = (id) => {
    setPromotions(promotions.map(promo => 
      promo.id === id 
        ? { ...promo, status: promo.status === "active" ? "paused" : "active" } 
        : promo
    ));
  };

  const deletePromotion = (id) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
  };

  return (
    <section className="p-6 bg-white shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Promotions & Recommendations</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'promotions' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            My Promotions
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'recommendations' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            Recommendations
          </button>
        </div>
      </div>

      {activeTab === 'promotions' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Active Promotions</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <FiPlus /> {showForm ? 'Cancel' : 'New Promotion'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-blue-50 rounded-xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Promotion Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={newPromotion.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., Summer Special"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Discount Type*</label>
                  <select
                    name="type"
                    value={newPromotion.type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="percentage">Percentage Off</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="item">Free Item</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    {newPromotion.type === 'percentage' ? 'Discount Percentage*' : 
                     newPromotion.type === 'fixed' ? 'Discount Amount*' : 'Free Item*'}
                  </label>
                  <input
                    type={newPromotion.type === 'percentage' || newPromotion.type === 'fixed' ? 'number' : 'text'}
                    name="discount"
                    value={newPromotion.discount}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder={newPromotion.type === 'percentage' ? 'e.g., 15' : 
                                 newPromotion.type === 'fixed' ? 'e.g., 5' : 'e.g., Free dessert'}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Description*</label>
                  <input
                    type="text"
                    name="description"
                    value={newPromotion.description}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Short description for travelers"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Start Date*</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newPromotion.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">End Date*</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newPromotion.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-800 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Create Promotion
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {promotions.length > 0 ? (
              promotions.map(promo => (
                <div key={promo.id} className="overflow-hidden border rounded-xl">
                  <div className={`p-4 ${promo.status === 'active' ? 'bg-green-50' : 'bg-amber-50'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{promo.title}</h4>
                        <p className="text-gray-600">{promo.description}</p>
                        <div className="flex gap-4 mt-2">
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <FiClock /> {promo.startDate} to {promo.endDate}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <FiUsers /> {promo.conversions} redemptions
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {promo.status === 'active' ? 'Active' : 'Paused'}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => togglePromotionStatus(promo.id)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                          >
                            {promo.status === 'active' ? <FiEyeOff /> : <FiEye />}
                          </button>
                          <button
                            onClick={() => deletePromotion(promo.id)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-white md:grid-cols-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Views</p>
                      <p className="font-bold text-gray-800">{promo.views}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Conversions</p>
                      <p className="font-bold text-gray-800">{promo.conversions}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Conversion Rate</p>
                      <p className="font-bold text-gray-800">
                        {promo.views > 0 ? Math.round((promo.conversions / promo.views) * 100) : 0}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Discount</p>
                      <p className="font-bold text-gray-800">
                        {promo.type === 'percentage' ? `${promo.discount}% Off` : 
                         promo.type === 'fixed' ? `$${promo.discount} Off` : promo.discount}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center bg-gray-50 rounded-xl">
                <p className="text-gray-500">You haven't created any promotions yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 mt-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Create Your First Promotion
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Recommendation Analytics</h3>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 text-green-600 bg-green-100 rounded-full">
                  <FiTrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Recommendations</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {recommendationStats.totalRecommendations}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 text-blue-600 bg-blue-100 rounded-full">
                  <FiUsers size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {recommendationStats.conversionRate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white border rounded-xl">
            <div className="p-4 border-b">
              <h4 className="font-semibold text-gray-800">Top Tour Packages That Recommend You</h4>
            </div>
            <div className="divide-y">
              {recommendationStats.topTours.map((tour, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <span className="text-gray-800">{tour}</span>
                  <button className="text-sm text-indigo-600 hover:underline">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="mb-2 font-semibold text-gray-800">How Recommendations Work</h4>
            <p className="text-sm text-gray-600">
              Your business is automatically recommended to travelers when their tour route passes near your location. 
              Keep your profile updated and create promotions to increase visibility.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default VendorPromotions;