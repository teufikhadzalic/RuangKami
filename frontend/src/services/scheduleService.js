import api from './api';

const scheduleService = {
  getStudentSchedule: async (studentId, semester, academicYear) => {
    try {
      const params = {};
      if (semester) params.semester = semester;
      if (academicYear) params.academicYear = academicYear;
      
      const response = await api.get(`/schedule/student/${studentId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getScheduleById: async (id) => {
    try {
      const response = await api.get(`/schedule/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createSchedule: async (data) => {
    try {
      const response = await api.post('/schedule/create', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSchedule: async (id, data) => {
    try {
      const response = await api.put(`/schedule/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteSchedule: async (id) => {
    try {
      const response = await api.delete(`/schedule/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default scheduleService;