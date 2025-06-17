import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { persistor } from '../index';
import { auth } from '../../config/firebase';
import { userService } from '../../services/userService';
import { User } from '../../services/api.types';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Async thunks for authentication
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Try to get user profile from backend
      try {
        const userProfile = await userService.getCurrentUser();
        return {
          firebaseUser: userCredential.user,
          user: userProfile
        };
      } catch (error) {
        // If user profile doesn't exist, create a basic one
        const basicUser: User = {
          id: userCredential.user.uid,
          firebaseUid: userCredential.user.uid,
          name: userCredential.user.displayName || 'User',
          email: userCredential.user.email || '',
          profileImageUrl: userCredential.user.photoURL || '',
          role: 'PARTNER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return {
          firebaseUser: userCredential.user,
          user: basicUser
        };
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Try to get user profile from backend
      try {
        const userProfile = await userService.getCurrentUser();
        return {
          firebaseUser: userCredential.user,
          user: userProfile
        };
      } catch (error) {
        // If user profile doesn't exist, create a basic one
        const basicUser: User = {
          id: userCredential.user.uid,
          firebaseUid: userCredential.user.uid,
          name: userCredential.user.displayName || 'User',
          email: userCredential.user.email || '',
          profileImageUrl: userCredential.user.photoURL || '',
          role: 'PARTNER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return {
          firebaseUser: userCredential.user,
          user: basicUser
        };
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseSignOut(auth);
      
      // Clear localStorage
      localStorage.clear();
      
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ name, profileImageUrl }: { name?: string; profileImageUrl?: string }, { rejectWithValue }) => {
    try {
      const updatedUser = await userService.updateProfile(name, profileImageUrl);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<{ user: User | null; firebaseUser: FirebaseUser | null }>) => {
      state.user = action.payload.user;
      state.firebaseUser = action.payload.firebaseUser;
      state.isAuthenticated = !!action.payload.user;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.firebaseUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login with email
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.firebaseUser = action.payload.firebaseUser;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login with Google
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.firebaseUser = action.payload.firebaseUser;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.firebaseUser = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });

    // Update profile
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setAuthState, setLoading, clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer; 