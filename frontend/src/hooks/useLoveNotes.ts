import { useState, useEffect, useCallback } from 'react';
import { loveNoteService } from '../services/loveNoteService';
import { LoveNote } from '../services/api.types';

interface LoveNotesState {
  notes: LoveNote[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

export const useLoveNotes = (initialPage: number = 0) => {
  const [state, setState] = useState<LoveNotesState>({
    notes: [],
    unreadCount: 0,
    loading: true,
    error: null,
    totalPages: 0,
    currentPage: initialPage
  });

  const fetchNotes = useCallback(async (page: number = state.currentPage) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { content, totalPages } = await loveNoteService.getAllLoveNotes(page);
      const unreadCount = await loveNoteService.getUnreadCount();
      
      setState(prev => ({
        ...prev,
        notes: content,
        unreadCount,
        totalPages,
        currentPage: page,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch love notes'
      }));
    }
  }, [state.currentPage]);

  useEffect(() => {
    fetchNotes(initialPage);
  }, [initialPage, fetchNotes]);

  const createNote = async (content: string, emotionTag: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await loveNoteService.createLoveNote(content, emotionTag);
      await fetchNotes(); // Refresh the list
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create love note'
      }));
    }
  };

  const markAsRead = async (noteId: string) => {
    try {
      await loveNoteService.markAsRead(noteId);
      setState(prev => ({
        ...prev,
        notes: prev.notes.map(note =>
          note.id === noteId ? { ...note, isRead: true } : note
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to mark note as read'
      }));
    }
  };

  const addReaction = async (noteId: string, reactionEmoji: string) => {
    try {
      const updatedNote = await loveNoteService.addReaction(noteId, reactionEmoji);
      setState(prev => ({
        ...prev,
        notes: prev.notes.map(note =>
          note.id === noteId ? updatedNote : note
        )
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to add reaction'
      }));
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await loveNoteService.deleteLoveNote(noteId);
      setState(prev => ({
        ...prev,
        notes: prev.notes.filter(note => note.id !== noteId)
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete note'
      }));
    }
  };

  const changePage = (newPage: number) => {
    if (newPage >= 0 && newPage < state.totalPages) {
      fetchNotes(newPage);
    }
  };

  return {
    notes: state.notes,
    unreadCount: state.unreadCount,
    loading: state.loading,
    error: state.error,
    totalPages: state.totalPages,
    currentPage: state.currentPage,
    createNote,
    markAsRead,
    addReaction,
    deleteNote,
    changePage,
    refreshNotes: fetchNotes
  };
}; 