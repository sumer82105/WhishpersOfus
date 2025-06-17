import axiosInstance from '../config/axios';
import { ApiResponse, User } from './api.types';

export const userService = {
  register: async (email: string, name: string): Promise<User> => {
    const response = await axiosInstance.post<ApiResponse<User>>('/users/register', null, {
      params: { email, name }
    });
    return response.data.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User>>('/users/me');
    console.log(response.data);
    return response.data;
  },

  updateProfile: async (name?: string, profileImageUrl?: string): Promise<User> => {
    const response = await axiosInstance.put<ApiResponse<User>>('/users/me', null, {
      params: { name, profileImageUrl }
    });
    return response.data.data;
  },

  checkUserExists: async (email: string): Promise<boolean> => {
    const response = await axiosInstance.get<ApiResponse<boolean>>('/users/exists', {
      params: { email }
    });
    return response.data.data;
  }
}; 