// frontend/src/components/TarotCardsContainer.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import "./TarotCardsContainer.css";

const TarotCardsContainer = ({
  sessionId,
  selectedCardIds,
  selectedCards,
  onCardSelect,
  onGetInterpretation,
  readingDetail,
}) => {
  const [randomCards, setRandomCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCardAnimationComplete, setIsCardAnimationComplete] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const cardsContainerRef = useRef(null);
  const maxSelectedCards = 3;
  // Максимум выбираемых карт
  const arcAngle = 160; // оставим для вычисления радуги, но сам "веер" больше не используем

  // Fetch random subset of cards
  useEffect(() => {
    const fetchRandomCards = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/random-subset-cards?count=20");
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data = await response.json();

        // Add unique IDs to cards if they don't have them
        const cardsWithIds = data.cards.map((card, index) => ({
          ...card,
          id: card.id || `card-${index}`,
        }));

        setRandomCards(cardsWithIds);

        // Delay to allow transition animations to complete
        setTimeout(() => {
          setIsCardAnimationComplete(true);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching random cards:", error);
        // Fallback to mock cards
        const mockCards = Array(20)
          .fill()
          .map((_, i) => ({
            id: `card-${i}`,
            name: `Карта ${i + 1}`,
            image: "default-card.jpg",
            type: "unknown",
          }));
        setRandomCards(mockCards);
        setTimeout(() => {
          setIsCardAnimationComplete(true);
          setIsLoading(false);
        }, 1500);
      }
    };

    fetchRandomCards();
  }, []);

  // Get rainbow color based on position in fan (0 to 1)
  const getRainbowColor = (position) => {
    // Rainbow colors: red -> orange -> yellow -> green -> blue -> indigo -> violet
    const hue = (position * 300 + 330) % 360; // Start from red (330) and cycle through
    const saturation = 80 + position * 20; // 80-100% saturation
    const lightness = 50 + Math.sin(position * Math.PI) * 10; // 50-60% lightness for vibrancy
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Базовые стили для карт (без веерного расположения — аккуратная сетка)
  const fanLayoutStyles = useMemo(() => {
    return randomCards.map((_, index) => {
      // Calculate position in rainbow (0 to 1)
      const rainbowPosition = index / (randomCards.length - 1 || 1);
      const rainbowColor = getRainbowColor(rainbowPosition);

      return {
        transition:
          "transform 0.5s ease, z-index 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        boxShadow: `0 4px 12px ${rainbowColor}40, 0 4px 8px rgba(0, 0, 0, 0.3)`,
        animationDelay: `${index * 50}ms`,
        borderRadius: "10px",
        border: `2px solid ${rainbowColor}`,
      };
    });
  }, [randomCards]);

  // Handle card click - select or deselect
  const handleCardClick = (card) => {
    if (!isCardAnimationComplete) return;
    onCardSelect(card); // Let parent handle the selection/deselection logic
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Enhanced card style with better hover effects
  const getCardStyle = (index, isSelected) => {
    if (!fanLayoutStyles[index]) return {};

    const style = { ...fanLayoutStyles[index] };

    const rainbowPosition = index / (randomCards.length - 1 || 1);
    const rainbowColor = getRainbowColor(rainbowPosition);
    
    // Эффекты выбора и наведения (подъём, тень, подсветка),
    // но без поворота/веера
    if (isSelected) {
      style.transform = `translateY(-15px)`;
      style.boxShadow = `0 15px 35px ${rainbowColor}80, 0 8px 16px rgba(0, 0, 0, 0.4)`;
      style.zIndex = 3;
      style.filter = "brightness(1.2) saturate(1.3)";
      style.border = `3px solid ${rainbowColor}`;
    } else if (hoveredIndex === index) {
      style.transform = `translateY(-10px)`;
      style.zIndex = 2;
      style.boxShadow = `0 12px 28px ${rainbowColor}70, 0 6px 12px rgba(0, 0, 0, 0.3)`;
      style.cursor = "pointer";
      style.filter = "brightness(1.15) saturate(1.2)";
      style.border = `3px solid ${rainbowColor}`;
    }

    return style;
  };

  // Get card image path
  const getCardImagePath = (card) => {
    if (!card.image) return "/images/IMG_1063.WEBP";
    return `/api/static/images/tarot/${card.image}`;
  };

  // Start reading with selected cards
  const handleStartReading = () => {
    onGetInterpretation(readingDetail);
  };
  return (
    <div className="tarot-cards-container" ref={cardsContainerRef}>
      

      {isLoading ? (
        <div className="loading-cards">
          <div className="spinner"></div>
          <p>Тасую колоду...</p>
        </div>
      ) : (
        <>
          <div className="cards-selection-title">
            <h2>Выберите три карты для вашего расклада</h2>
            <p>Интуитивно выберите карты, которые вас привлекают</p>
          </div>
          {/* Improved tarot cards fan display */}
          <div className="cards-fan">
            {randomCards.map((card, index) => {
              const isSelected = selectedCardIds.includes(card.id);
              return (
                <div
                  key={card.id}
                  className={`tarot-card ${isSelected ? "selected" : ""}`}
                  style={getCardStyle(index, isSelected)}
                  onClick={() => handleCardClick(card)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="card-inner">
                    {isSelected ? (
                      <>
                        <img
                          src={getCardImagePath(card)}
                          alt={card.name}
                          className="card-image"
                          onError={(e) => {
                            console.error("Failed to load card image in fan:", getCardImagePath(card));
                            console.error("Card data:", card);
                          }}
                        />
                        <div className="card-name">{card.name}</div>
                        <div className="selection-number">
                          {selectedCardIds.indexOf(card.id) + 1}
                        </div>
                      </>
                    ) : (
                      <div className="card-back">
                        <div className="card-back-design"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected cards display */}
          <div className="selected-cards-section">
            <div className="selected-cards">
              <h3 className="selected-title">
                Выбранные карты ({selectedCards.length}/{maxSelectedCards})
              </h3>
              <div className="selected-cards-container">
                {[0, 1, 2].map((index) => (
                  <div key={`slot-${index}`} className="card-slot">
                    {selectedCards[index] ? (
                      <div className="selected-card">
                        <img
                          src={getCardImagePath(selectedCards[index])}
                          alt={selectedCards[index].name}
                          className="selected-card-image"
                          onError={(e) => {
                            console.error("Failed to load card image:", getCardImagePath(selectedCards[index]));
                            console.error("Card data:", selectedCards[index]);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log("Successfully loaded image:", getCardImagePath(selectedCards[index]));
                          }}
                        />
                        <div className="selected-card-name">
                          {selectedCards[index].name}
                        </div>
                      </div>
                    ) : (
                      <div className="empty-slot">
                        <div className="slot-number">{index + 1}</div>
                        <div className="slot-text">Выберите карту</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cards-controls">
            <div className="selected-cards-info">
              <p>Выбрано карт: {selectedCardIds.length} из 3</p>
              <p className="reading-detail-indicator">
                Уровень интерпретации:{" "}
                {readingDetail === "detailed" ? "Подробный" : "Краткий"}
              </p>
            </div>

            <button
              className={`interpret-btn ${
                selectedCardIds.length === 3 ? "active" : ""
              }`}
              disabled={selectedCardIds.length !== 3}
              onClick={handleStartReading}
            >
              Получить интерпретацию
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TarotCardsContainer;
