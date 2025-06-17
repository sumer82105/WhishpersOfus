import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ChatBox from '../components/ChatBox';
import MessageInput from '../components/MessageInput';
import ChatHeader from '../components/ChatHeader';
import { useAppSelector } from '../store/hooks';
import { chatService } from '../services/chatService';
import { ChatMessage } from '../services/api.types';
import toast from 'react-hot-toast';

// Dynamic import interface for WebSocket functions
interface WebSocketMessage {
  id?: string;
  senderId: string;
  senderName?: string;
  receiverId?: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'VOICE' | 'EMOJI' | 'SYSTEM';
  timestamp?: string;
  chatRoomId?: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'TYPING' | 'STOP_TYPING';
}

const Chats: React.FC = () => {
  const { user, firebaseUser } = useAppSelector((state) => state.auth);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [socketService, setSocketService] = useState<any>(null);

  // Dynamically load socket service
  useEffect(() => {
    const loadSocketService = async () => {
      try {
        const socketModule = await import('../services/socketService');
        setSocketService(socketModule);
      } catch (error) {
        console.error("Failed to load socket service:", error);
      }
    };

    if (user && firebaseUser) {
      loadSocketService();
    }
  }, [user, firebaseUser]);

  // Fetch initial messages and setup WebSocket when component mounts
  useEffect(() => {
    if (user && firebaseUser && socketService) {
      fetchMessages(0, true);
      fetchUnreadCount();
      setupWebSocket();
    }

    // Cleanup on unmount
    return () => {
      if (socketService) {
        socketService.disconnectSocket();
      }
    };
  }, [user, firebaseUser, socketService]);

  const setupWebSocket = async () => {
    if (!firebaseUser || !user || !socketService) return;

    try {
      const token = await firebaseUser.getIdToken();
      
      await socketService.connectSocket(firebaseUser.uid, token, {
        onConnect: () => {
          console.log("Connected to WebSocket");
          setConnected(true);
          toast.success("Connected to real-time chat! 💕");
        },
        onDisconnect: () => {
          console.log("Disconnected from WebSocket");
          setConnected(false);
          toast.error("Disconnected from chat");
        },
        onError: (error: any) => {
          console.error("WebSocket error:", error);
          setConnected(false);
          toast.error("Chat connection error");
        },
        onMessage: (message: WebSocketMessage) => {
          handleWebSocketMessage(message);
        }
      });
    } catch (error) {
      console.error("Failed to setup WebSocket:", error);
      toast.error("Failed to connect to real-time chat");
    }
  };

  const handleWebSocketMessage = (wsMessage: WebSocketMessage) => {
    console.log("Handling WebSocket message:", wsMessage);
    
    switch (wsMessage.type) {
      case 'CHAT':
        // Convert WebSocket message to ChatMessage format
        const chatMessage: ChatMessage = {
          id: wsMessage.id || '',
          senderId: wsMessage.senderId,
          receiverId: wsMessage.receiverId || '',
          content: wsMessage.content,
          messageType: wsMessage.messageType,
          isRead: false,
          createdAt: wsMessage.timestamp || new Date().toISOString(),
          updatedAt: wsMessage.timestamp || new Date().toISOString()
        };
        
        // Only add if it's not already in the list (avoid duplicates)
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === chatMessage.id);
          if (!exists && chatMessage.id) {
            return [...prev, chatMessage];
          }
          return prev;
        });
        break;
        
      case 'JOIN':
        toast.success(`${wsMessage.senderName || 'Someone'} joined the chat! 💕`);
        break;
        
      case 'LEAVE':
        toast.error(`${wsMessage.senderName || 'Someone'} left the chat`);
        break;
        
      case 'TYPING':
        // Now wsMessage.senderId contains database user ID, compare with user?.id
        if (wsMessage.senderId !== user?.id) {
          setTypingUsers(prev => new Set([...prev, wsMessage.senderId]));
        }
        break;
        
      case 'STOP_TYPING':
        // Now wsMessage.senderId contains database user ID, compare with user?.id
        if (wsMessage.senderId !== user?.id) {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(wsMessage.senderId);
            return newSet;
          });
        }
        break;
    }
  };

  const fetchMessages = async (currentPage: number = 0, isInitial: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const result = await chatService.getMessages(undefined, currentPage, 20);
      
      if (isInitial) {
        // Reverse the messages since they come newest first from backend
        setMessages(result.content.reverse());
      } else {
        // Prepend older messages
        setMessages(prev => [...result.content.reverse(), ...prev]);
      }
      
      setHasMore(result.hasMore);
      setPage(currentPage);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await chatService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || !firebaseUser || !user) return;

    // Send via WebSocket for real-time delivery
    if (connected && socketService && socketService.isConnected()) {
      const wsMessage: WebSocketMessage = {
        senderId: firebaseUser.uid,
        content: content.trim(),
        messageType: 'TEXT',
        type: 'CHAT'
      };
      
      const sent = socketService.sendMessage(wsMessage);
      if (sent) {
        console.log("Message sent via WebSocket");
        return;
      }
    }

    // Fallback to REST API if WebSocket is not available
    try {
      const newMessage = await chatService.sendMessage({
        content: content.trim(),
        messageType: 'TEXT'
      });
      
      // Add the new message to the list
      setMessages(prev => [...prev, newMessage]);
      toast.success('Message sent! 💌');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleTyping = () => {
    if (!firebaseUser || !connected || !socketService) return;
    
    socketService.sendTypingIndicator(firebaseUser.uid);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendStopTypingIndicator(firebaseUser.uid);
    }, 3000);
  };

  const handleStopTyping = () => {
    if (!firebaseUser || !connected || !socketService) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    socketService.sendStopTypingIndicator(firebaseUser.uid);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchMessages(page + 1, false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await chatService.markMessagesAsRead();
      setUnreadCount(0);
      // Update local messages to mark them as read
      setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  // Mark messages as read when component is visible
  useEffect(() => {
    if (messages.length > 0 && unreadCount > 0) {
      const timer = setTimeout(() => {
        markMessagesAsRead();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length, unreadCount]);

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

  // Show loading state while socket service is loading
  if (!socketService && user && firebaseUser) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <motion.div variants={itemVariants}>
        <ChatHeader 
          partnerName="My Love" 
          unreadCount={unreadCount}
          isConnected={connected}
        />
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Load More Button */}
        {hasMore && (
          <div className="p-2 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="text-pink-500 hover:text-pink-600 text-sm disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load older messages'}
            </button>
          </div>
        )}
        
        <ChatBox 
          messages={messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            timestamp: msg.createdAt
          }))}
          currentUserId={user?.id || ''}
          typingUsers={Array.from(typingUsers)}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <MessageInput 
          onSend={handleSend}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          disabled={!connected && !user}
        />
      </motion.div>
      
      {/* Connection Status */}
      <div className="px-4 py-2 bg-gray-50 text-xs text-center">
        {connected ? (
          <span className="text-green-600">🟢 Connected to real-time chat</span>
        ) : (
          <span className="text-orange-600">🟡 Using offline mode</span>
        )}
      </div>
    </motion.div>
  );
};

export default Chats;
