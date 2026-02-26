// frontend/src/api/tarotApi.js
const API_BASE_URL = '/api';
export const createSession = async () => {
    const response = await fetch('/api/new-session', {
      method: 'POST'
    });
    return response.json();
  };
  
  export const submitQuestions = async (sessionId, responses) => {
    const response = await fetch('/api/submit-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session_id: sessionId,
        responses: responses
      })
    });
    return response.json();
  };
  
export const getCards = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

  
  export const getInterpretation = async (sessionId, cards, readingDetail = 'detailed') => {
    console.log('getInterpretation called with:', { sessionId, cards, readingDetail });
    
    const response = await fetch('/api/draw-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session_id: sessionId,
        cards: cards,
        reading_detail: readingDetail
      })
    });
    
    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', e);
      throw new Error(`Ошибка сервера: ${response.status} - ${responseText.substring(0, 200)}`);
    }
    
    if (!response.ok) {
      const errorMsg = data.message || `HTTP error! Status: ${response.status}`;
      const unknownNames = data.unknown_names ? ` Неизвестные карты: ${data.unknown_names.join(', ')}` : '';
      throw new Error(errorMsg + unknownNames);
    }
    
    // Check if backend returned an error
    if (data && data.success === false) {
      const errorMsg = data.message || 'Неизвестная ошибка';
      const unknownNames = data.unknown_names ? ` Неизвестные карты: ${data.unknown_names.join(', ')}` : '';
      throw new Error(errorMsg + unknownNames);
    }
    
    return data;
  };