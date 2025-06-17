import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchPendingRequests, 
  respondToPartnerRequest, 
  fetchPartner,
  clearError 
} from '../store/slices/partnerSlice';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * PartnerRequests component
 * Displays pending partner requests and allows user to accept or reject them
 * Automatically refreshes partner status when requests are accepted
 */
const PartnerRequests: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    partnerRequests, 
    loading, 
    error, 
    partner 
  } = useAppSelector((state) => state.partner);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Fetch pending requests when component mounts
    if (user && !partner) {
      dispatch(fetchPendingRequests());
    }
  }, [dispatch, user, partner]);

  const handleAccept = async (requestId: string) => {
    try {
      await dispatch(respondToPartnerRequest({ requestId, accepted: true })).unwrap();
      // Refresh partner status after accepting
      dispatch(fetchPartner());
      // Refresh pending requests
      dispatch(fetchPendingRequests());
    } catch (err) {
      console.error('Failed to accept partner request:', err);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await dispatch(respondToPartnerRequest({ requestId, accepted: false })).unwrap();
      // Refresh pending requests after rejecting
      dispatch(fetchPendingRequests());
    } catch (err) {
      console.error('Failed to reject partner request:', err);
    }
  };

  const handleDismissError = () => {
    dispatch(clearError());
  };

  // Don't show the component if user already has a partner
  if (partner) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center py-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Don't show anything if there are no pending requests
  if (partnerRequests.pending.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <span>💌</span>
          <span>Partner Requests</span>
        </h3>
        <span className="bg-pink-100 text-pink-600 text-xs font-medium px-2 py-1 rounded-full">
          {partnerRequests.pending.length}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={handleDismissError}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {partnerRequests.pending.map((request) => (
          <PartnerRequestCard
            key={request.id}
            request={request}
            onAccept={() => handleAccept(request.id)}
            onReject={() => handleReject(request.id)}
            isLoading={loading}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Partner requests create exclusive connections for sharing your journey together
        </p>
      </div>
    </div>
  );
};

/**
 * Individual partner request card component
 */
interface PartnerRequestCardProps {
  request: any; // PartnerRequest type
  onAccept: () => void;
  onReject: () => void;
  isLoading: boolean;
}

const PartnerRequestCard: React.FC<PartnerRequestCardProps> = ({
  request,
  onAccept,
  onReject,
  isLoading
}) => {
  const { user } = useAppSelector((state) => state.auth);
  
  // For now, we'll show the sender ID since we don't have sender details
  // In a real app, you'd fetch sender user details
  const senderName = `User ${request.senderId.substring(0, 8)}...`;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
            {senderName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800">{senderName}</p>
            <p className="text-sm text-gray-500">
              Sent {formatDate(request.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onReject}
            disabled={isLoading}
            className="px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '...' : 'Decline'}
          </button>
          <button
            onClick={onAccept}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '...' : 'Accept'}
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          💕 Wants to be your partner and share exclusive moments together
        </p>
      </div>
    </div>
  );
};

export default PartnerRequests; 