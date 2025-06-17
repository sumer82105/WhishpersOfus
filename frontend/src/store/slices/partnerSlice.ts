import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { partnerService } from '../../services/partnerService';
import { PartnerRequest, User } from '../../services/api.types';

/**
 * Partner state interface
 * Manages the current partner, partner requests, and loading states
 */
interface PartnerState {
  partner: User | null;
  partnerRequests: {
    pending: PartnerRequest[];
    received: PartnerRequest[];
    sent: PartnerRequest[];
  };
  searchResults: User[];
  loading: boolean;
  error: string | null;
  searchLoading: boolean;
}

const initialState: PartnerState = {
  partner: null,
  partnerRequests: {
    pending: [],
    received: [],
    sent: []
  },
  searchResults: [],
  loading: false,
  error: null,
  searchLoading: false,
};

// Async thunks for partner operations

/**
 * Fetch the current user's partner
 */
export const fetchPartner = createAsyncThunk(
  'partner/fetchPartner',
  async (_, { rejectWithValue }) => {
    try {
      return await partnerService.getCurrentUserPartner();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Send a partner request to another user
 */
export const sendPartnerRequest = createAsyncThunk(
  'partner/sendPartnerRequest',
  async (receiverId: string, { rejectWithValue }) => {
    try {
      return await partnerService.sendPartnerRequest(receiverId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Respond to a partner request (accept or reject)
 */
export const respondToPartnerRequest = createAsyncThunk(
  'partner/respondToPartnerRequest',
  async ({ requestId, accepted }: { requestId: string; accepted: boolean }, { rejectWithValue }) => {
    try {
      return await partnerService.respondToPartnerRequest(requestId, accepted);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Fetch all pending partner requests
 */
export const fetchPendingRequests = createAsyncThunk(
  'partner/fetchPendingRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await partnerService.getPendingRequests();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Fetch all received partner requests
 */
export const fetchReceivedRequests = createAsyncThunk(
  'partner/fetchReceivedRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await partnerService.getReceivedRequests();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Fetch all sent partner requests
 */
export const fetchSentRequests = createAsyncThunk(
  'partner/fetchSentRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await partnerService.getSentRequests();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Search for users available for partnering
 */
export const searchUsers = createAsyncThunk(
  'partner/searchUsers',
  async (query: string, { rejectWithValue }) => {
    try {
      return await partnerService.searchUsers(query);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Partner slice
const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setPartner: (state, action: PayloadAction<User | null>) => {
      state.partner = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch partner
    builder
      .addCase(fetchPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartner.fulfilled, (state, action) => {
        state.loading = false;
        state.partner = action.payload;
      })
      .addCase(fetchPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Send partner request
    builder
      .addCase(sendPartnerRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPartnerRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Add the sent request to the sent requests list
        state.partnerRequests.sent.push(action.payload);
      })
      .addCase(sendPartnerRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Respond to partner request
    builder
      .addCase(respondToPartnerRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToPartnerRequest.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRequest = action.payload;
        
        // Remove from pending requests
        state.partnerRequests.pending = state.partnerRequests.pending.filter(
          req => req.id !== updatedRequest.id
        );
        
        // Update received requests
        const receivedIndex = state.partnerRequests.received.findIndex(
          req => req.id === updatedRequest.id
        );
        if (receivedIndex !== -1) {
          state.partnerRequests.received[receivedIndex] = updatedRequest;
        }
      })
      .addCase(respondToPartnerRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch pending requests
    builder
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.partnerRequests.pending = action.payload;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch received requests
    builder
      .addCase(fetchReceivedRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceivedRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.partnerRequests.received = action.payload;
      })
      .addCase(fetchReceivedRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch sent requests
    builder
      .addCase(fetchSentRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSentRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.partnerRequests.sent = action.payload;
      })
      .addCase(fetchSentRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search users
    builder
      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSearchResults, setPartner } = partnerSlice.actions;
export default partnerSlice.reducer; 