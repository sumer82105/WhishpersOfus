import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GiftIcon, SparklesIcon, HeartIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchSurprises, createSurprise, unlockSurprise, deleteSurprise } from '../store/slices/appSlice';
import { Surprise } from '../services/api.types';
import toast from 'react-hot-toast';

const SurpriseBox: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { surprises, loading } = useAppSelector((state) => state.app);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSurprise, setNewSurprise] = useState({
    title: '',
    description: '',
    unlockCondition: '',
    contentUrl: '',
    contentType: 'MESSAGE' as 'MESSAGE' | 'PHOTO' | 'VIDEO' | 'VOICE_NOTE' | 'GIFT_IDEA'
  });

  // Fetch surprises when component mounts
  useEffect(() => {
    if (user) {
      dispatch(fetchSurprises());
    }
  }, [dispatch, user]);

  const handleCreateSurprise = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSurprise.title || !newSurprise.unlockCondition) {
      toast.error('Please fill in title and unlock condition');
      return;
    }

    try {
      await dispatch(createSurprise(newSurprise)).unwrap();
      setNewSurprise({
        title: '',
        description: '',
        unlockCondition: '',
        contentUrl: '',
        contentType: 'MESSAGE'
      });
      setShowCreateForm(false);
      toast.success('Surprise created! 🎉');
    } catch (error) {
      toast.error('Failed to create surprise');
    }
  };

  const handleUnlockSurprise = async (id: string) => {
    try {
      await dispatch(unlockSurprise(id)).unwrap();
      toast.success('Surprise unlocked! ✨');
    } catch (error) {
      toast.error('Failed to unlock surprise');
    }
  };

  const handleDeleteSurprise = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this surprise?')) {
      try {
        await dispatch(deleteSurprise(id)).unwrap();
        toast.success('Surprise deleted');
      } catch (error) {
        toast.error('Failed to delete surprise');
      }
    }
  };

  const contentTypeEmojis = {
    MESSAGE: '💌',
    PHOTO: '📸',
    VIDEO: '🎥',
    VOICE_NOTE: '🎵',
    GIFT_IDEA: '🎁'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-playfair text-pink-600 mb-4 flex items-center justify-center gap-3">
          <GiftIcon className="h-10 w-10" />
          Surprise Box
          <SparklesIcon className="h-8 w-8 animate-pulse" />
        </h1>
        <p className="text-lg text-gray-600">
          Special surprises waiting to be revealed! 🎉
        </p>
      </motion.div>

      {/* Create Surprise Button */}
      <motion.div variants={itemVariants} className="text-center">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2 mx-auto"
        >
          <GiftIcon className="h-5 w-5" />
          Create New Surprise
        </button>
      </motion.div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold mb-4">Create New Surprise</h3>
            <form onSubmit={handleCreateSurprise} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newSurprise.title}
                  onChange={(e) => setNewSurprise(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="Surprise title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newSurprise.description}
                  onChange={(e) => setNewSurprise(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent h-24"
                  placeholder="What's the surprise?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unlock Condition *
                </label>
                <input
                  type="text"
                  value={newSurprise.unlockCondition}
                  onChange={(e) => setNewSurprise(prev => ({ ...prev, unlockCondition: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="When should this be unlocked?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Type
                </label>
                <select
                  value={newSurprise.contentType}
                  onChange={(e) => setNewSurprise(prev => ({ 
                    ...prev, 
                    contentType: e.target.value as typeof newSurprise.contentType
                  }))}
                  className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                >
                  <option value="MESSAGE">💌 Message</option>
                  <option value="PHOTO">📸 Photo</option>
                  <option value="VIDEO">🎥 Video</option>
                  <option value="VOICE_NOTE">🎵 Voice Note</option>
                  <option value="GIFT_IDEA">🎁 Gift Idea</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content URL
                </label>
                <input
                  type="url"
                  value={newSurprise.contentUrl}
                  onChange={(e) => setNewSurprise(prev => ({ ...prev, contentUrl: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="Link to photo, video, etc."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Create Surprise
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Surprises Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(surprises) && surprises.map((surprise) => (
          <motion.div
            key={surprise.id}
            className={`bg-white p-6 rounded-lg shadow-lg border-2 ${
              surprise.isUnlocked ? 'border-green-200' : 'border-pink-200'
            }`}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{contentTypeEmojis[surprise.contentType]}</span>
                <h3 className="text-lg font-semibold text-gray-800">{surprise.title}</h3>
              </div>
              {surprise.isUnlocked ? (
                <LockOpenIcon className="h-5 w-5 text-green-500" />
              ) : (
                <LockClosedIcon className="h-5 w-5 text-pink-500" />
              )}
            </div>

            {surprise.description && (
              <p className="text-gray-600 mb-4">{surprise.description}</p>
            )}

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-500">
                <strong>Unlock condition:</strong> {surprise.unlockCondition}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Created:</strong> {new Date(surprise.createdAt).toLocaleDateString()}
              </p>
              {surprise.unlockDate && (
                <p className="text-sm text-green-600">
                  <strong>Unlocked:</strong> {new Date(surprise.unlockDate).toLocaleDateString()}
                </p>
              )}
            </div>

            {surprise.contentUrl && surprise.isUnlocked && (
              <div className="mb-4">
                <a
                  href={surprise.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600 underline"
                >
                  View Content
                </a>
              </div>
            )}

            <div className="flex gap-2">
              {!surprise.isUnlocked && (
                <button
                  onClick={() => handleUnlockSurprise(surprise.id)}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <LockOpenIcon className="h-4 w-4" />
                  Unlock
                </button>
              )}
              <button
                onClick={() => handleDeleteSurprise(surprise.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {Array.isArray(surprises) && surprises.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12">
          <GiftIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No surprises yet. Create your first surprise! 🎁
          </h3>
          <p className="text-gray-500">
            Start creating magical moments for your loved one.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SurpriseBox; 