import axiosInstance from '../config/axios';
import { Surprise } from './api.types';

export const surpriseService = {
  createSurprise: async (data: {
    title: string;
    description?: string;
    unlockCondition: string;
    contentUrl?: string;
    contentType: 'MESSAGE' | 'PHOTO' | 'VIDEO' | 'VOICE_NOTE' | 'GIFT_IDEA';
  }): Promise<Surprise> => {
    const response = await axiosInstance.post('/surprises', data);
    return response as unknown as Surprise;
  },

  getAllSurprises: async (): Promise<Surprise[]> => {
    const response = await axiosInstance.get('/surprises');
    return response as unknown as Surprise[];
  },

  getUnlockedSurprises: async (): Promise<Surprise[]> => {
    const response = await axiosInstance.get('/surprises/unlocked');
    return response as unknown as Surprise[];
  },

  getLockedSurprises: async (): Promise<Surprise[]> => {
    const response = await axiosInstance.get('/surprises/locked');
    return response as unknown as Surprise[];
  },

  getMySurprises: async (): Promise<Surprise[]> => {
    const response = await axiosInstance.get('/surprises/my-surprises');
    return response as unknown as Surprise[];
  },

  getSurprisesByContentType: async (contentType: 'MESSAGE' | 'PHOTO' | 'VIDEO' | 'VOICE_NOTE' | 'GIFT_IDEA'): Promise<Surprise[]> => {
    const response = await axiosInstance.get(`/surprises/content-type/${contentType}`);
    return response as unknown as Surprise[];
  },

  getUnlockedCount: async (): Promise<number> => {
    const response = await axiosInstance.get('/surprises/unlocked/count');
    return response as unknown as number;
  },

  getMyCount: async (): Promise<number> => {
    const response = await axiosInstance.get('/surprises/my-count');
    return response as unknown as number;
  },

  getSurprise: async (id: string): Promise<Surprise> => {
    const response = await axiosInstance.get(`/surprises/${id}`);
    return response as unknown as Surprise;
  },

  unlockSurprise: async (id: string): Promise<Surprise> => {
    const response = await axiosInstance.put(`/surprises/${id}/unlock`);
    return response as unknown as Surprise;
  },

  updateSurprise: async (
    id: string,
    data: {
      title: string;
      description?: string;
      unlockCondition: string;
      contentUrl?: string;
      contentType: 'MESSAGE' | 'PHOTO' | 'VIDEO' | 'VOICE_NOTE' | 'GIFT_IDEA';
    }
  ): Promise<Surprise> => {
    const response = await axiosInstance.put(`/surprises/${id}`, data);
    return response as unknown as Surprise;
  },

  deleteSurprise: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/surprises/${id}`);
  }
}; 