import axiosInstance from '../config/axios';
import { ChatMessage } from './api.types';

export const chatService = {
  sendMessage: async (data: {
    content: string;
    receiverId?: string;
    messageType?: 'TEXT' | 'IMAGE' | 'VOICE' | 'EMOJI' | 'SYSTEM';
  }): Promise<ChatMessage> => {
    const response = await axiosInstance.post('/chat/send', data);
    return response;
  },

  getMessages: async (
    partnerId?: string,
    page: number = 0,
    size: number = 20
  ): Promise<{
    content: ChatMessage[];
    totalElements: number;
    totalPages: number;
    hasMore: boolean;
  }> => {
    const params: any = { page, size };
    if (partnerId) {
      params.partnerId = partnerId;
    }
    
    const response = await axiosInstance.get('/chat/messages', { params });
    // Backend returns Page<ChatMessage> directly, axios interceptor extracts .data
    return {
      content: response.content || [],
      totalElements: response.totalElements || 0,
      totalPages: response.totalPages || 0,
      hasMore: (response.totalElements || 0) > (page + 1) * size
    };
  },

  getUnreadMessages: async (): Promise<ChatMessage[]> => {
    const response = await axiosInstance.get('/chat/unread');
    return response;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await axiosInstance.get('/chat/unread/count');
    return response;
  },

  markMessageAsRead: async (messageId: string): Promise<ChatMessage> => {
    const response = await axiosInstance.put(`/chat/${messageId}/read`);
    return response;
  },

  markMessagesAsRead: async (partnerId?: string): Promise<void> => {
    const params = partnerId ? { partnerId } : {};
    await axiosInstance.put('/chat/mark-read', null, { params });
  },

  getLatestMessage: async (partnerId?: string): Promise<ChatMessage> => {
    const params = partnerId ? { partnerId } : {};
    const response = await axiosInstance.get('/chat/latest', { params });
    return response;
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    await axiosInstance.delete(`/chat/${messageId}`);
  }
}; 