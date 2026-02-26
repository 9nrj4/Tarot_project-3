// frontend/src/main.jsx
import React, { useState, useEffect } from "react";
import "./main.css";
import WelcomeMessage from "./components/WelcomeMessage";
import QuestionInterface from "./components/QuestionInterface";
import TarotCardsContainer from "./components/TarotCardsContainer";
import InterpretationContainer from "./components/InterpretationContainer";
import LoadingContainer from "./components/LoadingContainer";
import ManualCardSelection from "./components/ManualCardSelection";
import { getCards } from "./api/tarotApi";
import {
  createSession,
  submitQuestions,
  getInterpretation,
} from "./api/tarotApi";

function Main() {
  const [cachedCards, setCachedCards] = useState([]);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [stageVisible, setStageVisible] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [userResponses, setUserResponses] = useState(["", "", ""]);
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showQuestionInterface, setShowQuestionInterface] = useState(false);
  const [showTarotCards, setShowTarotCards] = useState(false);
  const [showManualCardSelection, setShowManualCardSelection] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [interpretationText, setInterpretationText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [readingType, setReadingType] = useState("ai");
  const [showSelectionControls, setShowSelectionControls] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [readingDetail, setReadingDetail] = useState("detailed");

  useEffect(() => {
    document.body.classList.add("body-loaded");
    // Auto-open curtains on mount
    setCurtainsOpen(true);
    setTimeout(() => {
      setStageVisible(true);
      document.body.style.overflow = "auto";
    }, 1000);
  }, []);

  const openCurtains = () => {
    setCurtainsOpen(true);
    setTimeout(() => {
      setStageVisible(true);
      document.body.style.overflow = "auto";
    }, 1000);
  };

  const continueToQuestions = () => {
    console.log("Переход к вопросам");
    setShowWelcomeMessage(false);
    setShowQuestionInterface(true);
  };

  const beginReading = async () => {
    try {
      setShowSelectionControls(false);
      setLoading(true);
      setLoadingText("Создание новой сессии...");
      const data = await createSession();
      setSessionId(data.session_id);
      await fetchCards();
      setLoading(false);
      console.log("Тип чтения:", readingType);

      if (readingType === "ai") {
        setShowWelcomeMessage(true);
        console.log("WelcomeMessage должен отображаться");
      } else {
        // Для пользовательского расклада сразу переходим к вопросам
        setShowQuestionInterface(true);
        console.log("Переход к вопросам для пользовательского расклада");
      }
    } catch (error) {
      console.error("Ошибка при создании сессии:", error);
      setLoading(false);
      alert("Произошла ошибка при подключении к серверу.");
    }
  };

  const updateUserResponses = (index, value) => {
    const newResponses = [...userResponses];
    newResponses[index] = value;
    setUserResponses(newResponses);
  };

  const fetchCards = async () => {
    try {
      const data = await getCards();
      setCachedCards(data.cards);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке карт:", error);
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    console.log("Функция nextQuestion вызвана");

    const newUserResponses = [...userResponses];
    const inputValue = document.getElementById("questionInput")?.value || "";
    console.log("Получено значение:", inputValue);

    newUserResponses[currentQuestion - 1] = inputValue;
    setUserResponses(newUserResponses);

    if (currentQuestion < 3) {
      console.log("Переход к следующему вопросу");
      setCurrentQuestion((prev) => prev + 1);
    } else {
      console.log("Все вопросы отвечены");

      try {
        await submitQuestions(sessionId, newUserResponses);
        setShowQuestionInterface(false);

        // Решаем, куда перейти дальше - к выбору карт или к ручному выбору
        if (readingType === "ai") {
          setShowTarotCards(true);
        } else {
          setShowManualCardSelection(true);
        }
      } catch (error) {
        console.error("Ошибка при отправке вопросов:", error);
        alert(
          "Произошла ошибка при отправке вопросов. Пожалуйста, попробуйте еще раз."
        );
      }
    }
  };

  const prevQuestion = () => {
    const newUserResponses = [...userResponses];
    newUserResponses[currentQuestion - 1] =
      document.getElementById("questionInput")?.value || "";
    setUserResponses(newUserResponses);
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleCardSelection = (card) => {
    console.log("Выбрана карта:", card);
    console.log("Текущие выбранные cardIds:", selectedCardIds);
    console.log("Текущие выбранные cards:", selectedCards);
    if (!card.id) {
      console.error("Карта не имеет ID:", card);
      return;
    }
    if (selectedCardIds.includes(card.id)) {
      const index = selectedCardIds.indexOf(card.id);
      const newSelectedCardIds = [...selectedCardIds];
      const newSelectedCards = [...selectedCards];
      newSelectedCardIds.splice(index, 1);
      newSelectedCards.splice(index, 1);

      console.log(
        "Карта удалена из выбранных. Новый массив ID:",
        newSelectedCardIds
      );
      console.log("Новый массив карт:", newSelectedCards);

      setSelectedCardIds(newSelectedCardIds);
      setSelectedCards(newSelectedCards);
    } else if (selectedCardIds.length < 3) {
      setSelectedCardIds((prev) => [...prev, card.id]);
      setSelectedCards((prev) => [...prev, card]);

      console.log("Карта добавлена в выбранные.");
    } else {
      alert("Вы уже выбрали 3 карты.");
    }
  };

  const handleManualCardSelectionComplete = (selectedCards) => {
    console.log("Получены выбранные карты вручную:", selectedCards);
    setSelectedCards(selectedCards);
    setSelectedCardIds(selectedCards.map((card) => card.id));

    // Сразу отправляем на интерпретацию с только что выбранными картами,
    // чтобы избежать гонки состояний
    handleGetInterpretation(readingDetail, selectedCards);
  };

  const resetToStart = () => {
    // Reset all state to initial values
    setCurtainsOpen(true);
    setStageVisible(true);
    setSessionId(null);
    setCurrentQuestion(1);
    setUserResponses(["", "", ""]);
    setSelectedCardIds([]);
    setSelectedCards([]);
    setShowWelcomeMessage(false);
    setShowQuestionInterface(false);
    setShowTarotCards(false);
    setShowManualCardSelection(false);
    setShowInterpretation(false);
    setInterpretationText("");
    setLoading(false);
    setShowSelectionControls(true);
    setReadingDetail("detailed");
    document.body.style.overflow = "auto";
  };

  const handleGetInterpretation = async (detail, cardsOverride) => {
    setLoading(true);
    const loadingMessages = [
      "Соединение с энергией карт...",
      "Анализ выбранных символов...",
      "Чтение астральных линий...",
      "Интерпретация взаимосвязи карт...",
      "Подготовка персонального расклада...",
    ];

    let messageIndex = 0;
    setLoadingText(loadingMessages[messageIndex]);

    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 2000);

    try {
      const chosenCards = (cardsOverride && cardsOverride.length
        ? cardsOverride
        : selectedCards);

      // Ensure we have valid card names - cards from API should already match backend
      if (!Array.isArray(chosenCards) || chosenCards.length === 0) {
        throw new Error("Не выбрано ни одной карты");
      }

      const cardsToUse = chosenCards
        .filter(c => c && c.name && typeof c.name === 'string')
        .map(c => {
          const trimmed = c.name.trim();
          console.log("Card name:", trimmed, "| Original:", c.name);
          return trimmed;
        })
        .filter(name => name.length > 0);

      console.log("Sending cards for interpretation:", cardsToUse);
      console.log("Original chosenCards:", chosenCards.map(c => ({ name: c?.name, image: c?.image })));
      console.log("Session ID:", sessionId);
      console.log("Reading detail:", detail || readingDetail);

      if (cardsToUse.length !== chosenCards.length) {
        console.warn("Some cards were filtered out. Original:", chosenCards.length, "Filtered:", cardsToUse.length);
      }

      if (cardsToUse.length === 0) {
        throw new Error("Не выбрано ни одной карты. Проверьте, что карты загружены.");
      }

      if (cardsToUse.length !== 3) {
        throw new Error(`Выбрано ${cardsToUse.length} карт. Требуется 3 карты.`);
      }

      // Ensure session exists - create if missing
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        console.log("Session ID missing, creating new session...");
        try {
          const sessionData = await createSession();
          currentSessionId = sessionData.session_id;
          setSessionId(currentSessionId);
          console.log("New session created:", currentSessionId);
        } catch (sessionError) {
          throw new Error("Не удалось создать сессию. Пожалуйста, попробуйте еще раз.");
        }
      }

      console.log("Calling getInterpretation with:", {
        sessionId: currentSessionId,
        cardsToUse,
        readingDetail: detail || readingDetail
      });

      const data = await getInterpretation(
        currentSessionId,
        cardsToUse,
        detail || readingDetail
      );

      console.log("Interpretation response:", data);

      // Check for error response from backend
      if (data && data.success === false) {
        throw new Error(data.message || "Ошибка при получении интерпретации");
      }

      if (!data || !data.message) {
        throw new Error("Пустой ответ от сервера. Попробуйте еще раз.");
      }

      clearInterval(messageInterval);

      setTimeout(() => {
        setLoading(false);
        setShowTarotCards(false);
        setShowManualCardSelection(false);
        const formattedText = formatInterpretationText(data.message);
        setInterpretationText(formattedText);
        setShowInterpretation(true);
        document.body.style.overflow = "auto";
      }, 1500);
    } catch (error) {
      clearInterval(messageInterval);
      console.error("Ошибка при получении интерпретации:", error);
      setLoading(false);
      alert(
        "Произошла ошибка при получении интерпретации. Пожалуйста, попробуйте еще раз."
      );
    }
  };

  const formatInterpretationText = (text) => {
    text = text.replace(/\*\*(.*?)\*\*/g, "<h3>$1</h3>");
    const paragraphs = text.split("\n\n");
    return paragraphs
      .map((p) => {
        if (p.trim().startsWith("<h3>")) {
          return p;
        }
        return `<p>${p}</p>`;
      })
      .join("");
  };

  return (
    <>
      <header>
        <div className="container">
          <nav>
            <div className="logo">
              <i className="fas fa-moon"></i> Mystic<span>Tarot</span>
            </div>

            <div className="auth-btns">
              <a href="/login" className="btn btn-outline">
                Вход
              </a>
              <a href="/login" className="btn btn-primary">
                Регистрация
              </a>
            </div>
          </nav>
        </div>
      </header>
      <main>
        <section className="">
          {/* Кнопка открытия занавесов */}
          <button
            id="openCurtainBtn"
            className={`open-curtain-btn ${curtainsOpen ? "hidden" : ""}`}
            onClick={openCurtains}
          >
            Открыть занавес
          </button>

          {/* Left Curtain */}
          <div
            className={`curtain curtain-left ${curtainsOpen ? "open" : ""}`}
            id="leftCurtain"
          >
            <div className="curtain-fold"></div>
            <div className="curtain-edge"></div>
            <div className="curtain-tie"></div>
          </div>

          {/* Right Curtain */}
          <div
            className={`curtain curtain-right ${curtainsOpen ? "open" : ""}`}
            id="rightCurtain"
          >
            <div className="curtain-fold"></div>
            <div className="curtain-edge"></div>
            <div className="curtain-tie"></div>
          </div>

          {/* Central Stage Content */}
          <div
            className={`stage-content ${stageVisible ? "visible" : ""}`}
            id="stageContent"
          >
            {showSelectionControls && (
              <>
                <div className="tarot-reader">
                  <img
                    src="/images/taroreader.png"
                    alt="Таролог"
                    className="reader-image"
                  />
                </div>
                <div className="new-crystal-ball"></div>

                <h1 className="stage-title">
                  Таро с Искусственным Интеллектом
                </h1>
                <p className="stage-subtitle">
                  Откройте для себя мир Таро с помощью современных технологий, и
                  индивидуальных раскладов
                </p>
                <div className="card-selection">
                  <label className="selection-label">
                    Как вы хотите выбрать карты?
                  </label>
                  <select
                    className="dropdown"
                    id="readingType"
                    value={readingType}
                    onChange={(e) => setReadingType(e.target.value)}
                  >
                    <option value="ai">ИИ-интерпретация</option>
                    <option value="personal">Пользовательский расклад</option>
                  </select>
                  <button
                    className="begin-btn"
                    id="beginReadingBtn"
                    onClick={beginReading}
                  >
                    Начать расклад
                  </button>
                  <p className="disclaimer">
                    Помните, что это всего лишь развлечение. Не принимайте
                    решения на основе предсказаний.
                  </p>
                </div>
              </>
            )}
            {loading && <LoadingContainer text={loadingText} />}
            {showWelcomeMessage && (
              <WelcomeMessage
                message={welcomeMessage}
                onContinue={continueToQuestions}
                readingDetail={readingDetail}
                onChangeReadingDetail={setReadingDetail}
              />
            )}

            {showQuestionInterface && (
              <QuestionInterface
                currentQuestion={currentQuestion}
                userResponses={userResponses}
                onNext={nextQuestion}
                onPrev={prevQuestion}
              />
            )}

            {showTarotCards && (
              <TarotCardsContainer
                sessionId={sessionId}
                selectedCardIds={selectedCardIds}
                selectedCards={selectedCards}
                onCardSelect={handleCardSelection}
                onGetInterpretation={handleGetInterpretation}
                readingDetail={readingDetail}
              />
            )}

            {showManualCardSelection && (
              <ManualCardSelection
                sessionId={sessionId}
                allCards={cachedCards}
                onComplete={handleManualCardSelectionComplete}
                readingDetail={readingDetail}
                onReadingDetailChange={setReadingDetail}
              />
            )}

            {showInterpretation && (
              <InterpretationContainer
                interpretationText={interpretationText}
                onNewReading={resetToStart}
              />
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Main;
