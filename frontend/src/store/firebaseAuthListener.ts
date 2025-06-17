import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { setAuthState, clearAuth } from './slices/authSlice';
import { clearAllData } from './slices/appSlice';
import { userService } from '../services/userService';
import type { AppDispatch } from './index';
import { User } from '../services/api.types';

export const initializeAuthListener = (dispatch: AppDispatch) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        // Try to get user profile from backend
        const userProfile = await userService.getCurrentUser();
        dispatch(setAuthState({
          user: userProfile,
          firebaseUser
        }));
      } catch (error) {
        // If user profile doesn't exist, create a basic one
        console.log('Creating new user profile...');
        const basicUser: User = {
          id: firebaseUser.uid,
          firebaseUid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          profileImageUrl: firebaseUser.photoURL || '',
          role: 'PARTNER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        dispatch(setAuthState({
          user: basicUser,
          firebaseUser
        }));
      }
    } else {
      dispatch(clearAuth());
      dispatch(clearAllData());
    }
  });
}; 