import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { HeartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Goodbye! 💕');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-pink-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HeartIcon className="h-8 w-8 text-pink-500 animate-pulse" />
            <h1 className="text-2xl font-playfair text-pink-600">
              Whispers of Us
            </h1>
          </motion.div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-full hover:bg-pink-100/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full border-2 border-pink-300"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-pink-500" />
              )}
              <span className="text-pink-700 font-medium hidden sm:block">
                {user?.name || user?.email?.split('@')[0] || 'User'}
              </span>
            </motion.button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-pink-200/50 py-2"
              >
                <div className="px-4 py-2 border-b border-pink-200/50">
                  <p className="text-sm text-gray-600">Signed in as</p>
                  <p className="text-sm font-medium text-pink-700 truncate">
                    {user?.email}
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-100/50 transition-colors"
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 