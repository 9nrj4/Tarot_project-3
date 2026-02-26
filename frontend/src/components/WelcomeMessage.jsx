// frontend/src/components/WelcomeMessage.jsx
import React from 'react';
import './WelcomeMessage.css';

const WelcomeMessage = ({ message, onContinue, readingDetail, onChangeReadingDetail }) => {
  return (
    <div className="welcome-section">
      <div className="welcome-container">
        <div className="welcome-content">
          <div className="welcome-header">
            <h2>Добро пожаловать в мир Таро</h2>
            {message && <p className="welcome-message">{message}</p>}
          </div>
          
          <div className="welcome-description">
            <p>
              Сейчас вам будет предложено ответить на три вопроса, которые помогут нам точнее интерпретировать карты Таро.
              Ваши ответы повлияют на глубину и точность предсказания.
            </p>
          </div>
          
          <div className="reading-preference">
            <h3>Выберите тип интерпретации:</h3>
            
            <div className="reading-options">
              <div 
                className={`reading-option ${readingDetail === 'detailed' ? 'active' : ''}`}
                onClick={() => onChangeReadingDetail('detailed')}
              >
                <div className="option-icon">
                  <i className="fas fa-book-open"></i>
                </div>
                <h4>Подробная</h4>
                <p>Полная интерпретация с детальным анализом символов и взаимосвязей между картами</p>
              </div>
              
              <div 
                className={`reading-option ${readingDetail === 'brief' ? 'active' : ''}`}
                onClick={() => onChangeReadingDetail('brief')}
              >
                <div className="option-icon">
                  <i className="fas fa-feather"></i>
                </div>
                <h4>Краткая</h4>
                <p>Сжатая интерпретация с акцентом на ключевые аспекты и практические советы</p>
              </div>
            </div>
          </div>
          
          <button className="submit-btn" onClick={onContinue}>
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;