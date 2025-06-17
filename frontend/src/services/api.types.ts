export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  role: 'PARTNER';
  createdAt: string;
  updatedAt: string;
}

export interface LoveNote {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  emotionTag: string;
  reactionEmoji?: string;
  read: boolean;
  isRead?: boolean; // Keep for backward compatibility, but API uses 'read'
  createdAt: string;
  readAt?: string;
}

export interface Memory {
  id: string;
  title: string;
  description?: string;
  memoryDate: string;
  photoUrls: string[];
  location?: string;
  type: 'FIRST_DATE' | 'ANNIVERSARY' | 'TRIP' | 'SPECIAL_MOMENT' | 'ACHIEVEMENT' | 'CELEBRATION' | 'OTHER';
  isMilestone: boolean;
  createdAt: string;
}

export interface Wish {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  photoUrl?: string;
  category: 'DATE' | 'GIFT' | 'ACTIVITY' | 'TRAVEL' | 'EXPERIENCE' | 'OTHER';
  status: 'PENDING' | 'FULFILLED' | 'CANCELLED';
  fulfillmentNote?: string;
  createdAt: string;
  fulfilledAt?: string;
}

export interface Surprise {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  unlockCondition: string;
  contentUrl?: string;
  contentType: 'MESSAGE' | 'PHOTO' | 'VIDEO' | 'VOICE_NOTE' | 'GIFT_IDEA';
  isUnlocked: boolean;
  unlockDate?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'VOICE' | 'EMOJI' | 'SYSTEM';
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoMoment {
  id: string;
  uploaderId: string;
  photoUrl: string;
  caption?: string;
  location?: string;
  takenAt?: string;
  isFavorite: boolean;
  uploadedAt: string;
}

export interface PartnerRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface UserPartner {
  id: string;
  user1Id: string;
  user2Id: string;
  linkedAt: string;
  createdAt: string;
}

export interface PartnerRequestDto {
  receiverId: string;
}

export interface PartnerRequestResponseDto {
  requestId: string;
  accepted: boolean;
} 