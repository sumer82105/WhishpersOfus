import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpenIcon, 
  PlusIcon, 
  CalendarIcon,
  MapPinIcon,
  HeartIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  fetchMemories, 
  createMemory, 
  updateMemory, 
  deleteMemory 
} from '../store/slices/appSlice';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MediaUploader } from '../components/MediaUploader';
import { Memory } from '../services/api.types';

const memoryTypes = [
  'FIRST_DATE', 'ANNIVERSARY', 'TRIP', 'SPECIAL_MOMENT', 'ACHIEVEMENT', 'CELEBRATION', 'OTHER'
] as const;

type MemoryType = typeof memoryTypes[number];

interface MemoryFormData {
  title: string;
  description: string;
  memoryDate: string;
  photoUrl: string;
  location: string;
  type: MemoryType;
  isMilestone: boolean;
}

const initialFormData: MemoryFormData = {
  title: '',
  description: '',
  memoryDate: format(new Date(), 'yyyy-MM-dd'),
  photoUrl: '',
  location: '',
  type: 'OTHER',
  isMilestone: false
};

const Memories: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { memories, loading, error } = useAppSelector((state) => state.app);

  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState<MemoryFormData>(initialFormData);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'milestones'>('all');

  // Fetch memories when component mounts
  React.useEffect(() => {
    if (user) {
      dispatch(fetchMemories());
    }
  }, [dispatch, user]);

  React.useEffect(() => {
    if (filter === 'milestones') {
      // For milestone filtering, we can filter on the frontend
      // or create a specific action for fetching milestones
      dispatch(fetchMemories());
    }
  }, [filter, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.memoryDate) {
      toast.error('Please fill in all required fields! 📝');
      return;
    }

    try {
      if (editingId) {
        await dispatch(updateMemory({ id: editingId, data: formData })).unwrap();
        toast.success('Memory updated successfully! 🎉');
      } else {
        await dispatch(createMemory(formData)).unwrap();
        toast.success('Memory created successfully! 🌟');
      }
      setFormData(initialFormData);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      toast.error(editingId ? 'Failed to update memory 😢' : 'Failed to create memory 😢');
      console.error('Failed to save memory:', err);
    }
  };

  const handleEdit = (memory: Memory) => {
    setFormData({
      title: memory.title,
      description: memory.description || '',
      memoryDate: memory.memoryDate,
      photoUrl: memory.photoUrls[0] || '',
      location: memory.location || '',
      type: memory.type,
      isMilestone: memory.isMilestone
    });
    setEditingId(memory.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    try {
      await dispatch(deleteMemory(id)).unwrap();
      toast.success('Memory deleted successfully! 🗑️');
    } catch (err) {
      toast.error('Failed to delete memory 😢');
      console.error('Failed to delete memory:', err);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (url: string) => {
    setFormData(prev => ({ ...prev, photoUrl: url }));
    toast.success('Photo uploaded successfully! 📸');
  };

  // Handle photo removal
  const handlePhotoRemove = () => {
    setFormData(prev => ({ ...prev, photoUrl: '' }));
    toast.success('Photo removed! 🗑️');
  };

  // Filter memories on the frontend
  const filteredMemories = filter === 'milestones'
  ? (memories?.filter(memory => memory.isMilestone) ?? [])
  : (memories ?? []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-playfair text-pink-600">Our Memories</h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'milestones')}
            className="rounded-lg border border-pink-200 px-4 py-2"
          >
            <option value="all">All Memories</option>
            <option value="milestones">Milestones</option>
          </select>
          <button
            onClick={() => {
              setFormData(initialFormData);
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            {showForm ? (
              <>
                <span>Close</span>
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>New Memory</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Memory Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-white rounded-lg shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    placeholder="Enter memory title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.memoryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, memoryDate: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MemoryType }))}
                    className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  >
                    {memoryTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  rows={3}
                  placeholder="Describe this memory..."
                />
              </div>
              
              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Memory Photo
                </label>
                <MediaUploader
                  onUpload={handlePhotoUpload}
                  currentImageUrl={formData.photoUrl}
                  onRemove={handlePhotoRemove}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isMilestone}
                  onChange={(e) => setFormData(prev => ({ ...prev, isMilestone: e.target.checked }))}
                  className="rounded border-pink-300 text-pink-500 focus:ring-pink-200"
                />
                <label className="text-sm text-gray-700">
                  Mark as milestone
                </label>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData(initialFormData);
                    setEditingId(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  {editingId ? 'Update Memory' : 'Create Memory'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMemories.map((memory) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {memory.photoUrls[0] && (
                <div className="relative">
                  <img
                    src={memory.photoUrls[0]}
                    alt={memory.title}
                    className="w-full h-48 object-cover"
                  />
                  {memory.isMilestone && (
                    <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <HeartIcon className="w-3 h-3 inline mr-1" />
                      Milestone
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 flex-1">
                    {memory.title}
                  </h3>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleEdit(memory)}
                      className="p-1 text-gray-400 hover:text-pink-500 transition-colors"
                      title="Edit memory"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(memory.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete memory"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{format(new Date(memory.memoryDate), 'MMMM d, yyyy')}</span>
                </div>
                
                {memory.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{memory.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <BookOpenIcon className="w-4 h-4" />
                  <span className="capitalize">{memory.type.toLowerCase().replace('_', ' ')}</span>
                </div>
                
                {memory.description && (
                  <p className="text-gray-600 text-sm line-clamp-3">{memory.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredMemories.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpenIcon className="w-16 h-16 text-pink-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {filter === 'milestones' ? 'No milestones yet' : 'No memories yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'milestones' 
              ? 'Create your first milestone memory to get started!' 
              : 'Start capturing your beautiful moments together!'
            }
          </p>
          <button
            onClick={() => {
              setFormData(initialFormData);
              setEditingId(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Create Your First Memory
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Memories; 