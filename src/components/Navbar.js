import React, { useRef, useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { showNotAvailableToast } from './showNotAvailableToast';
import { useSearch } from './SearchContext';

const Navbar = ({ onSidebarToggle, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { dark, toggleDark } = useDarkMode();
  const { searchQuery, setSearchQuery } = useSearch();

  // Search bar state
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Focus input when search bar opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Collapse search on Esc
  useEffect(() => {
    if (!searchOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  // Responsive width for search input
  const getSearchWidth = () => {
    if (window.innerWidth <= 600) return '90vw';
    if (window.innerWidth <= 900) return '14rem';
    return '20rem';
  };

  return (
    <nav className="Navbar" role="navigation" aria-label="Top Navigation">
      <div className="Navbar-left">
        <div
          className="Navbar-logo-container"
          onClick={() => navigate('/home')}
          title="Go to Home"
        >
          <div className="Navbar-logo-flex">
            <div className="Navbar-logo-bg">
              {/* Play icon SVG */}
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="11" fill="#fff" />
                <polygon points="9,7 16,11 9,15" fill="#a259ff" />
              </svg>
            </div>
            <span className="Navbar-logo-text Navbar-logo-brand">Infiscroll</span>
          </div>
        </div>
      </div>
      <div className="Navbar-center">
        {/* No search bar here */}
      </div>
      <div className="Navbar-right">
        {/* Search Icon / Input */}
        <div className="Navbar-searchbar-container">
          {!searchOpen && (
            <button
              className="Navbar-icon Navbar-search-toggle"
              aria-label="Open search"
              onClick={() => {
                setSearchOpen(true);
                navigate('/explore');
              }}
              style={{ transition: 'opacity 0.2s', opacity: searchOpen ? 0 : 1 }}
            >
              <span role="img" aria-label="Search">🔎</span>
            </button>
          )}
          <input
            ref={searchInputRef}
            className={`Navbar-searchbar${searchOpen ? ' open' : ''}`}
            type="text"
            placeholder="Search…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: searchOpen ? getSearchWidth() : 0,
              opacity: searchOpen ? 1 : 0,
              pointerEvents: searchOpen ? 'auto' : 'none',
              transition: 'all 0.3s cubic-bezier(.4,1,.4,1)',
            }}
            onBlur={() => setSearchOpen(false)}
            tabIndex={searchOpen ? 0 : -1}
            aria-label="Search"
          />
        </div>
        {/* Upload button only on desktop */}
        <button
          className="Navbar-icon Navbar-upload-desktop"
          aria-label="Upload"
          onClick={showNotAvailableToast}
        >
          <span role="img" aria-label="Upload">⬆️</span>
        </button>
        <button
          className="Navbar-icon"
          aria-label="Notifications"
          onClick={showNotAvailableToast}
        >
          <span role="img" aria-label="Notifications">🔔</span>
        </button>
        {window.innerWidth <= 767 && (
          <button
            className="Navbar-icon"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleDark}
          >
            <span role="img" aria-label="Theme">{dark ? '🌞' : '🌙'}</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;