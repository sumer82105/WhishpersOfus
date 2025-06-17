import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon,
  HeartIcon,
  ClockIcon,
  GiftIcon,
  PhotoIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Love Notes', href: '/love-notes', icon: HeartIcon },
    { name: 'Memory Lane', href: '/memory-lane', icon: ClockIcon },
    { name: 'Surprise Box', href: '/surprise-box', icon: GiftIcon },
    { name: 'Photo Moments', href: '/photo-moments', icon: PhotoIcon },
    { name: 'Wish Room', href: '/wish-room', icon: SparklesIcon },
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-md border-r border-romantic-200/50 pt-16">
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-romantic-500 text-white shadow-lg romantic-glow'
                      : 'text-gray-700 hover:bg-romantic-100/50 hover:text-romantic-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`mr-3 h-5 w-5 transition-all duration-300 ${
                        isActive 
                          ? 'text-white animate-heartbeat' 
                          : 'text-gray-500 group-hover:text-romantic-500'
                      }`}
                    />
                    {item.name}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="ml-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        💖
                      </motion.div>
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Bottom decoration */}
        <div className="p-4 border-t border-romantic-200/50">
          <motion.div
            className="text-center text-romantic-400 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Made with 💖 for our anniversary
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 