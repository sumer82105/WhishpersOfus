import axiosInstance from '../config/axios';
import { ApiResponse, Memory } from './api.types';

export const memoryService = {
  createMemory: async (data: {
    title: string;
    description?: string;
    memoryDate: string;
    photoUrl?: string;
    location?: string;
    type: 'FIRST_DATE' | 'ANNIVERSARY' | 'TRIP' | 'SPECIAL_MOMENT' | 'ACHIEVEMENT' | 'CELEBRATION' | 'OTHER';
    isMilestone?: boolean;
  }): Promise<Memory> => {
    const response = await axiosInstance.post('/memories', data);
    return response as unknown as Memory;
  },

  getAllMemories: async (order: 'asc' | 'desc' = 'asc'): Promise<Memory[]> => {
    const response = await axiosInstance.get('/memories', {
      params: { order }
    });
    console.log(response);
    return response as unknown as Memory[];
  },

  getMilestones: async (): Promise<Memory[]> => {
    const response = await axiosInstance.get('/memories/milestones');
    return response as unknown as Memory[];
  },

  getMemoriesByType: async (type: 'FIRST_DATE' | 'ANNIVERSARY' | 'TRIP' | 'SPECIAL_MOMENT' | 'ACHIEVEMENT' | 'CELEBRATION' | 'OTHER'): Promise<Memory[]> => {
    const response = await axiosInstance.get(`/memories/type/${type}`);
    return response as unknown as Memory[];
  },

  getMemoriesInDateRange: async (startDate: string, endDate: string): Promise<Memory[]> => {
    const response = await axiosInstance.get('/memories/date-range', {
      params: { startDate, endDate }
    });
    return response as unknown as Memory[];
  },

  getMemoriesFromDate: async (startDate: string): Promise<Memory[]> => {
    const response = await axiosInstance.get('/memories/from-date', {
      params: { startDate }
    });
    return response as unknown as Memory[];
  },

  getMemory: async (id: string): Promise<Memory> => {
    const response = await axiosInstance.get(`/memories/${id}`);
    return response as unknown as Memory;
  },

  updateMemory: async (
    id: string,
    data: {
      title: string;
      description?: string;
      memoryDate: string;
      photoUrl?: string;
      location?: string;
      type: 'FIRST_DATE' | 'ANNIVERSARY' | 'TRIP' | 'SPECIAL_MOMENT' | 'ACHIEVEMENT' | 'CELEBRATION' | 'OTHER';
      isMilestone?: boolean;
    }
  ): Promise<Memory> => {
    const response = await axiosInstance.put(`/memories/${id}`, data);
    return response as unknown as Memory;
  },

  deleteMemory: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/memories/${id}`);
  }
}; 