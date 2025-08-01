import React, { useState, useEffect } from 'react';
import './PhotoModal.css';
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

// PhotoModalActions component
const PhotoModalActions = ({
  liked,
  saved,
  onLike,
  onSave,
  onSkip,
  isMobile
}) => (
  <div className={`PhotoModal-actions${isMobile ? ' mobile' : ''}`}>
    <button
      className={`PhotoModal-action-btn${liked ? ' liked' : ''}`}
      onClick={onLike}
      aria-label="Like"
      type="button"
    >
      {/* Heart icon */}
      <span className="PhotoModal-action-bg">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path
            d="M12 21s-7.5-6.2-7.5-11.2A5.5 5.5 0 0 1 12 5.5a5.5 5.5 0 0 1 7.5 4.3C19.5 14.8 12 21 12 21z"
            stroke={liked ? "#e0245e" : "#888"}
            strokeWidth="2"
            fill={liked ? "#e0245e" : "none"}
          />
        </svg>
      </span>
    </button>
    <button
      className={`PhotoModal-action-btn${saved ? ' saved' : ''}`}
      onClick={onSave}
      aria-label="Save"
      type="button"
    >
      {/* Bookmark icon */}
      <span className="PhotoModal-action-bg">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path
            d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-7-5-7 5V4z"
            stroke={saved ? "#a259ff" : "#888"}
            strokeWidth="2"
            fill={saved ? "#a259ff" : "none"}
          />
        </svg>
      </span>
    </button>
    <button
      className="PhotoModal-action-btn"
      onClick={onSkip}
      aria-label="Skip"
      type="button"
    >
      {/* Arrow/Skip icon */}
      <span className="PhotoModal-action-bg">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
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
);

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const PhotoModal = ({ photos, currentIndex, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [index, setIndex] = useState(currentIndex || 0);
  const isMobile = useIsMobile();

  const modalPhoto = photos[index];

  // Check if photo is liked by current user
  const checkLiked = async (photoId) => {
    const user = auth.currentUser;
    if (!user) return false;
    const docRef = doc(db, "users", user.uid, "likedFeeds", photoId.toString());
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  // On photo/index change, check liked state
  useEffect(() => {
    let mounted = true;
    if (modalPhoto && modalPhoto.id) {
      checkLiked(modalPhoto.id).then(isLiked => {
        if (mounted) setLiked(isLiked);
      });
    }
    return () => { mounted = false; };
  }, [modalPhoto]);

  // Handle Like with Firebase
  const handleLike = async () => {
    const user = auth.currentUser;
    if (!user || !modalPhoto) return;

    if (!liked) {
      setLiked(true);
      try {
        await setDoc(
          doc(db, "users", user.uid, "likedFeeds", modalPhoto.id.toString()),
          modalPhoto
        );
      } catch (error) {
        setLiked(false);
        console.error("Error liking photo:", error);
      }
    } else {
      setLiked(false);
      try {
        await deleteDoc(
          doc(db, "users", user.uid, "likedFeeds", modalPhoto.id.toString())
        );
      } catch (error) {
        setLiked(true);
        console.error("Error unliking photo:", error);
      }
    }
  };

  // Handle Save with Firebase
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !modalPhoto) return;
    setSaved(s => !s);
    try {
      await setDoc(
        doc(db, "users", user.uid, "savedFeeds", modalPhoto.id.toString()),
        modalPhoto
      );
    } catch (error) {
      console.error("Error saving photo:", error);
    }
  };

  // Handle Skip: show next photo in the feed (not recommended)
  const handleSkip = () => {
    if (index < photos.length - 1) {
      setIndex(index + 1);
    } else {
      onClose();
    }
  };

  // Recommendation engine: prioritize same category, then fill up to 9
  const getRecommendedPhotos = () => {
    if (!modalPhoto) return [];
    // Exclude the current photo
    const others = photos.filter((p, i) => i !== index);
    // 1. Same category
    const sameCategory = others.filter(
      p => p.category && modalPhoto.category &&
        p.category.toLowerCase().trim() === modalPhoto.category.toLowerCase().trim()
    );
    // 2. Fill with others (not same category)
    const notSameCategory = others.filter(
      p => !(
        p.category && modalPhoto.category &&
        p.category.toLowerCase().trim() === modalPhoto.category.toLowerCase().trim()
      )
    );
    // 3. Combine and limit to 9
    return [...sameCategory, ...notSameCategory].slice(0, 9);
  };

  const recommendedPhotos = getRecommendedPhotos();

  if (!modalPhoto) return null;

  return (
    <div className="PhotoModal-overlay" onClick={onClose}>
      <div className="PhotoModal-container" onClick={e => e.stopPropagation()}>
        {/* Close button in the top-right corner */}
        <button
          className="PhotoModal-close-btn"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        <div className="PhotoModal-left">
          <img src={modalPhoto.image_url} alt={modalPhoto.title} className="PhotoModal-main-img" />
          <div className="PhotoModal-info">
            <h2>{modalPhoto.title}</h2>
            <p>{modalPhoto.description}</p>
          </div>
          <PhotoModalActions
            liked={liked}
            saved={saved}
            onLike={handleLike}
            onSave={handleSave}
            onSkip={handleSkip}
            isMobile={isMobile}
          />
        </div>
        <div className="PhotoModal-right">
          <h3>Recommended</h3>
          <div className="recommended-grid">
            {recommendedPhotos.map((item, idx) => (
              <img
                key={item.id}
                src={item.image_url}
                alt={item.title}
                className={index === photos.findIndex(p => p.id === item.id) ? "PhotoModal-thumb active" : "PhotoModal-thumb"}
                onClick={() => setIndex(photos.findIndex(p => p.id === item.id))}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
