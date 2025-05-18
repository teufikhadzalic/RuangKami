import api from './api';

const assignmentService = {
  getStudentAssignments: async (studentId) => {
    try {
      const response = await api.get(`/assignment/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAssignmentById: async (id) => {
    try {
      const response = await api.get(`/assignment/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  submitAssignment: async (id, data) => {
    try {
      const response = await api.post(`/assignment/${id}/submit`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAssignment: async (data) => {
    try {
      const response = await api.post('/assignment/create', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAssignment: async (id, data) => {
    try {
      const response = await api.put(`/assignment/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAssignment: async (id) => {
    try {
      const response = await api.delete(`/assignment/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default assignmentService;