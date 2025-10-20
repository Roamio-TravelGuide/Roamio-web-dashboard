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
      console.log('Creating payment intent for amount:', amount, 'plan:', planName);
      const { data } = await paymentApi.createPaymentIntent({
        amount,
        currency: 'inr', // Changed to Indian Rupees
        metadata: {
          planName: planName
        }
      });

      console.log('Payment intent created:', data);
      const { clientSecret } = data;

      // Get the card element
      const cardNumberElement = elements.getElement(CardNumberElement);

      // Confirm the payment on the client
      console.log('Confirming payment with client secret...');
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            // You can add billing details here if needed
          },
        },
        return_url: window.location.href, // Add return URL for web
      });

      console.log('Payment confirmation result:', result);

      if (result.error) {
        console.error('Payment error:', result.error);
        setError(result.error.message);
        onError && onError(result.error);
      } else {
        // The payment has been processed!
        console.log('Payment intent status:', result.paymentIntent.status);
        if (result.paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded, calling onSuccess...');
          onSuccess && onSuccess(result.paymentIntent);
        } else {
          console.log('Payment not succeeded, status:', result.paymentIntent.status);
          setError('Payment was not completed successfully');
          onError && onError(new Error('Payment not completed'));
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
      <h3 className="mb-4 text-xl font-semibold">Complete Your Payment</h3>
      <p className="mb-6 text-gray-600">You are subscribing to the <span className="font-semibold">{planName}</span> plan for Rs {amount}/month</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Card Number
          </label>
          <div className="p-3 border rounded-md">
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
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Expiration Date
            </label>
            <div className="p-3 border rounded-md">
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
            <label className="block mb-2 text-sm font-medium text-gray-700">
              CVC
            </label>
            <div className="p-3 border rounded-md">
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

        {error && <div className="p-3 text-sm text-red-500 rounded-md bg-red-50">{error}</div>}

        <div className="flex pt-4 space-x-3">
          <button
            type="submit"
            disabled={!stripe || processing}
            className="flex-1 px-4 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Pay Rs ${amount}`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 font-medium text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
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
  // State for current plan - in a real app, this would come from an API
  const [currentPlan, setCurrentPlan] = useState({
    name: "Professional",
    price: "Rs 2,999/month",
    features: [
      "Up to 50 products",
      "Advanced analytics",
      "Priority support",
      "Custom branding"
    ],
    renewalDate: "2023-12-15"
  });

  const availablePlans = [
    { name: "Basic", price: "Rs 999/month", recommended: false, actualPrice: 999 },
    { name: "Professional", price: "Rs 2,999/month", recommended: false, actualPrice: 2999 },
    { name: "Enterprise", price: "Rs 9,999/month", recommended: false, actualPrice: 9999 }
  ];

  // State for transactions
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2023-11-15", amount: "Rs 2,999", status: "Completed", description: "Professional Plan Subscription" },
    { id: 2, date: "2023-10-15", amount: "Rs 2,999", status: "Completed", description: "Professional Plan Subscription" },
    { id: 3, date: "2023-09-15", amount: "Rs 2,999", status: "Completed", description: "Professional Plan Subscription" }
  ]);

  // Helper function to get plan features
  const getPlanFeatures = (planName) => {
    const features = {
      "Basic": [
        "Up to 10 maximum tours",
        "Will be shown if the tourist is with 5km radius",
        "Email support"
      ],
      "Professional": [
        "Up to 50 maximum tours",
        "Will be shown if the tourist is with 10km radius",
        "Priority support",
        "Custom branding"
      ],
      "Enterprise": [
        "Will be shown at the top",
        "Roamio will give 10% discount to the users",
        "24/7 phone support",
        "Custom branding",
        
      ]
    };
    return features[planName] || [];
  };

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

  const handlePaymentSuccess = async (paymentIntent) => {
    console.log('Payment succeeded:', paymentIntent);
    setShowPaymentModal(false);

    try {
      // Include user ID in the payment data for proper recording
      const paymentData = {
        ...paymentIntent,
        metadata: {
          ...paymentIntent.metadata,
          userId: 'current-user-id', // Replace with actual user ID from auth context
          planName: selectedPlan?.name
        }
      };

      const response = await paymentApi.createStripPayment(paymentData);
      console.log('Payment recorded successfully:', response.data);

      // Update current plan to the selected plan
      setCurrentPlan({
        name: selectedPlan.name,
        price: selectedPlan.price,
        features: getPlanFeatures(selectedPlan.name),
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
      });

      // Add the new transaction to history
      const newTransaction = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        amount: `Rs ${selectedPlan.actualPrice.toLocaleString()}`,
        status: "Completed",
        description: `${selectedPlan.name} Plan Subscription`
      };
      
      setTransactions(prev => [newTransaction, ...prev]);

      setSelectedPlan(null);
      // You might want to refresh the payment history here
      alert('Payment successful! Your subscription has been updated.');
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Payment was processed but failed to record. Please contact support.');
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error.message || 'Please try again.'}`);
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
                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{transaction.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{transaction.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{transaction.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${transaction.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {transaction.status}
                    </span>
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
              className={`border rounded-lg p-4 ${currentPlan.name === plan.name ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-200'}`}
            >
              {currentPlan.name === plan.name && (
                <span className="inline-block px-2 py-1 mb-2 text-xs text-white bg-blue-500 rounded-full">
                  Current Plan
                </span>
              )}
              <h4 className="mb-1 text-lg font-semibold">{plan.name}</h4>
              <p className="mb-3 text-gray-600">{plan.price}</p>
              <button
                className={`w-full py-2 px-4 rounded-md ${currentPlan.name === plan.name
                    ? 'bg-blue-600 text-white cursor-not-allowed'
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