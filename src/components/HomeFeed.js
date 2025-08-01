import React, { useState, useEffect, useRef, useCallback } from 'react';
import photosData from '../data/photos.json';
import './HomeFeed.css';
// Add Firestore imports
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

// Utility to shuffle an array (Fisher-Yates)
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [processingMap, setProcessingMap] = useState({}); // Track which posts are being processed
  const observer = useRef();

  // Get selected categories from localStorage
  const getSelectedCategories = () => {
    try {
      const cats = JSON.parse(localStorage.getItem('selectedCategories'));
      return Array.isArray(cats) && cats.length > 0 ? cats : null;
    } catch {
      return null;
    }
  };

  const filterPhotos = (data) => {
    const selected = getSelectedCategories();
    if (!selected) return data;
    // Normalize for case-insensitive match
    return data.filter(photo =>
      selected.some(
        cat =>
          (photo.category || '').toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim() ===
          cat.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim()
      )
    );
  };

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
      const filtered = filterPhotos(photosData);
      const shuffled = shuffleArray(filtered); // Shuffle for random order
      const newPosts = shuffled.map(photo => ({
        ...photo,
        id: photo.id ? photo.id + (page - 1) * shuffled.length : photo.image_url,
        title: photo.title ? `${photo.title} (Page ${page})` : undefined
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
    const filtered = filterPhotos(photosData);
    const shuffled = shuffleArray(filtered); // Shuffle for random order
    setPosts(shuffled);
  }, []);

  // Fetch liked/saved state for current user
  useEffect(() => {
    const fetchStates = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const liked = {};
      const saved = {};
      // Check all posts in the feed for liked/saved state
      for (let i = 0; i < posts.length; i++) {
        const p = posts[i];
        if (!p?.id) continue;
        const likeRef = doc(db, "users", user.uid, "likedFeeds", p.id.toString());
        const saveRef = doc(db, "users", user.uid, "savedFeeds", p.id.toString());
        const [likeSnap, saveSnap] = await Promise.all([getDoc(likeRef), getDoc(saveRef)]);
        liked[p.id] = likeSnap.exists();
        saved[p.id] = saveSnap.exists();
      }
      setLikedMap(liked);
      setSavedMap(saved);
    };
    if (auth.currentUser && posts.length > 0) fetchStates();
  }, [posts]);

  // Like handler with auto-skip
  const handleLike = async (post) => {
    const user = auth.currentUser;
    if (!user || !post?.id) return;
    const isLiked = likedMap[post.id];
    
    // Set processing state
    setProcessingMap(prev => ({ ...prev, [post.id]: true }));
    
    // Optimistically update UI
    setLikedMap(prev => ({ ...prev, [post.id]: !isLiked }));
    
    try {
      if (!isLiked) {
        await setDoc(doc(db, "users", user.uid, "likedFeeds", post.id.toString()), post);
        // Auto-skip to next post after successful like
        setTimeout(() => {
          handleSkip(post);
        }, 500); // Small delay to show the like animation
      } else {
        await deleteDoc(doc(db, "users", user.uid, "likedFeeds", post.id.toString()));
      }
    } catch (e) {
      // Revert on error
      setLikedMap(prev => ({ ...prev, [post.id]: isLiked }));
      console.error('Error updating like:', e);
    } finally {
      // Clear processing state
      setProcessingMap(prev => ({ ...prev, [post.id]: false }));
    }
  };

  // Save handler with auto-skip
  const handleSave = async (post) => {
    const user = auth.currentUser;
    if (!user || !post?.id) return;
    const isSaved = savedMap[post.id];
    
    // Set processing state
    setProcessingMap(prev => ({ ...prev, [post.id]: true }));
    
    // Optimistically update UI
    setSavedMap(prev => ({ ...prev, [post.id]: !isSaved }));
    
    try {
      if (!isSaved) {
        await setDoc(doc(db, "users", user.uid, "savedFeeds", post.id.toString()), post);
        // Auto-skip to next post after successful save
        setTimeout(() => {
          handleSkip(post);
        }, 500); // Small delay to show the save animation
      } else {
        await deleteDoc(doc(db, "users", user.uid, "savedFeeds", post.id.toString()));
      }
    } catch (e) {
      // Revert on error
      setSavedMap(prev => ({ ...prev, [post.id]: isSaved }));
      console.error('Error updating save:', e);
    } finally {
      // Clear processing state
      setProcessingMap(prev => ({ ...prev, [post.id]: false }));
    }
  };

  // Skip handler: remove post from feed
  const handleSkip = (post) => {
    setPosts(prev => prev.filter(p => p.id !== post.id));
  };

  return (
    <div className="HomeFeed" style={{ paddingBottom: '60px', paddingTop: '56px' }}>
      <div className="HomeFeed-container">
        {posts.map((post, index) => (
          <div
            key={post.id || post.image_url}
            className="HomeFeed-card"
            ref={index === posts.length - 1 ? lastPostRef : null}
          >
            <div className="HomeFeed-image-container">
              <img
                src={post.image_url}
                alt={post.title || post.image_url}
                className="HomeFeed-image"
                loading="lazy"
              />
            </div>
            <div className="HomeFeed-content">
              <h3 className="HomeFeed-title">{post.title || 'No Title'}</h3>
              <div className="HomeFeed-tags">
                <span className="HomeFeed-tag">{post.category || 'No Category'}</span>
              </div>
              {/* --- Like/Save/Skip Buttons --- */}
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button
                  className={`HomeFeed-action-btn${likedMap[post.id] ? ' liked' : ''}`}
                  aria-label="Like"
                  onClick={() => handleLike(post)}
                  disabled={processingMap[post.id]}
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: processingMap[post.id] ? 'not-allowed' : 'pointer',
                    padding: 0,
                    opacity: processingMap[post.id] ? 0.6 : 1,
                  }}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: likedMap[post.id] ? 'rgba(224,36,94,0.18)' : 'rgba(255,255,255,0.72)',
                    boxShadow: likedMap[post.id] ? '0 2px 8px #e0245e22' : '0 2px 8px #a259ff22',
                    transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
                    transform: processingMap[post.id] ? 'scale(0.95)' : 'scale(1)',
                  }}>
                    {processingMap[post.id] ? (
                      <div style={{
                        width: 16,
                        height: 16,
                        border: '2px solid transparent',
                        borderTop: '2px solid #e0245e',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    ) : (
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                        <path
                          d="M12 21s-7.5-6.2-7.5-11.2A5.5 5.5 0 0 1 12 5.5a5.5 5.5 0 0 1 7.5 4.3C19.5 14.8 12 21 12 21z"
                          stroke={likedMap[post.id] ? "#e0245e" : "#888"}
                          strokeWidth="2"
                          fill={likedMap[post.id] ? "#e0245e" : "none"}
                        />
                      </svg>
                    )}
                  </span>
                </button>
                <button
                  className={`HomeFeed-action-btn${savedMap[post.id] ? ' saved' : ''}`}
                  aria-label="Save"
                  onClick={() => handleSave(post)}
                  disabled={processingMap[post.id]}
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: processingMap[post.id] ? 'not-allowed' : 'pointer',
                    padding: 0,
                    opacity: processingMap[post.id] ? 0.6 : 1,
                  }}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: savedMap[post.id] ? 'rgba(162,89,255,0.18)' : 'rgba(255,255,255,0.72)',
                    boxShadow: savedMap[post.id] ? '0 2px 8px #a259ff33' : '0 2px 8px #a259ff22',
                    transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
                    transform: processingMap[post.id] ? 'scale(0.95)' : 'scale(1)',
                  }}>
                    {processingMap[post.id] ? (
                      <div style={{
                        width: 16,
                        height: 16,
                        border: '2px solid transparent',
                        borderTop: '2px solid #a259ff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    ) : (
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                        <path
                          d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-7-5-7 5V4z"
                          stroke={savedMap[post.id] ? "#a259ff" : "#888"}
                          strokeWidth="2"
                          fill={savedMap[post.id] ? "#a259ff" : "none"}
                        />
                      </svg>
                    )}
                  </span>
                </button>
                <button
                  className="HomeFeed-action-btn"
                  aria-label="Skip"
                  onClick={() => handleSkip(post)}
                  disabled={processingMap[post.id]}
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: processingMap[post.id] ? 'not-allowed' : 'pointer',
                    padding: 0,
                    opacity: processingMap[post.id] ? 0.6 : 1,
                  }}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.72)',
                    boxShadow: '0 2px 8px #a259ff22',
                    transition: 'transform 0.2s',
                    transform: processingMap[post.id] ? 'scale(0.95)' : 'scale(1)',
                  }}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="#888"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </span>
                </button>
              </div>
              {/* --- End Buttons --- */}
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