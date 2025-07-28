import React from 'react';
import './MenuDrawer.css';
import { useNavigate } from 'react-router-dom';
import { showNotAvailableToast } from './showNotAvailableToast';

const menuActions = [
  { icon: '❤️', label: 'Liked', route: '/liked' },
  { icon: '📌', label: 'Saved', route: '/saved' },
  { icon: '🚪', label: 'Logout', route: '/login' },
];

const MenuDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleAction = (route, label) => {
    onClose();
    setTimeout(() => {
      if (label === 'Logout') {
        // You can add logout logic here if needed
        // For now, just navigate to login
        navigate(route);
      } else {
        navigate(route);
      }
    }, 180); // Wait for animation
  };

  return (
    <>
      <div
        className={`MenuDrawer-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
        tabIndex={-1}
      />
      <aside
        className={`MenuDrawer${open ? ' open' : ''}`}
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="More actions"
      >
        <div className="MenuDrawer-handle" />
        <nav className="MenuDrawer-actions">
          {menuActions.map(action => (
            <button
              key={action.label}
              className="MenuDrawer-action"
              onClick={() => handleAction(action.route, action.label)}
              aria-label={action.label}
              type="button"
            >
              <span className="MenuDrawer-action-icon">{action.icon}</span>
              <span className="MenuDrawer-action-label">{action.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default MenuDrawer;
