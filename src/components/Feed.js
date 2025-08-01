import React from 'react';
import './Feed.css';
import { useEffect, useState } from 'react';
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const placeholderPhotos = Array.from({ length: 20 }, (_, i) => ({
  id: `photo_${i}`,
  image_url: `https://picsum.photos/seed/${i}/400/600`,
  title: `Photo ${i + 1}`,
  category: 'Photography'
}));

const BATCH_SIZE = 16;

const Feed = () => {
  const [photos, setPhotos] = useState(placeholderPhotos.slice(0, BATCH_SIZE));
  const [loading, setLoading] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [processingMap, setProcessingMap] = useState({});

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300);
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        loadMore();
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [photos]);

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setPhotos((prev) => [
        ...prev,
        ...placeholderPhotos.slice(prev.length, prev.length + BATCH_SIZE),
      ]);
      setLoading(false);
    }, 800);
  };

  // Fetch liked/saved state for current user
  useEffect(() => {
    const fetchStates = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const liked = {};
      const saved = {};
      // Check all photos in the feed for liked/saved state
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
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
    if (auth.currentUser && photos.length > 0) fetchStates();
  }, [photos]);

  // Like handler with auto-skip
  const handleLike = async (photo) => {
    const user = auth.currentUser;
    if (!user || !photo?.id) return;
    const isLiked = likedMap[photo.id];
    
    // Set processing state
    setProcessingMap(prev => ({ ...prev, [photo.id]: true }));
    
    // Optimistically update UI
    setLikedMap(prev => ({ ...prev, [photo.id]: !isLiked }));
    
    try {
      if (!isLiked) {
        await setDoc(doc(db, "users", user.uid, "likedFeeds", photo.id.toString()), photo);
        // Auto-skip to next photo after successful like
        setTimeout(() => {
          handleSkip(photo);
        }, 500);
      } else {
        await deleteDoc(doc(db, "users", user.uid, "likedFeeds", photo.id.toString()));
      }
    } catch (e) {
      // Revert on error
      setLikedMap(prev => ({ ...prev, [photo.id]: isLiked }));
      console.error('Error updating like:', e);
    } finally {
      // Clear processing state
      setProcessingMap(prev => ({ ...prev, [photo.id]: false }));
    }
  };

  // Save handler with auto-skip
  const handleSave = async (photo) => {
    const user = auth.currentUser;
    if (!user || !photo?.id) return;
    const isSaved = savedMap[photo.id];
    
    // Set processing state
    setProcessingMap(prev => ({ ...prev, [photo.id]: true }));
    
    // Optimistically update UI
    setSavedMap(prev => ({ ...prev, [photo.id]: !isSaved }));
    
    try {
      if (!isSaved) {
        await setDoc(doc(db, "users", user.uid, "savedFeeds", photo.id.toString()), photo);
        // Auto-skip to next photo after successful save
        setTimeout(() => {
          handleSkip(photo);
        }, 500);
      } else {
        await deleteDoc(doc(db, "users", user.uid, "savedFeeds", photo.id.toString()));
      }
    } catch (e) {
      // Revert on error
      setSavedMap(prev => ({ ...prev, [photo.id]: isSaved }));
      console.error('Error updating save:', e);
    } finally {
      // Clear processing state
      setProcessingMap(prev => ({ ...prev, [photo.id]: false }));
    }
  };

  // Skip handler: remove photo from feed
  const handleSkip = (photo) => {
    setPhotos(prev => prev.filter(p => p.id !== photo.id));
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="Feed">
      <div className="Feed-grid">
        {photos.map((photo, idx) => (
          <div className="Feed-photo-card" key={photo.id || idx}>
            <img src={photo.image_url} alt={photo.title || `Photo ${idx + 1}`} loading="lazy" />
            {/* Action buttons overlay */}
            <div className="Feed-photo-actions">
              <button
                className={`Feed-action-btn${likedMap[photo.id] ? ' liked' : ''}`}
                aria-label="Like"
                onClick={() => handleLike(photo)}
                disabled={processingMap[photo.id]}
                type="button"
              >
                <span className="Feed-action-bg">
                  {processingMap[photo.id] ? (
                    <div className="Feed-spinner-small" />
                  ) : (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M12 21s-7.5-6.2-7.5-11.2A5.5 5.5 0 0 1 12 5.5a5.5 5.5 0 0 1 7.5 4.3C19.5 14.8 12 21 12 21z"
                        stroke={likedMap[photo.id] ? "#e0245e" : "#fff"}
                        strokeWidth="2"
                        fill={likedMap[photo.id] ? "#e0245e" : "none"}
                      />
                    </svg>
                  )}
                </span>
              </button>
              <button
                className={`Feed-action-btn${savedMap[photo.id] ? ' saved' : ''}`}
                aria-label="Save"
                onClick={() => handleSave(photo)}
                disabled={processingMap[photo.id]}
                type="button"
              >
                <span className="Feed-action-bg">
                  {processingMap[photo.id] ? (
                    <div className="Feed-spinner-small" />
                  ) : (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-7-5-7 5V4z"
                        stroke={savedMap[photo.id] ? "#a259ff" : "#fff"}
                        strokeWidth="2"
                        fill={savedMap[photo.id] ? "#a259ff" : "none"}
                      />
                    </svg>
                  )}
                </span>
              </button>
              <button
                className="Feed-action-btn"
                aria-label="Skip"
                onClick={() => handleSkip(photo)}
                disabled={processingMap[photo.id]}
                type="button"
              >
                <span className="Feed-action-bg">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="#fff"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="Feed-spinner" />}
      {showTop && (
        <button className="Feed-backtotop" onClick={handleBackToTop} aria-label="Back to Top">
          ⬆️
        </button>
      )}
    </main>
  );
};

export default Feed; 