import React, { useEffect, useState } from 'react';
import { useSearch } from './SearchContext';
import photosData from '../data/photos.json';

const Explore = () => {
  const { searchQuery, setSearchQuery, searchResults, setSearchResults } = useSearch();
  const [filteredPhotos, setFilteredPhotos] = useState([]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const results = photosData.filter(photo => 
        photo.title.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        photo.tag.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        photo.description.toLowerCase().includes(trimmedQuery.toLowerCase())
      );
      setFilteredPhotos(results);
      setSearchResults(results);
    } else {
      setFilteredPhotos(photosData);
      setSearchResults([]);
    }
  }, [searchQuery, setSearchResults]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Explore</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '1rem'
      }}>
        {filteredPhotos.map(photo => (
          <div key={photo.id} style={{
            border: '1px solid #eee',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}>
            <img 
              src={photo.image_url} 
              alt={photo.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
            />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                {photo.title}
              </h3>
              <span style={{
                background: '#a259ff',
                color: 'white',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                {photo.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
      {filteredPhotos.length === 0 && searchQuery && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>No results found for "{searchQuery}"</p>
          <p>Try searching for different keywords</p>
        </div>
      )}
    </div>
  );
};

export default Explore;