import api from './api';

const bookingService = {
  calculateBookingCost: async (data) => {
    try {
      const response = await api.post('/booking/calculate', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createBooking: async (data) => {
    try {
      const response = await api.post('/booking/create', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentBookings: async (studentId, status) => {
    try {
      const params = {};
      if (status) params.status = status;
      
      const response = await api.get(`/booking/student/${studentId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBookingById: async (id) => {
    try {
      const response = await api.get(`/booking/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBookingStatus: async (id, status, cancellationReason) => {
    try {
      const response = await api.put(`/booking/${id}/status`, { 
        status, 
        cancellationReason 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePaymentStatus: async (id, paymentStatus, paymentMethod) => {
    try {
      const response = await api.put(`/booking/${id}/payment`, { 
        paymentStatus, 
        paymentMethod 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default bookingService;