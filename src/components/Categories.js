import React, { useState } from 'react';
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

const Categories = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const handleSelect = (cat) => {
    setSelected((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const handleApply = () => {
    // Save selected categories to localStorage for HomeFeed to use
    localStorage.setItem('selectedCategories', JSON.stringify(selected));
    navigate('/home');
  };

  return (
    <div style={{ padding: '2rem 0' }}>
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
    </div>
  );
};

export default Categories;