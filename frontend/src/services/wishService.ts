import axiosInstance from '../config/axios';
import { ApiResponse, Wish } from './api.types';

export const wishService = {
  createWish: async (data: {
    title: string;
    description: string;
    photoUrl?: string;
    category: 'DATE' | 'GIFT' | 'ACTIVITY' | 'TRAVEL' | 'EXPERIENCE' | 'OTHER';
  }): Promise<Wish> => {
    const response = await axiosInstance.post('/wishes', data);
    console.log('createWish response:', response);
    return response as unknown as Wish;
  },

  getAllWishes: async (): Promise<Wish[]> => {
    const response = await axiosInstance.get('/wishes');
    console.log('getAllWishes response:', response);
    return response as unknown as Wish[];
  },

  getWishesByStatus: async (status: 'PENDING' | 'FULFILLED' | 'CANCELLED'): Promise<Wish[]> => {
    const response = await axiosInstance.get(`/wishes/status/${status}`);
    return response as unknown as Wish[];
  },

  updateWishStatus: async (
    wishId: string,
    status: 'FULFILLED' | 'CANCELLED',
    fulfillmentNote?: string
  ): Promise<Wish> => {
    const response = await axiosInstance.put(`/wishes/${wishId}/status`, {
      status,
      fulfillmentNote
    });
    return response as unknown as Wish;
  },

  deleteWish: async (wishId: string): Promise<void> => {
    await axiosInstance.delete(`/wishes/${wishId}`);
  }
}; 