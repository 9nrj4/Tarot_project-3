// frontend/src/components/ManualCardSelection.jsx
import React, { useState, useEffect } from 'react';
import './ManualCardSelection.css';

function ManualCardSelection({ sessionId, allCards, onComplete, readingDetail, onReadingDetailChange }) {
  const [selectedCards, setSelectedCards] = useState([]);
  console.log('ManualCardSelection инициализирован с allCards:', allCards);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [localReadingDetail, setLocalReadingDetail] = useState(readingDetail);

  useEffect(() => {
    if (Array.isArray(allCards)) {
      setFilteredCards(
        allCards.filter(card => 
          card.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      console.error('allCards не является массивом:', allCards);
      setFilteredCards([]);
    }
  }, [searchTerm, allCards]);

  useEffect(() => {
    // Update local state when prop changes
    setLocalReadingDetail(readingDetail);
  }, [readingDetail]);

  const handleCardSelect = (card) => {
    console.log("Выбрана карта:", card);
    console.log("Текущие выбранные карты:", selectedCards);
    
    if (selectedCards.some(c => c.id === card.id)) {
      // Если карта уже выбрана, удаляем ее
      const newSelectedCards = selectedCards.filter(c => c.id !== card.id);
      console.log("Карта удалена, новые выбранные карты:", newSelectedCards);
      setSelectedCards(newSelectedCards);
    } else if (selectedCards.length < 3) {
      // Если еще не выбрано 3 карты, добавляем новую
      const newSelectedCards = [...selectedCards, card];
      console.log("Карта добавлена, новые выбранные карты:", newSelectedCards);
      setSelectedCards(newSelectedCards);
    } else {
      alert('Вы уже выбрали 3 карты. Удалите одну, чтобы выбрать другую.');
    }
  };

  const handleReadingDetailChange = (value) => {
    setLocalReadingDetail(value);
    // Pass the change up to the parent component
    onReadingDetailChange(value);
  };

  const handleSubmit = () => {
    if (selectedCards.length !== 3) {
      alert('Пожалуйста, выберите 3 карты.');
      return;
    }
    onComplete(selectedCards);
  };

  return (
    <div className="manual-card-selection">
      <h2>Укажите карты, которые вам выпали</h2>
      <p>Выберите 3 карты из списка ниже:</p>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск карт..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="selected-cards-preview">
        <h3>Выбранные карты ({selectedCards.length}/3):</h3>
        <div className="selected-cards-container">
          {Array.isArray(selectedCards) && selectedCards.map(card => (
            <div key={card.id || Math.random()} className="selected-card-item">
              <img 
                src={`/api/static/images/tarot/${card.image}`} 
                alt={card.name} 
                className="selected-card-image"
              />
              <span>{card.name}</span>
              <button 
                className="remove-card-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardSelect(card);
                }}
              >
                ✕
              </button>
            </div>
          ))}
          {[...Array(Math.max(0, 3 - (Array.isArray(selectedCards) ? selectedCards.length : 0)))].map((_, i) => (
            <div key={`empty-${i}`} className="empty-card-slot">
              <div className="empty-card-placeholder">
                <span>Выберите карту</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cards-list">
        {Array.isArray(filteredCards) && filteredCards.map(card => (
          <div 
            key={card.id} 
            className={`card-list-item ${selectedCards.some(c => c.id === card.id) ? 'selected' : ''}`}
            onClick={() => handleCardSelect(card)}
          >
            <img 
              src={`/api/static/images/tarot/${card.image}`} 
              alt={card.name} 
              className="card-thumbnail"
            />
            <span className="card-name">{card.name}</span>
          </div>
        ))}
        {(!Array.isArray(filteredCards) || filteredCards.length === 0) && (
          <div className="no-cards-message">
            Карты не найдены. Проверьте поисковый запрос или обновите страницу.
          </div>
        )}
      </div>

      <div className="manual-selection-controls">
        <div className="reading-detail-selector">
          <label>Детализация расклада:</label>
          <select 
            value={localReadingDetail}
            onChange={(e) => handleReadingDetailChange(e.target.value)}
          >
            <option value="detailed">Подробный</option>
            <option value="brief">Краткий</option>
          </select>
        </div>
        <button 
          className="submit-cards-btn" 
          onClick={handleSubmit}
          disabled={selectedCards.length !== 3}
        >
          Получить интерпретацию
        </button>
      </div>
    </div>
  );
}

export default ManualCardSelection;