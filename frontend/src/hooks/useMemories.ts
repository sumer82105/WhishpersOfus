import { useState, useEffect, useCallback } from 'react';
import { memoryService } from '../services/memoryService';
import { Memory } from '../services/api.types';

interface MemoriesState {
  memories: Memory[];
  loading: boolean;
  error: string | null;
}

type MemoryType = 'DATE' | 'MILESTONE' | 'DAILY' | 'SPECIAL';

export const useMemories = (type?: MemoryType) => {
  const [state, setState] = useState<MemoriesState>({
    memories: [],
    loading: true,
    error: null
  });

  const fetchMemories = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      let memories: Memory[];
      
      if (type) {
        memories = await memoryService.getMemoriesByType(type);
      } else {
        memories = await memoryService.getAllMemories('desc');
      }
      
      setState({
        memories,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch memories'
      }));
    }
  }, [type]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const createMemory = async (data: {
    title: string;
    description?: string;
    memoryDate: string;
    photoUrl?: string;
    location?: string;
    type: MemoryType;
    isMilestone?: boolean;
  }) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const newMemory = await memoryService.createMemory(data);
      setState(prev => ({
        ...prev,
        memories: [newMemory, ...prev.memories],
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create memory'
      }));
    }
  };

  const updateMemory = async (
    id: string,
    data: {
      title: string;
      description?: string;
      memoryDate: string;
      photoUrl?: string;
      location?: string;
      type: MemoryType;
      isMilestone?: boolean;
    }
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const updatedMemory = await memoryService.updateMemory(id, data);
      setState(prev => ({
        ...prev,
        memories: prev.memories.map(memory =>
          memory.id === id ? updatedMemory : memory
        ),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update memory'
      }));
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await memoryService.deleteMemory(id);
      setState(prev => ({
        ...prev,
        memories: prev.memories.filter(memory => memory.id !== id),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete memory'
      }));
    }
  };

  const getMilestones = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const milestones = await memoryService.getMilestones();
      setState(prev => ({
        ...prev,
        memories: milestones,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch milestones'
      }));
    }
  };

  const getMemoriesInDateRange = async (startDate: string, endDate: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const memories = await memoryService.getMemoriesInDateRange(startDate, endDate);
      setState(prev => ({
        ...prev,
        memories,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch memories in date range'
      }));
    }
  };

  return {
    memories: state.memories,
    loading: state.loading,
    error: state.error,
    createMemory,
    updateMemory,
    deleteMemory,
    getMilestones,
    getMemoriesInDateRange,
    refreshMemories: fetchMemories
  };
}; 