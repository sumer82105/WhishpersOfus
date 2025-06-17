import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HeartIcon,
  ClockIcon,
  GiftIcon,
  PhotoIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchLoveNotes, fetchMemories, fetchWishes, fetchPhotos, fetchSurprises } from '../store/slices/appSlice';
import PartnerDisplay from '../components/PartnerDisplay';
import PartnerRequests from '../components/PartnerRequests';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  emoji: string;
}

interface Stat {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Activity {
  action: string;
  time: string;
  emoji: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { notes, memories, photos, wishes, surprises, unreadCount } = useAppSelector((state) => state.app);

  // Fetch initial data when component mounts
  useEffect(() => {
    if (user) {
      dispatch(fetchLoveNotes());
      dispatch(fetchMemories());
      dispatch(fetchWishes());
      dispatch(fetchPhotos());
      dispatch(fetchSurprises());
    }
  }, [dispatch, user]);

  const quickActions: QuickAction[] = [
    {
      title: 'Write a Love Note',
      description: 'Share your feelings',
      icon: HeartIcon,
      href: '/love-notes',
      color: 'pink',
      emoji: '💕'
    },
    {
      title: 'Chat with Love',
      description: 'Send a message',
      icon: ChatBubbleLeftRightIcon,
      href: '/chat',
      color: 'rose',
      emoji: '💌'
    },
    {
      title: 'Add a Memory',
      description: 'Capture a special moment',
      icon: ClockIcon,
      href: '/memory-lane',
      color: 'purple',
      emoji: '📸'
    },
    {
      title: 'Make a Wish',
      description: 'Tell me what you want',
      icon: SparklesIcon,
      href: '/wish-room',
      color: 'yellow',
      emoji: '⭐'
    },
    {
      title: 'View Photos',
      description: 'Browse our moments',
      icon: PhotoIcon,
      href: '/photo-moments',
      color: 'blue',
      emoji: '📷'
    },
    {
      title: 'Surprise Box',
      description: 'Create magical surprises',
      icon: GiftIcon,
      href: '/surprise-box',
      color: 'indigo',
      emoji: '🎁'
    }
  ];

  const stats: Stat[] = [
    { 
      label: 'Love Notes', 
      value: Array.isArray(notes) ? notes.length : 0, 
      icon: HeartIcon, 
      color: 'text-pink-500' 
    },
    { 
      label: 'Memories', 
      value: Array.isArray(memories) ? memories.length : 0, 
      icon: ClockIcon, 
      color: 'text-purple-500' 
    },
    { 
      label: 'Photos', 
      value: Array.isArray(photos) ? photos.length : 0, 
      icon: PhotoIcon, 
      color: 'text-blue-500' 
    },
    { 
      label: 'Wishes', 
      value: Array.isArray(wishes) ? wishes.length : 0, 
      icon: GiftIcon, 
      color: 'text-yellow-500' 
    },
    { 
      label: 'Surprises', 
      value: Array.isArray(surprises) ? surprises.length : 0, 
      icon: SparklesIcon, 
      color: 'text-indigo-500' 
    },
  ];

  // Get recent activities from various sources
  const recentActivities: Activity[] = [
    ...(Array.isArray(notes) ? notes.slice(0, 2).map(note => ({
      action: 'Wrote a love note',
      time: new Date(note.createdAt).toLocaleDateString(),
      emoji: '💕'
    })) : []),
    ...(Array.isArray(memories) ? memories.slice(0, 2).map(memory => ({
      action: `Added memory: ${memory?.title}`,
      time: new Date(memory.createdAt).toLocaleDateString(),
      emoji: '📸'
    })) : []),
    ...(Array.isArray(wishes) ? wishes.slice(0, 2).map(wish => ({
      action: `Made a wish: ${wish.title}`,
      time: new Date(wish.createdAt).toLocaleDateString(),
      emoji: '⭐'
    })) : []),
    ...(Array.isArray(surprises) ? surprises.slice(0, 2).map(surprise => ({
      action: `Created surprise: ${surprise.title}`,
      time: new Date(surprise.createdAt).toLocaleDateString(),
      emoji: '🎁'
    })) : [])
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
   .slice(0, 3);

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-playfair text-pink-600 mb-4">
          Welcome back, {user?.name?.split(' ')[0] || 'my love'}! 💖
        </h1>
        <p className="text-lg text-gray-600">
          Ready to create more beautiful memories together?
        </p>
      </motion.div>
    
    <div className="space-y-6">
      <PartnerDisplay />
      <PartnerRequests />
    </div>

      {/* Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            className="bg-white p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
            <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-playfair text-gray-800 mb-6 text-center">
          What would you like to do today?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <motion.div
              key={action.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={action.href}
                className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full bg-${action.color}-100`}>
                    <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                  
                  <div className="text-2xl">
                    {action.emoji}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-playfair text-gray-800 mb-4 flex items-center">
          <ClockIcon className="h-5 w-5 text-pink-500 mr-2" />
          Recent Activity
        </h3>
        
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 bg-pink-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{activity.emoji}</span>
                <span className="text-gray-700">{activity.action}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Love Quote of the Day */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg shadow-lg text-center"
      >
        <h3 className="text-lg font-playfair text-gray-800 mb-4">
          💝 Love Quote of the Day
        </h3>
        <blockquote className="text-xl italic text-pink-700 mb-4">
          "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
        </blockquote>
        <cite className="text-sm text-gray-600">— Maya Angelou</cite>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard; 