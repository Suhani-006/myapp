import React from 'react';
import './Feed.css';
import { useEffect, useState } from 'react';

const placeholderPhotos = Array.from({ length: 20 }, (_, i) => `https://picsum.photos/seed/${i}/400/600`);

const BATCH_SIZE = 16;

const Feed = () => {
  const [photos, setPhotos] = useState(placeholderPhotos.slice(0, BATCH_SIZE));
  const [loading, setLoading] = useState(false);
  const [showTop, setShowTop] = useState(false);

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

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="Feed">
      <div className="Feed-grid">
        {photos.map((src, idx) => (
          <div className="Feed-photo-card" key={idx}>
            <img src={src} alt={`Photo ${idx + 1}`} loading="lazy" />
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