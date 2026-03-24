import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Channel from './pages/Channel';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Playlist from './pages/Playlist';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Upload from './pages/Upload';
import Explore from './pages/Explore';
import Subscriptions from './pages/Subscriptions';
import History from './pages/History';
import Liked from './pages/Liked';
import UserPlaylists from './pages/UserPlaylists';
import Movies from './pages/Movies';
import SettingsPage from './pages/SettingsPage';
import Help from './pages/Help';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background-base text-white font-sans flex flex-col">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/channel/:username" element={<Channel />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/studio" element={<Dashboard />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/upload" element={<Upload />} />
            {/* Sidebar routes */}
            <Route path="/explore" element={<Explore />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/history" element={<History />} />
            <Route path="/liked" element={<Liked />} />
            <Route path="/playlists" element={<UserPlaylists />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<Help />} />
            {/* Catch-all */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
