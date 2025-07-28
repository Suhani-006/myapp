import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Placeholder imports for new components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import HomeFeed from './components/HomeFeed';
import Explore from './components/Explore';
import Categories from './components/Categories';
import Saved from './components/Saved';
import Liked from './components/Liked';
import Login from './components/Login';
import { DarkModeProvider } from './components/DarkModeContext';
import { SearchProvider } from './components/SearchContext';
import FeedContainer from './components/FeedContainer';
import BottomNav from './components/BottomNav';

function App() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 767);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 1199 && window.innerWidth > 767);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setSidebarOpen(false);
        setSidebarCollapsed(false);
      } else if (window.innerWidth <= 1199) {
        setSidebarOpen(true);
        setSidebarCollapsed(true);
      } else {
        setSidebarOpen(true);
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sidebar toggle for mobile
  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <DarkModeProvider>
      <SearchProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--card-bg, #fff)',
              color: 'var(--text, #181a1b)',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
              fontWeight: 500,
              fontSize: '1rem',
              padding: '1rem 1.5rem',
              border: '1px solid #eee',
            },
            duration: 3500,
            success: { iconTheme: { primary: '#a259ff', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <div className="App-layout">
              <Navbar onSidebarToggle={handleSidebarToggle} isSidebarOpen={sidebarOpen} />
              <div className="App-main">
                {/* Sidebar only for desktop/tablet */}
                {window.innerWidth > 767 && (
                  <Sidebar open={sidebarOpen} collapsed={sidebarCollapsed} onClose={handleSidebarClose} />
                )}
                <FeedContainer>
                  <Routes>
                    <Route path="/home" element={<HomeFeed />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/saved" element={<Saved />} />
                    <Route path="/liked" element={<Liked />} />
                    {/* Add Profile route */}
                    <Route path="/profile" element={<div>Profile Page</div>} />
                    <Route path="*" element={<Navigate to="/home" />} />
                  </Routes>
                </FeedContainer>
                {/* BottomNav always visible on mobile/tablet */}
                <BottomNav />
              </div>
            </div>
          } />
        </Routes>
      </SearchProvider>
    </DarkModeProvider>
  );
}

export default App;
