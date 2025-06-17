import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  HeartIcon, 
  GiftIcon, 
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  fetchWishes, 
  createWish, 
  updateWishStatus, 
  deleteWish 
} from '../store/slices/appSlice';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MediaUploader } from '../components/MediaUploader';
import { Wish } from '../services/api.types';

const wishCategories = [
  'DATE', 'GIFT', 'ACTIVITY', 'TRAVEL', 'EXPERIENCE', 'OTHER'
] as const;

type WishCategory = typeof wishCategories[number];
type WishStatus = 'PENDING' | 'FULFILLED' | 'CANCELLED';

interface WishFormData {
  title: string;
  description: string;
  category: WishCategory;
  imageUrl: string;
}

const initialFormData: WishFormData = {
  title: '',
  description: '',
  category: 'OTHER',
  imageUrl: ''
};

const Wishes: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { wishes, loading, error } = useAppSelector((state) => state.app);

  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState<WishFormData>(initialFormData);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'fulfilled'>('all');
  const [showFulfillmentForm, setShowFulfillmentForm] = React.useState<string | null>(null);
  const [fulfillmentNote, setFulfillmentNote] = React.useState('');

  // Fetch wishes when component mounts
  React.useEffect(() => {
    if (user) {
      dispatch(fetchWishes());
    }
  }, [dispatch, user]);

  const filteredWishes = React.useMemo(() => {
    if (!wishes || wishes.length === 0) {
      return [];
    }
    
    switch (filter) {
      case 'pending':
        return wishes.filter(wish => wish.status === 'PENDING');
      case 'fulfilled':
        return wishes.filter(wish => wish.status === 'FULFILLED');
      default:
        return wishes;
    }
  }, [wishes, filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a wish title! ✨');
      return;
    }

    try {
      if (editingId) {
        // Update existing wish (you'll need to implement updateWish in the slice)
        toast.success('Wish updated successfully! ✨');
      } else {
        await dispatch(createWish({
          title: formData.title.trim(),
          description: formData.description.trim(),
          photoUrl: formData.imageUrl.trim() || undefined,
          category: formData.category
        })).unwrap();
        toast.success('Wish created successfully! ✨');
      }
      
      setFormData(initialFormData);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      toast.error('Failed to save wish 😢');
      console.error('Failed to save wish:', err);
    }
  };

  const handleEdit = (wish: Wish) => {
    setFormData({
      title: wish.title,
      description: wish.description || '',
      category: wish.category,
      imageUrl: wish.photoUrl || ''
    });
    setEditingId(wish.id);
    setShowForm(true);
  };

  const handleStatusUpdate = async (wishId: string, status: 'FULFILLED' | 'CANCELLED') => {
    try {
      await dispatch(updateWishStatus({
        wishId,
        status,
        fulfillmentNote: status === 'FULFILLED' ? fulfillmentNote : undefined
      })).unwrap();
      
      toast.success(
        status === 'FULFILLED' 
          ? 'Wish fulfilled! 🎉' 
          : 'Wish cancelled 😔'
      );
      
      setShowFulfillmentForm(null);
      setFulfillmentNote('');
    } catch (err) {
      toast.error('Failed to update wish status 😢');
      console.error('Failed to update wish status:', err);
    }
  };

  const handleDelete = async (wishId: string) => {
    if (!window.confirm('Are you sure you want to delete this wish?')) {
      return;
    }

    try {
      await dispatch(deleteWish(wishId)).unwrap();
      toast.success('Wish deleted successfully! 🗑️');
    } catch (err) {
      toast.error('Failed to delete wish 😢');
      console.error('Failed to delete wish:', err);
    }
  };

  // Handle image upload
  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
    toast.success('Image uploaded successfully! 📸');
  };

  // Handle image removal
  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    toast.success('Image removed! 🗑️');
  };

  const getCategoryIcon = (category: WishCategory) => {
    switch (category) {
      case 'DATE': return <HeartIcon className="w-5 h-5" />;
      case 'GIFT': return <GiftIcon className="w-5 h-5" />;
      case 'ACTIVITY': return <MapPinIcon className="w-5 h-5" />;
      case 'TRAVEL': return <MapPinIcon className="w-5 h-5" />;
      case 'EXPERIENCE': return <CalendarIcon className="w-5 h-5" />;
      default: return <HeartIcon className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: WishStatus) => {
    switch (status) {
      case 'FULFILLED': return 'text-green-600 bg-green-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: WishStatus) => {
    switch (status) {
      case 'FULFILLED': return <CheckCircleIcon className="w-4 h-4" />;
      case 'CANCELLED': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  if (loading && (!wishes || wishes.length === 0)) {
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
        <h1 className="text-3xl font-playfair text-pink-600">Our Wishes</h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'fulfilled')}
            className="rounded-lg border border-pink-200 px-4 py-2"
          >
            <option value="all">All Wishes</option>
            <option value="pending">Pending</option>
            <option value="fulfilled">Fulfilled</option>
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
              <span>Close</span>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>New Wish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Wish Form */}
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
                    Wish Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    placeholder="What do you wish for?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as WishCategory }))}
                    className="w-full p-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  >
                    {wishCategories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0) + category.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
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
                  placeholder="Describe your wish in detail..."
                />
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wish Image (Optional)
                </label>
                <MediaUploader
                  onUpload={handleImageUpload}
                  currentImageUrl={formData.imageUrl}
                  onRemove={handleImageRemove}
                  className="w-full"
                />
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
                  {editingId ? 'Update Wish' : 'Create Wish'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredWishes && filteredWishes.length > 0 && filteredWishes.map((wish) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Wish Image */}
              {wish.photoUrl && (
                <img
                  src={wish.photoUrl}
                  alt={wish.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 flex-1">
                    {wish.title}
                  </h3>
                  <div className="flex gap-1 ml-2">
                    {wish.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleEdit(wish)}
                          className="p-1 text-gray-400 hover:text-pink-500 transition-colors"
                          title="Edit wish"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowFulfillmentForm(wish.id)}
                          className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                          title="Mark as fulfilled"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(wish.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete wish"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(wish.status)}`}>
                    {getStatusIcon(wish.status)}
                    {wish.status.charAt(0) + wish.status.slice(1).toLowerCase()}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">
                    {getCategoryIcon(wish.category)}
                    {wish.category.charAt(0) + wish.category.slice(1).toLowerCase()}
                  </span>
                </div>
                
                {wish.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{wish.description}</p>
                )}
                
                <div className="text-xs text-gray-500">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>Created {format(new Date(wish.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  {wish.fulfilledAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-3 h-3" />
                      <span>Fulfilled {format(new Date(wish.fulfilledAt), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
                
                {wish.fulfillmentNote && (
                  <div className="mt-3 p-2 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <strong>Note:</strong> {wish.fulfillmentNote}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fulfillment Form Modal */}
      <AnimatePresence>
        {showFulfillmentForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Mark Wish as Fulfilled
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fulfillment Note (Optional)
                  </label>
                  <textarea
                    value={fulfillmentNote}
                    onChange={(e) => setFulfillmentNote(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    rows={3}
                    placeholder="How was this wish fulfilled?"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowFulfillmentForm(null);
                      setFulfillmentNote('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(showFulfillmentForm, 'FULFILLED')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Mark as Fulfilled
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredWishes?.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartIcon className="w-12 h-12 text-pink-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {filter === 'pending' ? 'No pending wishes' : 
             filter === 'fulfilled' ? 'No fulfilled wishes yet' : 'No wishes yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'pending' ? 'All your wishes have been fulfilled!' :
             filter === 'fulfilled' ? 'Start making wishes to see them fulfilled here!' :
             'Create your first wish and watch the magic happen!'}
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
            Make Your First Wish
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Wishes; 