import React, { useState } from 'react';
import './PhotoModal.css';
import { doc, setDoc, getDoc } from "firebase/firestore";
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

const PhotoModal = ({ photo, recommendedPhotos, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  // Check if photo is liked
  const isPhotoLiked = async (photoId) => {
    const user = auth.currentUser;
    if (!user) return false;
    const docRef = doc(db, "users", user.uid, "likedFeeds", photoId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  // Handle Like with Firebase
  const handleLike = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLiked((prev) => !prev);

    try {
      await setDoc(
        doc(db, "users", user.uid, "likedFeeds", photo.id), // Save under user > likedFeeds > photo.id
        photo
      );
      console.log("Photo liked and saved in Firebase!");
    } catch (error) {
      console.error("Error liking photo:", error);
    }
  };

  // Handle Save with Firebase
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setSaved(s => !s);
    try {
      await setDoc(
        doc(db, "users", user.uid, "savedFeeds", photo.id),
        photo
      );
      // Optionally show a message
    } catch (error) {
      console.error("Error saving photo:", error);
    }
  };

  // Handle Skip: show next recommended photo in modal
  const handleSkip = () => {
    if (recommendedPhotos && recommendedPhotos.length > 0) {
      const nextIdx = (currentIndex + 1) % recommendedPhotos.length;
      setCurrentIndex(nextIdx);
    }
  };

  // Show current photo (first is the passed photo, then recommended)
  const modalPhoto = currentIndex === 0 ? photo : recommendedPhotos[currentIndex - 1];

  return (
    <div className="PhotoModal-overlay" onClick={onClose}>
      <div className="PhotoModal-container" onClick={e => e.stopPropagation()}>
        <PhotoModalActions
          liked={liked}
          saved={saved}
          onLike={handleLike}
          onSave={handleSave} // <-- now saves to Firebase
          onSkip={handleSkip}
          isMobile={isMobile}
        />
        <div className="PhotoModal-left">
          <img src={modalPhoto.image_url} alt={modalPhoto.title} className="PhotoModal-main-img" />
          <div className="PhotoModal-info">
            <h2>{modalPhoto.title}</h2>
            <p>{modalPhoto.description}</p>
          </div>
        </div>
        <div className="PhotoModal-right">
          <h3>Recommended</h3>
          <div className="PhotoModal-grid">
            {recommendedPhotos.map((item, idx) => (
              <img
                key={item.id}
                src={item.image_url}
                alt={item.title}
                className={`PhotoModal-thumb${currentIndex === idx + 1 ? ' active' : ''}`}
                onClick={() => setCurrentIndex(idx + 1)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
