import React from 'react';
import './FeedContainer.css';

const FeedContainer = ({ children }) => {
  return (
    <div className="FeedContainer">
      <div className="FeedContainer-content">
        {children}
      </div>
    </div>
  );
};

export default FeedContainer; 