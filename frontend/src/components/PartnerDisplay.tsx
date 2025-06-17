import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPartner } from '../store/slices/partnerSlice';
import PartnerPopup from './PartnerPopup';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * PartnerDisplay component
 * Shows the current partner relationship or provides option to find a partner
 * Displays: "You ❤️ ∞ ❤️ Partner" if partnered, or "Add Partner" button if not
 */
const PartnerDisplay: React.FC = () => {
  const dispatch = useAppDispatch();
  const { partner, loading, error } = useAppSelector((state) => state.partner);
  const { user } = useAppSelector((state) => state.auth);
  const [showPartnerPopup, setShowPartnerPopup] = useState(false);

  useEffect(() => {
    // Fetch partner when component mounts
    if (user) {
      dispatch(fetchPartner());
    }
  }, [dispatch, user]);

  const handleAddPartnerClick = () => {
    setShowPartnerPopup(true);
  };

  const handleClosePopup = () => {
    setShowPartnerPopup(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 text-sm">Error loading partner: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      {partner ? (
        // Display partner relationship
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-2xl">
            <span className="font-medium text-gray-800">
              {user?.name || 'You'}
            </span>
            <span className="text-pink-500">❤️</span>
            <span className="text-purple-500 text-3xl">∞</span>
            <span className="text-pink-500">❤️</span>
            <span className="font-medium text-gray-800">
              {partner.name}
            </span>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            {user?.profileImageUrl && (
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-pink-200"
              />
            )}
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">∞</span>
            </div>
            {partner.profileImageUrl && (
              <img
                src={partner.profileImageUrl}
                alt={partner.name}
                className="w-12 h-12 rounded-full border-2 border-purple-200"
              />
            )}
          </div>
          
          <p className="text-gray-600 text-sm">
            Connected as partners
          </p>
          
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">
              You can now chat, share memories, and create wishes together!
            </p>
          </div>
        </div>
      ) : (
        // Display add partner option
        <div className="space-y-4">
          <div className="text-gray-400 text-6xl mb-4">
            💕
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Find Your Partner
          </h3>
          
          <p className="text-gray-600 text-sm mb-6">
            Connect with someone special to share your journey together.
            Once partnered, you'll have exclusive access to chat, memories, and more!
          </p>
          
          <button
            onClick={handleAddPartnerClick}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>✨</span>
              <span>Add Partner</span>
            </span>
          </button>
          
          <p className="text-xs text-gray-400 mt-4">
            Send a partner request to connect with someone special
          </p>
        </div>
      )}
      
      {/* Partner Popup Modal */}
      {showPartnerPopup && (
        <PartnerPopup 
          isOpen={showPartnerPopup}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default PartnerDisplay; 