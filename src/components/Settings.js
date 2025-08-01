import React, { useState } from 'react';
import Categories from './Categories';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();

  // When categories are changed, close modal and go to home
  const handleCategoriesClose = () => {
    setShowCategories(false);
    navigate('/home');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
        Settings
      </h2>
      <button
        className="apply-btn"
        style={{ margin: '2rem auto', display: 'block' }}
        onClick={() => setShowCategories(true)}
      >
        Change Categories
      </button>
      {showCategories && (
        <Categories asModal onClose={handleCategoriesClose} />
      )}
    </div>
  );
};

export default Settings;
