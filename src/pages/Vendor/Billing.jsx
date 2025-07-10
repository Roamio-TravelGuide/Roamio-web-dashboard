import React from 'react';

const VendorBilling = () => {
  // Sample data - in a real app, this would come from an API or state management
  const currentPlan = {
    name: "Professional",
    price: "$29.99/month",
    features: [
      "Up to 50 products",
      "Advanced analytics",
      "Priority support",
      "Custom branding"
    ],
    renewalDate: "2023-12-15"
  };

  const transactions = [
    { id: 1, date: "2023-11-15", amount: "$29.99", status: "Completed" },
    { id: 2, date: "2023-10-15", amount: "$29.99", status: "Completed" },
    { id: 3, date: "2023-09-15", amount: "$29.99", status: "Completed" }
  ];

  const availablePlans = [
    { name: "Basic", price: "$9.99/month", recommended: false },
    { name: "Professional", price: "$29.99/month", recommended: true },
    { name: "Enterprise", price: "$99.99/month", recommended: false }
  ];

  return (
    <section className="p-6 bg-white rounded-lg shadow-sm vendor-section">
      <h2 className="mb-6 text-2xl font-semibold">Subscription & Billing</h2>
      
      {/* Current Plan Section */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium">Your Current Plan</h3>
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xl font-semibold">{currentPlan.name}</h4>
            <span className="text-lg">{currentPlan.price}</span>
          </div>
          <ul className="pl-5 mb-4 space-y-1 list-disc">
            {currentPlan.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-600">
            Next billing date: {currentPlan.renewalDate}
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">Invoice</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{transaction.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{transaction.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 whitespace-nowrap hover:text-blue-800">
                    <a href="#" className="hover:underline">Download</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Options */}
      <div>
        <h3 className="mb-4 text-lg font-medium">Available Plans</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {availablePlans.map((plan, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-4 ${plan.recommended ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
            >
              {plan.recommended && (
                <span className="inline-block px-2 py-1 mb-2 text-xs text-white bg-blue-500 rounded-full">
                  Recommended
                </span>
              )}
              <h4 className="mb-1 text-lg font-semibold">{plan.name}</h4>
              <p className="mb-3 text-gray-600">{plan.price}</p>
              <button
                className={`w-full py-2 px-4 rounded-md ${
                  plan.recommended
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {currentPlan.name === plan.name ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorBilling;