
// /Tarot_project/frontend/src/components/InterpretationContainer.jsx
import React, { useState } from 'react';
import './InterpretationContainer.css';

function InterpretationContainer({ interpretationText, onNewReading }) {
  const [showFullInterpretation, setShowFullInterpretation] = useState(false);
  
  const handleNewReading = () => {
    if (onNewReading) {
      onNewReading();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="interpretation-container">
      <div className="interpretation-bg"></div>
      <div className="interpretation-content">
        <h2 className="interpretation-title">Ваше чтение карт Таро</h2>
        
        <div 
          className={`interpretation-text ${showFullInterpretation ? 'full' : ''}`}
          dangerouslySetInnerHTML={{ __html: interpretationText }}
        />
        
        {!showFullInterpretation && interpretationText.length > 500 && (
          <button 
            className="show-more-btn"
            onClick={() => setShowFullInterpretation(true)}
          >
            Показать полное толкование
          </button>
        )}
        
        <div className="actions-container">
          <button className="action-btn save-btn">
            <i className="fas fa-save"></i> Сохранить чтение
          </button>
          <button className="action-btn share-btn">
            <i className="fas fa-share-alt"></i> Поделиться
          </button>
          <button className="action-btn new-reading-btn" onClick={handleNewReading}>
            <i className="fas fa-redo"></i> Новое чтение
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterpretationContainer;
