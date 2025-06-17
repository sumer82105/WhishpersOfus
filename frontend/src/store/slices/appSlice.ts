import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loveNoteService } from '../../services/loveNoteService';
import { memoryService } from '../../services/memoryService';
import { wishService } from '../../services/wishService';
import { photoService } from '../../services/photoService';
import { surpriseService } from '../../services/surpriseService';
import { LoveNote, Memory, Wish, PhotoMoment, Surprise } from '../../services/api.types';

interface AppState {
  // Love Notes
  notes: LoveNote[];
  unreadCount: number;
  
  // Memories
  memories: Memory[];
  
  // Wishes
  wishes: Wish[];
  
  // Surprises
  surprises: Surprise[];
  unlockedSurprises: Surprise[];
  lockedSurprises: Surprise[];
  
  // Photo Moments
  photos: PhotoMoment[];
  hasMorePhotos: boolean;
  currentPhotoPage: number;
  
  // Global state
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  notes: [],
  unreadCount: 0,
  memories: [],
  wishes: [],
  surprises: [],
  unlockedSurprises: [],
  lockedSurprises: [],
  photos: [],
  hasMorePhotos: true,
  currentPhotoPage: 0,
  loading: false,
  error: null,
};

// Love Notes Async Thunks
export const fetchLoveNotes = createAsyncThunk(
  'app/fetchLoveNotes',
  async (page: number = 0, { rejectWithValue }) => {
    try {
      const result = await loveNoteService.getAllLoveNotes(page);
      const unreadCount = await loveNoteService.getUnreadCount();
      return { notes: result.content, unreadCount };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createLoveNote = createAsyncThunk(
  'app/createLoveNote',
  async ({ content, emotionTag }: { content: string; emotionTag: string }, { rejectWithValue }) => {
    try {
      const newNote = await loveNoteService.createLoveNote(content, emotionTag);
      console.log('New Note:', newNote);
      return newNote;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markNoteAsRead = createAsyncThunk(
  'app/markNoteAsRead',
  async (noteId: string, { rejectWithValue }) => {
    try {
      await loveNoteService.markAsRead(noteId);
      return noteId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNoteReaction = createAsyncThunk(
  'app/addNoteReaction',
  async ({ noteId, emoji }: { noteId: string; emoji: string }, { rejectWithValue }) => {
    try {
      await loveNoteService.addReaction(noteId, emoji);
      return { noteId, emoji };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLoveNote = createAsyncThunk(
  'app/deleteLoveNote',
  async (noteId: string, { rejectWithValue }) => {
    try {
      await loveNoteService.deleteLoveNote(noteId);
      return noteId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Memories Async Thunks
export const fetchMemories = createAsyncThunk(
  'app/fetchMemories',
  async (sortOrder: 'asc' | 'desc' = 'desc', { rejectWithValue }) => {
    try {
      const memories = await memoryService.getAllMemories(sortOrder);
      return memories;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMemory = createAsyncThunk(
  'app/createMemory',
  async (data: {
    title: string;
    description?: string;
    memoryDate: string;
    photoUrl?: string;
    location?: string;
    type: 'FIRST_DATE' | 'ANNIVERSARY' | 'TRIP' | 'SPECIAL_MOMENT' | 'ACHIEVEMENT' | 'CELEBRATION' | 'OTHER';
    isMilestone?: boolean;
  }, { rejectWithValue }) => {
    try {
      const newMemory = await memoryService.createMemory(data);
      return newMemory;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMemory = createAsyncThunk(
  'app/updateMemory',
  async ({ id, data }: {
    id: string;
    data: {
      title: string;
      description?: string;
      memoryDate: string;
      photoUrl?: string;
      location?: string;
      type: 'FIRST_DATE' | 'ANNIVERSARY' | 'TRIP' | 'SPECIAL_MOMENT' | 'ACHIEVEMENT' | 'CELEBRATION' | 'OTHER';
      isMilestone?: boolean;
    };
  }, { rejectWithValue }) => {
    try {
      const updatedMemory = await memoryService.updateMemory(id, data);
      return updatedMemory;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMemory = createAsyncThunk(
  'app/deleteMemory',
  async (id: string, { rejectWithValue }) => {
    try {
      await memoryService.deleteMemory(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Wishes Async Thunks
export const fetchWishes = createAsyncThunk(
  'app/fetchWishes',
  async (_, { rejectWithValue }) => {
    try {
      const wishes = await wishService.getAllWishes();
      return wishes;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createWish = createAsyncThunk(
  'app/createWish',
  async (data: {
    title: string;
    description: string;
    photoUrl?: string;
    category: 'DATE' | 'GIFT' | 'ACTIVITY' | 'TRAVEL' | 'EXPERIENCE' | 'OTHER';
  }, { rejectWithValue }) => {
    try {
      const newWish = await wishService.createWish(data);
      return newWish;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWishStatus = createAsyncThunk(
  'app/updateWishStatus',
  async ({ wishId, status, fulfillmentNote }: {
    wishId: string;
    status: 'FULFILLED' | 'CANCELLED';
    fulfillmentNote?: string;
  }, { rejectWithValue }) => {
    try {
      await wishService.updateWishStatus(wishId, status, fulfillmentNote);
      return { wishId, status, fulfillmentNote };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWish = createAsyncThunk(
  'app/deleteWish',
  async (wishId: string, { rejectWithValue }) => {
    try {
      await wishService.deleteWish(wishId);
      return wishId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Surprises Async Thunks
export const fetchSurprises = createAsyncThunk(
  'app/fetchSurprises',
  async (_, { rejectWithValue }) => {
    try {
      const surprises = await surpriseService.getAllSurprises();
      return surprises;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUnlockedSurprises = createAsyncThunk(
  'app/fetchUnlockedSurprises',
  async (_, { rejectWithValue }) => {
    try {
      const unlockedSurprises = await surpriseService.getUnlockedSurprises();
      return unlockedSurprises;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLockedSurprises = createAsyncThunk(
  'app/fetchLockedSurprises',
  async (_, { rejectWithValue }) => {
    try {
      const lockedSurprises = await surpriseService.getLockedSurprises();
      return lockedSurprises;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSurprise = createAsyncThunk(
  'app/createSurprise',
  async (data: {
    title: string;
    description?: string;
    unlockCondition: string;
    contentUrl?: string;
    contentType: 'MESSAGE' | 'PHOTO' | 'VIDEO' | 'VOICE_NOTE' | 'GIFT_IDEA';
  }, { rejectWithValue }) => {
    try {
      const newSurprise = await surpriseService.createSurprise(data);
      return newSurprise;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const unlockSurprise = createAsyncThunk(
  'app/unlockSurprise',
  async (surpriseId: string, { rejectWithValue }) => {
    try {
      const unlockedSurprise = await surpriseService.unlockSurprise(surpriseId);
      return unlockedSurprise;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSurprise = createAsyncThunk(
  'app/updateSurprise',
  async ({ id, data }: {
    id: string;
    data: {
      title: string;
      description?: string;
      unlockCondition: string;
      contentUrl?: string;
      contentType: 'MESSAGE' | 'PHOTO' | 'VIDEO' | 'VOICE_NOTE' | 'GIFT_IDEA';
    };
  }, { rejectWithValue }) => {
    try {
      const updatedSurprise = await surpriseService.updateSurprise(id, data);
      return updatedSurprise;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSurprise = createAsyncThunk(
  'app/deleteSurprise',
  async (surpriseId: string, { rejectWithValue }) => {
    try {
      await surpriseService.deleteSurprise(surpriseId);
      return surpriseId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Photos Async Thunks
export const fetchPhotos = createAsyncThunk(
  'app/fetchPhotos',
  async (page: number = 0, { rejectWithValue }) => {
    try {
      const result = await photoService.getPhotoMoments(page);
      return { photos: result.content, hasMore: result.hasMore, page };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPhotoMoment = createAsyncThunk(
  'app/createPhotoMoment',
  async (data: {
    photoUrl: string;
    caption?: string;
    location?: string;
    takenAt?: string;
  }, { rejectWithValue }) => {
    try {
      const newPhoto = await photoService.createPhotoMoment(data);
      return newPhoto;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const togglePhotoFavorite = createAsyncThunk(
  'app/togglePhotoFavorite',
  async (photoId: string, { rejectWithValue }) => {
    try {
      await photoService.toggleFavorite(photoId);
      return photoId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePhotoMoment = createAsyncThunk(
  'app/deletePhotoMoment',
  async (photoId: string, { rejectWithValue }) => {
    try {
      await photoService.deletePhotoMoment(photoId);
      return photoId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// App slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAllData: (state) => {
      state.notes = [];
      state.unreadCount = 0;
      state.memories = [];
      state.wishes = [];
      state.photos = [];
      state.hasMorePhotos = true;
      state.currentPhotoPage = 0;
    }
  },
  extraReducers: (builder) => {
    // Love Notes
    builder
      .addCase(fetchLoveNotes.fulfilled, (state, action) => {
        state.notes = action.payload.notes;
        state.unreadCount = action.payload.unreadCount;
        state.loading = false;
      })
      .addCase(createLoveNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
        state.unreadCount += 1;
      })
      .addCase(markNoteAsRead.fulfilled, (state, action) => {
        const noteIndex = state.notes.findIndex(note => note.id === action.payload);
        if (noteIndex !== -1) {
          state.notes[noteIndex].read = true;
          state.notes[noteIndex].isRead = true; // Keep both for compatibility
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(addNoteReaction.fulfilled, (state, action) => {
        const noteIndex = state.notes.findIndex(note => note.id === action.payload.noteId);
        if (noteIndex !== -1) {
          state.notes[noteIndex].reactionEmoji = action.payload.emoji;
        }
      })
      .addCase(deleteLoveNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(note => note.id !== action.payload);
      });

    // Memories
    builder
      .addCase(fetchMemories.fulfilled, (state, action) => {
        state.memories = action.payload;
        state.loading = false;
      })
      .addCase(createMemory.fulfilled, (state, action) => {
        state.memories.unshift(action.payload);
      })
      .addCase(updateMemory.fulfilled, (state, action) => {
        const memoryIndex = state.memories.findIndex(memory => memory.id === action.payload.id);
        if (memoryIndex !== -1) {
          state.memories[memoryIndex] = action.payload;
        }
      })
      .addCase(deleteMemory.fulfilled, (state, action) => {
        state.memories = state.memories.filter(memory => memory.id !== action.payload);
      });

    // Wishes
    builder
      .addCase(fetchWishes.fulfilled, (state, action) => {
        state.wishes = action.payload;
        state.loading = false;
      })
      .addCase(createWish.fulfilled, (state, action) => {
        state.wishes.unshift(action.payload);
      })
      .addCase(updateWishStatus.fulfilled, (state, action) => {
        const wishIndex = state.wishes.findIndex(wish => wish.id === action.payload.wishId);
        if (wishIndex !== -1) {
          state.wishes[wishIndex].status = action.payload.status;
          if (action.payload.fulfillmentNote) {
            state.wishes[wishIndex].fulfillmentNote = action.payload.fulfillmentNote;
          }
        }
      })
      .addCase(deleteWish.fulfilled, (state, action) => {
        state.wishes = state.wishes.filter(wish => wish.id !== action.payload);
      });

    // Surprises
    builder
      .addCase(fetchSurprises.fulfilled, (state, action) => {
        state.surprises = action.payload;
        state.loading = false;
      })
      .addCase(fetchUnlockedSurprises.fulfilled, (state, action) => {
        state.unlockedSurprises = action.payload;
      })
      .addCase(fetchLockedSurprises.fulfilled, (state, action) => {
        state.lockedSurprises = action.payload;
      })
      .addCase(createSurprise.fulfilled, (state, action) => {
        state.surprises.unshift(action.payload);
        state.lockedSurprises.unshift(action.payload);
      })
      .addCase(unlockSurprise.fulfilled, (state, action) => {
        const surpriseIndex = state.surprises.findIndex(surprise => surprise.id === action.payload.id);
        if (surpriseIndex !== -1) {
          state.surprises[surpriseIndex] = action.payload;
        }
        // Move from locked to unlocked
        state.lockedSurprises = state.lockedSurprises.filter(surprise => surprise.id !== action.payload.id);
        state.unlockedSurprises.unshift(action.payload);
      })
      .addCase(updateSurprise.fulfilled, (state, action) => {
        const surpriseIndex = state.surprises.findIndex(surprise => surprise.id === action.payload.id);
        if (surpriseIndex !== -1) {
          state.surprises[surpriseIndex] = action.payload;
        }
        // Update in appropriate list
        if (action.payload.isUnlocked) {
          const unlockedIndex = state.unlockedSurprises.findIndex(surprise => surprise.id === action.payload.id);
          if (unlockedIndex !== -1) {
            state.unlockedSurprises[unlockedIndex] = action.payload;
          }
        } else {
          const lockedIndex = state.lockedSurprises.findIndex(surprise => surprise.id === action.payload.id);
          if (lockedIndex !== -1) {
            state.lockedSurprises[lockedIndex] = action.payload;
          }
        }
      })
      .addCase(deleteSurprise.fulfilled, (state, action) => {
        state.surprises = state.surprises.filter(surprise => surprise.id !== action.payload);
        state.unlockedSurprises = state.unlockedSurprises.filter(surprise => surprise.id !== action.payload);
        state.lockedSurprises = state.lockedSurprises.filter(surprise => surprise.id !== action.payload);
      });

    // Photos
    builder
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        if (action.payload.page === 0) {
          state.photos = action.payload.photos;
        } else {
          state.photos.push(...action.payload.photos);
        }
        state.hasMorePhotos = action.payload.hasMore;
        state.currentPhotoPage = action.payload.page;
        state.loading = false;
      })
      .addCase(createPhotoMoment.fulfilled, (state, action) => {
        state.photos.unshift(action.payload);
      })
      .addCase(togglePhotoFavorite.fulfilled, (state, action) => {
        const photoIndex = state.photos.findIndex(photo => photo.id === action.payload);
        if (photoIndex !== -1) {
          state.photos[photoIndex].isFavorite = !state.photos[photoIndex].isFavorite;
        }
      })
      .addCase(deletePhotoMoment.fulfilled, (state, action) => {
        state.photos = state.photos.filter(photo => photo.id !== action.payload);
      });

    // Handle loading states - only for fetch operations
    builder
      .addCase(fetchLoveNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoveNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMemories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWishes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, clearError, clearAllData } = appSlice.actions;
export default appSlice.reducer; 