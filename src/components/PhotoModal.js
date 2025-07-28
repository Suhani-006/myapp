import React from 'react';
import './PhotoModal.css';

const PhotoModal = ({ photo, recommendedPhotos, onClose }) => {
  return (
    <div className="PhotoModal-overlay" onClick={onClose}>
      <div className="PhotoModal-container" onClick={(e) => e.stopPropagation()}>
        <div className="PhotoModal-left">
          <img src={photo.image_url} alt={photo.title} className="PhotoModal-main-img" />
          <div className="PhotoModal-info">
            <h2>{photo.title}</h2>
            <p>{photo.description}</p>
          </div>
        </div>
        <div className="PhotoModal-right">
          <h3>Recommended</h3>
          <div className="PhotoModal-grid">
            {recommendedPhotos.map((item) => (
              <img
                key={item.id}
                src={item.image_url}
                alt={item.title}
                className="PhotoModal-thumb"
                onClick={() => window.location.href = `/explore/${item.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
