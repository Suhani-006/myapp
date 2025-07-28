import React, { useEffect, useState } from 'react';
import { useSearch } from './SearchContext';
import photosData from '../data/photos.json';
import './ExploreFeed.css';
import PhotoModal from './PhotoModal';





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


  const [selectedPhoto, setSelectedPhoto] = useState(null);

  

  
  return (
    <div className="ExploreFeed-root">
      <h2 className="ExploreFeed-title">Explore</h2>
      <div className="ExploreFeed-grid">
  {filteredPhotos.map(photo => (
    <div 
      key={photo.id} 
      className="ExploreFeed-card" 
      onClick={() => setSelectedPhoto(photo)} // ← this triggers the modal
    >
      <div className="ExploreFeed-imgwrap">
        <img 
          src={photo.image_url} 
          alt={photo.title}
          className="ExploreFeed-img"
        />
      </div>
      <div className="ExploreFeed-card-content">
        <h3 className="ExploreFeed-card-title">{photo.title}</h3>
        <span className="ExploreFeed-card-tag">{photo.tag}</span>
      </div>
    </div>
  ))}
</div>

      {filteredPhotos.length === 0 && searchQuery && (
        <div className="ExploreFeed-empty">
          <p>No results found for "{searchQuery}"</p>
          <p>Try searching for different keywords</p>
        </div>
      )}

      {selectedPhoto && (
  <PhotoModal
    photo={selectedPhoto}
    recommendedPhotos={photosData.filter(p => p.id !== selectedPhoto.id).slice(0, 9)}
    onClose={() => setSelectedPhoto(null)}
  />
)}
    </div>
  );
};

export default Explore;
