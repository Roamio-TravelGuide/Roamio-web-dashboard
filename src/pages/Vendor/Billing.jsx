import React, { useState, useEffect } from 'react';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { paymentApi } from '../../api/payment/paymentapi';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Checkout Form Component
const CheckoutForm = ({ amount, planName, onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    // Check if all card fields are complete
    if (!cardComplete.cardNumber || !cardComplete.cardExpiry || !cardComplete.cardCvc) {
      setError('Please complete all card details');
      setProcessing(false);
      return;
    }

    try {
      // Create payment intent on server
      const { data } = await paymentApi.createPaymentIntent({
        amount,
        currency: 'usd',
        metadata: {
          planName: planName
        }
      });

      const { clientSecret } = data;

      // Get the card element
      const cardNumberElement = elements.getElement(CardNumberElement);

      // Confirm the payment on the client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            // You can add billing details here if needed
          },
        }
      });

      if (result.error) {
        setError(result.error.message);
        onError && onError(result.error);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          onSuccess && onSuccess(result.paymentIntent);
        }
      }
    } catch (err) {
      console.error('Error processing payment', err);
      setError('An unexpected error occurred.');
      onError && onError(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleChange = (event, field) => {
    setError(null);
    if (event.complete) {
      setCardComplete(prev => ({ ...prev, [field]: true }));
    } else {
      setCardComplete(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Complete Your Payment</h3>
      <p className="text-gray-600 mb-6">You are subscribing to the <span className="font-semibold">{planName}</span> plan for ${amount}/month</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="border p-3 rounded-md">
            <CardNumberElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    iconColor: '#666EE8',
                  },
                },
              }}
              onChange={(e) => handleChange(e, 'cardNumber')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date
            </label>
            <div className="border p-3 rounded-md">
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
                onChange={(e) => handleChange(e, 'cardExpiry')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <div className="border p-3 rounded-md">
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
                onChange={(e) => handleChange(e, 'cardCvc')}
              />
            </div>
          </div>
        </div>
        
        {error && <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">{error}</div>}
        
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={!stripe || processing}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {processing ? 'Processing...' : `Pay $${amount}`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Stripe Payment Wrapper
const StripePaymentModal = ({ amount, planName, onSuccess, onError, onCancel, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            amount={amount} 
            planName={planName}
            onSuccess={onSuccess} 
            onError={onError}
            onCancel={onCancel}
          />
        </Elements>
      </div>
    </div>
  );
};

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
    { name: "Basic", price: "$9.99/month", recommended: false, actualPrice: 9.99 },
    { name: "Professional", price: "$29.99/month", recommended: true, actualPrice: 29.99 },
    { name: "Enterprise", price: "$99.99/month", recommended: false, actualPrice: 99.99 }
  ];

  // State for payment processing
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    // Fetch payment history
    const fetchPaymentHistory = async () => {
      try {
        // You'll need to get the current user's ID from your auth context
        const userId = 'current-user-id'; // Replace with actual user ID
        const { data } = await paymentApi.getPaymentHistory(userId);
        setPaymentHistory(data);
      } catch (error) {
        console.error('Error fetching payment history', error);
      }
    };

    fetchPaymentHistory();
  }, []);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment succeeded:', paymentIntent);
    setShowPaymentModal(false);
    setSelectedPlan(null);
    // You might want to refresh the payment history here
    alert('Payment successful! Your subscription has been updated.');
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  };

  const handleUpgradeClick = (plan) => {
    if (currentPlan.name === plan.name) {
      alert('You are already on this plan.');
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

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
                    : currentPlan.name === plan.name
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleUpgradeClick(plan)}
                disabled={currentPlan.name === plan.name}
              >
                {currentPlan.name === plan.name ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <StripePaymentModal
        amount={selectedPlan?.actualPrice}
        planName={selectedPlan?.name}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onCancel={handleCancelPayment}
        isOpen={showPaymentModal}
      />
    </section>
  );
};

export default VendorBilling;