import axios from 'axios';
import { auth } from '../config/firebase';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include Firebase token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['Firebase-UID'] = user.uid;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // User endpoints
  createUser: (userData) => api.post('/users/register', userData),
  createOrUpdateUser: (userData) => api.post('/users/create-or-update', userData),
  getCurrentUser: () => api.get('/users/me'),

  // Love Notes endpoints
  createLoveNote: (noteData) => api.post('/love-notes', noteData),
  getLoveNotes: (page = 0, size = 10) => api.get(`/love-notes?page=${page}&size=${size}`),
  getUnreadNotes: () => api.get('/love-notes/unread'),
  getUnreadNotesCount: () => api.get('/love-notes/unread/count'),
  markNoteAsRead: (noteId) => api.put(`/love-notes/${noteId}/read`),
  addReaction: (noteId, emoji) => api.put(`/love-notes/${noteId}/reaction`, { reactionEmoji: emoji }),
  deleteLoveNote: (noteId) => api.delete(`/love-notes/${noteId}`),

  // Memory endpoints
  createMemory: (memoryData) => api.post('/memories', memoryData),
  getMemories: (order = 'asc') => api.get(`/memories?order=${order}`),
  getMilestones: () => api.get('/memories/milestones'),
  getMemoriesByType: (type) => api.get(`/memories/type/${type}`),
  getMemoriesInDateRange: (startDate, endDate) => 
    api.get(`/memories/date-range?startDate=${startDate}&endDate=${endDate}`),
  updateMemory: (memoryId, memoryData) => api.put(`/memories/${memoryId}`, memoryData),
  deleteMemory: (memoryId) => api.delete(`/memories/${memoryId}`),

  // Surprise endpoints
  getSurprises: () => api.get('/surprises'),
  getUnlockedSurprises: () => api.get('/surprises/unlocked'),
  unlockSurprise: (surpriseId) => api.put(`/surprises/${surpriseId}/unlock`),

  // Wish endpoints
  createWish: (wishData) => api.post('/wishes', wishData),
  getWishes: () => api.get('/wishes'),
  getWishesByStatus: (status) => api.get(`/wishes/status/${status}`),
  updateWishStatus: (wishId, status, note) => 
    api.put(`/wishes/${wishId}/status`, { status, fulfillmentNote: note }),
  deleteWish: (wishId) => api.delete(`/wishes/${wishId}`),

  // Photo Moments endpoints
  createPhotoMoment: (photoData) => api.post('/photo-moments', photoData),
  getPhotoMoments: (page = 0, size = 20) => api.get(`/photo-moments?page=${page}&size=${size}`),
  getFavoritePhotos: () => api.get('/photo-moments/favorites'),
  toggleFavorite: (photoId) => api.put(`/photo-moments/${photoId}/favorite`),
  deletePhotoMoment: (photoId) => api.delete(`/photo-moments/${photoId}`),
};

export default api; 