import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, HeartIcon, MapPinIcon, CalendarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  fetchPhotos, 
  createPhotoMoment, 
  togglePhotoFavorite, 
  deletePhotoMoment 
} from '../store/slices/appSlice';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MediaUploader } from '../components/MediaUploader';
import { PhotoMoment } from '../services/api.types';

interface PhotoFormData {
  photoUrl: string;
  caption: string;
  location: string;
  takenAt: string;
}

const initialFormData: PhotoFormData = {
  photoUrl: '',
  caption: '',
  location: '',
  takenAt: format(new Date(), 'yyyy-MM-dd')
};

const PhotoMoments: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { photos, loading, error, hasMorePhotos } = useAppSelector((state) => state.app);

  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState<PhotoFormData>(initialFormData);
  const [filter, setFilter] = React.useState<'all' | 'favorites'>('all');

  // Fetch photos when component mounts
  React.useEffect(() => {
    if (user) {
      dispatch(fetchPhotos(0));
    }
  }, [dispatch, user]);

  const filteredPhotos = React.useMemo(() => {
    if (filter === 'favorites') {
      return photos.filter(photo => photo.isFavorite);
    }
    return photos;
  }, [photos, filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.photoUrl.trim()) {
      toast.error('Please upload a photo! 📸');
      return;
    }

    try {
      await dispatch(createPhotoMoment({
        ...formData,
        photoUrl: formData.photoUrl.trim(),
        caption: formData.caption.trim(),
        location: formData.location.trim()
      })).unwrap();
      
      setFormData(initialFormData);
      setShowForm(false);
      toast.success('Photo moment created successfully! 📸');
    } catch (err) {
      toast.error('Failed to create photo moment 😢');
      console.error('Failed to create photo moment:', err);
    }
  };

  const handleToggleFavorite = async (photoId: string) => {
    try {
      await dispatch(togglePhotoFavorite(photoId)).unwrap();
      toast.success('Updated favorite status! ❤️');
    } catch (err) {
      toast.error('Failed to update favorite status 😢');
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!window.confirm('Are you sure you want to delete this photo moment?')) {
      return;
    }

    try {
      await dispatch(deletePhotoMoment(photoId)).unwrap();
      toast.success('Photo moment deleted successfully! 🗑️');
    } catch (err) {
      toast.error('Failed to delete photo moment 😢');
      console.error('Failed to delete photo:', err);
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

  if (loading && photos.length === 0) {
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
        <h1 className="text-3xl font-playfair text-pink-600">Photo Moments</h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'favorites')}
            className="rounded-lg border border-pink-200 px-4 py-2"
          >
            <option value="all">All Photos</option>
            <option value="favorites">Favorites</option>
          </select>
          <button
            onClick={() => {
              setFormData(initialFormData);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            {showForm ? (
              <span>Close</span>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>New Photo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Photo Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-white rounded-lg shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo *
                </label>
                <MediaUploader
                  onUpload={handlePhotoUpload}
                  currentImageUrl={formData.photoUrl}
                  onRemove={handlePhotoRemove}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <textarea
                  value={formData.caption}
                  onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  rows={3}
                  placeholder="Share what makes this moment special..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    placeholder="Where was this taken?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Taken
                  </label>
                  <input
                    type="date"
                    value={formData.takenAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, takenAt: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData(initialFormData);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Save Photo Moment
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={photo.photoUrl}
                  alt={photo.caption || 'Photo moment'}
                  className="w-full h-64 object-cover"
                />
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleToggleFavorite(photo.id)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      photo.isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/80 text-gray-600 hover:text-red-500'
                    }`}
                    title={photo.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {photo.isFavorite ? (
                      <HeartSolid className="w-5 h-5" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="p-2 rounded-full bg-white/80 text-gray-600 hover:text-red-500 backdrop-blur-sm transition-colors"
                    title="Delete photo"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {photo.caption && (
                  <p className="text-gray-800 mb-3 line-clamp-3">{photo.caption}</p>
                )}
                
                <div className="space-y-2 text-sm text-gray-500">
                  {photo.location && (
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{photo.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {photo.takenAt 
                        ? format(new Date(photo.takenAt), 'MMMM d, yyyy')
                        : format(new Date(photo.uploadedAt), 'MMMM d, yyyy')
                      }
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredPhotos.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {filter === 'favorites' ? 'No favorite photos yet' : 'No photo moments yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'favorites' 
              ? 'Mark some photos as favorites to see them here!' 
              : 'Start capturing and sharing your beautiful moments together!'
            }
          </p>
          <button
            onClick={() => {
              setFormData(initialFormData);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Your First Photo
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PhotoMoments; 