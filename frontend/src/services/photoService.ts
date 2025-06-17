import axiosInstance from '../config/axios';
import { ApiResponse, PhotoMoment } from './api.types';

interface PhotoResponse {
  content: PhotoMoment[];
  totalPages: number;
  totalElements: number;
  hasMore: boolean;
}

export const photoService = {
  createPhotoMoment: async (data: {
    photoUrl: string;
    caption?: string;
    location?: string;
    takenAt?: string;
  }): Promise<PhotoMoment> => {
    const response = await axiosInstance.post('/photo-moments', data);
    return response as unknown as PhotoMoment;
  },

  getPhotoMoments: async (page: number = 0, size: number = 20): Promise<PhotoResponse> => {
    const response = await axiosInstance.get('/photo-moments', {
      params: { page, size }
    });
    return response as unknown as PhotoResponse;
  },

  getFavoritePhotos: async (): Promise<PhotoMoment[]> => {
    const response = await axiosInstance.get('/photo-moments/favorites');
    return response as unknown as PhotoMoment[];
  },

  toggleFavorite: async (photoId: string): Promise<PhotoMoment> => {
    const response = await axiosInstance.put(`/photo-moments/${photoId}/favorite`);
    return response as unknown as PhotoMoment;
  },

  deletePhotoMoment: async (photoId: string): Promise<void> => {
    await axiosInstance.delete(`/photo-moments/${photoId}`);
  }
}; 