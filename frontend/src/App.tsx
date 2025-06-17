import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Layout from './components/Layout';
import { FloatingHearts } from './components/FloatingHearts';
import { LoadingSpinner } from './components/LoadingSpinner';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LoveNotes from './pages/LoveNotes';
import Memories from './pages/Memories';
import Wishes from './pages/Wishes';
import PhotoMoments from './pages/PhotoMoments';
import Profile from './pages/Profile';
import SurpriseBox from './pages/SurpriseBox';
import Chats from './pages/Chats';

// // Create a simple SurpriseBox component for now
// const SurpriseBox: React.FC = () => (
//   <div className="max-w-4xl mx-auto text-center p-8">
//     <h1 className="text-4xl font-playfair text-pink-600 mb-4">🎁 Surprise Box</h1>
//     <p className="text-lg text-gray-600 mb-8">
//       Special surprises and gifts are being prepared! Coming soon... ✨
//     </p>
//     <div className="bg-white p-8 rounded-lg shadow-lg">
//       <div className="text-6xl mb-4">🎁</div>
//       <p className="text-gray-500">This feature is under development</p>
//     </div>
//   </div>
// );

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-pink-50">
      <FloatingHearts />
      
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="love-notes" element={<LoveNotes />} />
          <Route path="memory-lane" element={<Memories />} />
          <Route path="wish-room" element={<Wishes />} />
          <Route path="photo-moments" element={<PhotoMoments />} />
          <Route path="surprise-box" element={<SurpriseBox />}/>
          <Route path="chat" element={<Chats />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default App; 