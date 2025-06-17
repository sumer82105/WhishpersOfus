import axiosInstance from '../config/axios';
import { ApiResponse, LoveNote } from './api.types';

export const loveNoteService = {
  createLoveNote: async (content: string, emotionTag: string): Promise<LoveNote> => {
    const response = await axiosInstance.post<LoveNote>('/love-notes', {
      content,
      emotionTag
    });
    return response;
  },

  getAllLoveNotes: async (page: number = 0, size: number = 10): Promise<{
    content: LoveNote[];
    totalElements: number;
    totalPages: number;
  }> => {
    const response = await axiosInstance.get('/love-notes', {
      params: { page, size }
    });
    console.log('Love Notes Response:', response);
    // Backend returns Page<LoveNote> directly, axios interceptor extracts .data
    return response;
  },

  getUnreadNotes: async (): Promise<LoveNote[]> => {
    const response = await axiosInstance.get<LoveNote[]>('/love-notes/unread');
    console.log('Unread Notes Response:', response);
    // Backend returns List<LoveNote> directly, axios interceptor extracts .data
    return response;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await axiosInstance.get<number>('/love-notes/unread/count');
    console.log('Unread Count Response:', response);
    // Backend returns Long directly, axios interceptor extracts .data
    return response;
  },

  markAsRead: async (noteId: string): Promise<LoveNote> => {
    const response = await axiosInstance.put<LoveNote>(`/love-notes/${noteId}/read`);
    return response;
  },

  addReaction: async (noteId: string, reactionEmoji: string): Promise<LoveNote> => {
    const response = await axiosInstance.put<LoveNote>(`/love-notes/${noteId}/reaction`, {
      reactionEmoji
    });
    return response;
  },

  getLoveNote: async (noteId: string): Promise<LoveNote> => {
    const response = await axiosInstance.get<LoveNote>(`/love-notes/${noteId}`);
    return response;
  },

  deleteLoveNote: async (noteId: string): Promise<void> => {
    await axiosInstance.delete(`/love-notes/${noteId}`);
  }
}; 