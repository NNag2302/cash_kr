import api from './api';

export const userService = {
  getMe: () => api.get('/users/me'),
  getReferrals: () => api.get('/users/referrals'),
  
  // Address operations
  addAddress: (addressData) => api.post('/users/me/addresses', addressData),
  deleteAddress: (addressId) => api.delete(`/users/me/addresses/${addressId}`),
  
  // Payment operations
  addPaymentMethod: (paymentData) => api.post('/users/me/payments', paymentData),
  deletePaymentMethod: (paymentId) => api.delete(`/users/me/payments/${paymentId}`),
};
