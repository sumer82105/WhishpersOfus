import axiosInstance from '../config/axios';
import { 
  ApiResponse, 
  PartnerRequest, 
  PartnerRequestDto, 
  PartnerRequestResponseDto, 
  User 
} from './api.types';

/**
 * Partner service for handling all partner-related API calls
 * Manages partner requests, responses, and partner relationships
 */
export const partnerService = {
  
  /**
   * Send a partner request to another user
   */
  sendPartnerRequest: async (receiverId: string): Promise<PartnerRequest> => {
    const response = await axiosInstance.post<ApiResponse<PartnerRequest>>('/partner/request', {
      receiverId
    } as PartnerRequestDto);
    return response.data;
  },

  /**
   * Respond to a partner request (accept or reject)
   */
  respondToPartnerRequest: async (requestId: string, accepted: boolean): Promise<PartnerRequest> => {
    const response = await axiosInstance.post<ApiResponse<PartnerRequest>>('/partner/respond', {
      requestId,
      accepted
    } as PartnerRequestResponseDto);
    return response.data;
  },

  /**
   * Get the current user's partner
   */
  getCurrentUserPartner: async (): Promise<User | null> => {
    const response = await axiosInstance.get<ApiResponse<User | null>>('/partner/me');
    return response.data;
  },

  /**
   * Get all pending partner requests received by the current user
   */
  getPendingRequests: async (): Promise<PartnerRequest[]> => {
    const response = await axiosInstance.get<ApiResponse<PartnerRequest[]>>('/partner/requests/pending');
    return response.data;
  },

  /**
   * Get all partner requests received by the current user
   */
  getReceivedRequests: async (): Promise<PartnerRequest[]> => {
    const response = await axiosInstance.get<ApiResponse<PartnerRequest[]>>('/partner/requests/received');
    return response.data;
  },

  /**
   * Get all partner requests sent by the current user
   */
  getSentRequests: async (): Promise<PartnerRequest[]> => {
    const response = await axiosInstance.get<ApiResponse<PartnerRequest[]>>('/partner/requests/sent');
    return response.data;
  },

  /**
   * Search for available users for partnering
   */
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await axiosInstance.get<ApiResponse<User[]>>(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}; 