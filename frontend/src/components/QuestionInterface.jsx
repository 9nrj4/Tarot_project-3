// frontend/src/QuestionInterface.js
import React, { useEffect, useRef, useState } from 'react';
import './QuestionInterface.css';

function QuestionInterface({ currentQuestion, userResponses, onNext, onPrev }) {
  const questionInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (questionInputRef.current) {
      questionInputRef.current.value = userResponses[currentQuestion - 1] || '';
      questionInputRef.current.focus();
    }
  }, [currentQuestion, userResponses]);

  const getQuestionText = () => {
    switch(currentQuestion) {
      case 1:
        return 'Какой главный вопрос вы хотели бы задать картам?';
      case 2:
        return 'Есть ли какие-то конкретные области вашей жизни, о которых вы хотите узнать?';
      case 3:
        return 'Что вы чувствуете в данный момент?';
      default:
        return 'Поделитесь вашими мыслями.';
    }
  };

  const handleNext = () => {
    onNext(questionInputRef.current.value);
  };

  return (
    <div id="questionInterface" className="question-interface">
      <div id="questionBox" className="question-box">
        <div className="question-header">
          <h2 className="question-title">Вопрос {currentQuestion} из 3</h2>
        </div>
        
        <p className="question-text">{getQuestionText()}</p>
        
        <div className={`input-container ${isFocused ? 'focused' : ''}`}>
          <textarea 
            id="questionInput" 
            className="question-input" 
            ref={questionInputRef}
            defaultValue={userResponses[currentQuestion - 1]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Введите ваш ответ здесь..."
          ></textarea>
        </div>
        
        <div className="question-btns">
          {currentQuestion > 1 && (
            <button id="prevQuestionBtn" className="btn btn-outline" onClick={onPrev}>
              <i className="fas fa-chevron-left"></i> Назад
            </button>
          )}
          <button id="nextQuestionBtn" className="btn btn-primary" onClick={handleNext}>
            {currentQuestion === 3 ? 'Завершить' : 'Далее'} {currentQuestion < 3 && <i className="fas fa-chevron-right"></i>}
          </button>
        </div>
        
        <div className="question-progress">
          <div className="progress-bar">
            <div className="progress-filled" style={{ width: `${(currentQuestion / 3) * 100}%` }}></div>
          </div>
          <div className="progress-steps">
            <div className={`step ${currentQuestion >= 1 ? 'active' : ''}`}></div>
            <div className={`step ${currentQuestion >= 2 ? 'active' : ''}`}></div>
            <div className={`step ${currentQuestion >= 3 ? 'active' : ''}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionInterface;