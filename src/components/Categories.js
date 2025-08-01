import React, { useState, useEffect } from 'react';
import './Categories.css';
import { useNavigate } from 'react-router-dom';

const CATEGORY_LIST = [
  'Gaming',
  'Fashion',
  'Health & Fitness',
  'Business',
  'Technology',
  'Sports',
  'Lifestyle',
  'Education',
];

const Categories = ({ asModal = false, onClose }) => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Pre-fill with previously selected categories if any
    const prev = JSON.parse(localStorage.getItem('selectedCategories') || '[]');
    if (Array.isArray(prev)) setSelected(prev);
  }, []);

  const handleSelect = (cat) => {
    setSelected((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const handleApply = () => {
    localStorage.setItem('selectedCategories', JSON.stringify(selected));
    if (asModal && onClose) {
      onClose(); // Settings will handle navigation to /home
    } else {
      navigate('/home');
    }
  };

  return (
    <div
      className="categories-modal-bg"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: asModal ? '100vh' : undefined,
        position: asModal ? 'fixed' : 'static',
        top: 0, left: 0, right: 0, bottom: 0,
        background: asModal ? 'rgba(0,0,0,0.25)' : 'none',
        zIndex: asModal ? 2000 : 'auto'
      }}
    >
      <div
        className="categories-modal-box"
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)',
          maxWidth: 400,
          width: '90vw',
          padding: '2.5rem 2rem 1.5rem 2rem',
          margin: asModal ? '0' : '2rem auto',
          position: 'relative'
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
          Categories
        </h2>
        <div className="categories-container scrollbar-hide">
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-btn${selected.includes(cat) ? ' active' : ''}`}
              onClick={() => handleSelect(cat)}
              aria-pressed={selected.includes(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          className="apply-btn"
          style={{ marginTop: 24 }}
          disabled={selected.length === 0}
          onClick={handleApply}
        >
          Apply
        </button>
        {asModal && (
          <button
            style={{
              position: 'absolute',
              top: 12,
              right: 18,
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer'
            }}
            aria-label="Close"
            onClick={onClose}
          >×</button>
        )}
      </div>
    </div>
  );
};

export default Categories;