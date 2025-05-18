import api from './api';

const roomService = {
  listRooms: async (filters) => {
    try {
      const response = await api.get('/room/list', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAvailableRooms: async (date, startTime, endTime, capacity, type) => {
    try {
      const params = { date, startTime, endTime };
      if (capacity) params.capacity = capacity;
      if (type) params.type = type;
      
      const response = await api.get('/room/available', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRoomById: async (id) => {
    try {
      const response = await api.get(`/room/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRoomBookings: async (roomId, date, status) => {
    try {
      const params = {};
      if (date) params.date = date;
      if (status) params.status = status;
      
      const response = await api.get(`/room/${roomId}/bookings`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default roomService;