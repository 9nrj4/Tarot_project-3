// frontend/src/api/LoadingContainer.jsx
import React from 'react';

function LoadingContainer({ loadingText }) {
  return (
    <div id="loadingContainer" className="loading-container">
      <div className="loading-circle"></div>
      <div id="loadingText" className="loading-text">
        {loadingText}
      </div>
    </div>
  );
}

export default LoadingContainer;