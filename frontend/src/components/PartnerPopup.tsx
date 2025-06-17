import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { searchUsers, sendPartnerRequest, clearSearchResults, clearError } from '../store/slices/partnerSlice';
import { LoadingSpinner } from './LoadingSpinner';

interface PartnerPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PartnerPopup component
 * Modal for searching and sending partner requests to other users
 * Allows users to search by name and send partnership invitations
 */
const PartnerPopup: React.FC<PartnerPopupProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { searchResults, searchLoading, loading, error } = useAppSelector((state) => state.partner);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestSent, setRequestSent] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Clear search results and errors when popup closes
      dispatch(clearSearchResults());
      dispatch(clearError());
      setSearchQuery('');
      setRequestSent(null);
    }
  }, [isOpen, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchUsers(searchQuery.trim()));
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      await dispatch(sendPartnerRequest(userId)).unwrap();
      setRequestSent(userId);
      // Clear search results after successful request
      setTimeout(() => {
        dispatch(clearSearchResults());
        setSearchQuery('');
      }, 2000);
    } catch (err) {
      console.error('Failed to send partner request:', err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Find Your Partner</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-pink-100 text-sm mt-1">
            Search for someone special to connect with
          </p>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim() || searchLoading}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {searchLoading ? '...' : '🔍'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Loading */}
          {searchLoading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {/* Search Results */}
          {!searchLoading && searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Available Users
              </h3>
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  {requestSent === user.id ? (
                    <div className="text-green-600 font-medium text-sm flex items-center space-x-1">
                      <span>✓</span>
                      <span>Request Sent!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      disabled={loading}
                      className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? '...' : 'Send Request'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!searchLoading && searchQuery && searchResults.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">🔍</div>
              <p className="text-gray-600">No users found</p>
              <p className="text-gray-500 text-sm">Try searching with a different name</p>
            </div>
          )}

          {/* Empty State */}
          {!searchQuery && searchResults.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">💑</div>
              <p className="text-gray-600 mb-2">Start your search</p>
              <p className="text-gray-500 text-sm">
                Enter a name to find potential partners
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Partner requests create exclusive connections for chatting and sharing
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerPopup; 