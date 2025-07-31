import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearch } from './SearchContext';
import photosData from '../data/photos.json';
import './ExploreFeed.css';
import PhotoModal from './PhotoModal';

const BATCH_SIZE = 18;

const Explore = () => {
  const { searchQuery, setSearchQuery, searchResults, setSearchResults } = useSearch();
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [displayedPhotos, setDisplayedPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Infinite scroll: attach to last photo
  const lastPhotoRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePhotos();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, filteredPhotos, displayedPhotos]);

  // Filter photos by search
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    let results;
    if (trimmedQuery) {
      results = photosData.filter(photo =>
        (photo.title && photo.title.toLowerCase().includes(trimmedQuery.toLowerCase())) ||
        (photo.category && photo.category.toLowerCase().includes(trimmedQuery.toLowerCase()))
      );
      setSearchResults(results);
    } else {
      results = photosData;
      setSearchResults([]);
    }
    setFilteredPhotos(results);
    setDisplayedPhotos(results.slice(0, BATCH_SIZE));
    setPage(1);
    setHasMore(results.length > BATCH_SIZE);
  }, [searchQuery, setSearchResults]);

  // Load more photos (infinite scroll)
  const loadMorePhotos = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setDisplayedPhotos(prev => {
        const next = filteredPhotos.slice(prev.length, prev.length + BATCH_SIZE);
        if (next.length === 0) setHasMore(false);
        return [...prev, ...next];
      });
      setPage(prev => prev + 1);
      setLoading(false);
    }, 800);
  }, [filteredPhotos]);

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  return (
    <div className="ExploreFeed-root">
      <h2 className="ExploreFeed-title">Explore</h2>
      <div className="ExploreFeed-grid">
        {displayedPhotos.map((photo, idx) => (
          <div
            key={photo.id || photo.image_url}
            className="ExploreFeed-card"
            onClick={() => setSelectedPhotoIndex(idx)}
            ref={idx === displayedPhotos.length - 1 && hasMore ? lastPhotoRef : null}
          >
            <div className="ExploreFeed-imgwrap">
              <img
                src={photo.image_url}
                alt={photo.title || photo.image_url}
                className="ExploreFeed-img"
              />
            </div>
            <div className="ExploreFeed-card-content">
              <h3 className="ExploreFeed-card-title">{photo.title || 'No Title'}</h3>
              <span className="ExploreFeed-card-tag">{photo.category || 'No Category'}</span>
            </div>
          </div>
        ))}
      </div>

      {displayedPhotos.length === 0 && searchQuery && (
        <div className="ExploreFeed-empty">
          <p>No results found for "{searchQuery}"</p>
          <p>Try searching for different keywords</p>
        </div>
      )}

      {loading && (
        <div className="HomeFeed-loading">
          <div className="HomeFeed-spinner"></div>
          <p>Loading more posts...</p>
        </div>
      )}

      {selectedPhotoIndex !== null && (
        <PhotoModal
          photos={displayedPhotos}
          currentIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </div>
  );
};

export default Explore;


