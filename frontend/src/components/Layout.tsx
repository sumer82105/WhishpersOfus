import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  HomeIcon,
  HeartIcon,
  BookOpenIcon,
  SparklesIcon,
  PhotoIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useAppSelector } from '../store/hooks';

const Layout: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.app);

  const navItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/love-notes', icon: HeartIcon, label: 'Love Notes', badge: unreadCount },
    { path: '/memories', icon: BookOpenIcon, label: 'Memories' },
    { path: '/wishes', icon: SparklesIcon, label: 'Wishes' },
    { path: '/photos', icon: PhotoIcon, label: 'Photos' },
  ];

  return (
    <div className="min-h-screen bg-pink-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex items-center">
                <span className="text-2xl font-great-vibes text-pink-600">
                  Whispers of Us
                </span>
              </Link>
            </div>

            <div className="flex items-center">
              {user && (
                <div className="flex items-center gap-6">
                  {navItems.map(({ path, icon: Icon, label, badge }) => (
                    <NavLink
                      key={path}
                      to={path}
                      className={({ isActive }) =>
                        `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                          isActive
                            ? 'text-pink-600 bg-pink-50'
                            : 'text-gray-500 hover:text-pink-600 hover:bg-pink-50'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                      {badge && badge > 0 && (
                        <span className="ml-1 px-2 py-0.5 text-xs bg-pink-100 text-pink-600 rounded-full">
                          {badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'text-pink-600 bg-pink-50'
                          : 'text-gray-500 hover:text-pink-600 hover:bg-pink-50'
                      }`
                    }
                  >
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="w-8 h-8" />
                    )}
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 text-center text-gray-500">
          <p className="text-sm">
            Made with ❤️ for our first anniversary
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 