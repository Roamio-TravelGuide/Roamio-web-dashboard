import apiClient from '../apiClient';


export const paymentApi = {
  createPaymentIntent: (data) => {
    return apiClient.post('/payment/create-payment-intent', data);
  },

  getPaymentHistory: (userId) => {
    return apiClient.get(`/payment/history/${userId}`);
  },
  createStripPayment: (paymentIntent) => {
    return apiClient.post('/payment/create-strip-payment', paymentIntent);
  },

};
