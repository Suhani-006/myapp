import React, { useState, useEffect, useRef, useCallback } from 'react';
import photosData from '../data/photos.json';
import './HomeFeed.css';

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const lastPostRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Simulate loading more posts
  const loadMorePosts = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const newPosts = photosData.map(photo => ({
        ...photo,
        id: photo.id + (page - 1) * photosData.length,
        title: `${photo.title} (Page ${page})`
      }));
      
      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
      setLoading(false);
      
      // Stop loading after 5 pages (for demo)
      if (page >= 5) {
        setHasMore(false);
      }
    }, 1000);
  }, [page]);

  // Initial load
  useEffect(() => {
    setPosts(photosData);
  }, []);

  return (
    <div className="HomeFeed" style={{ paddingBottom: '60px', paddingTop: '56px' }}>
      <div className="HomeFeed-container">
        {posts.map((post, index) => (
          <div 
            key={post.id} 
            className="HomeFeed-card"
            ref={index === posts.length - 1 ? lastPostRef : null}
          >
            <div className="HomeFeed-image-container">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="HomeFeed-image"
                loading="lazy"
              />
            </div>
            <div className="HomeFeed-content">
              <h3 className="HomeFeed-title">{post.title}</h3>
              <p className="HomeFeed-description">{post.description}</p>
              <div className="HomeFeed-tags">
                <span className="HomeFeed-tag">{post.tag}</span>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="HomeFeed-loading">
            <div className="HomeFeed-spinner"></div>
            <p>Loading more posts...</p>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="HomeFeed-end">
            <p>You've reached the end of the feed!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeFeed;