// frontend/src/api/InterpretationContainer.jsx
import React, { useEffect, useRef } from 'react';

function InterpretationContainer({ interpretationText }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [interpretationText]);

  return (
    <div 
      id="interpretationContainer" 
      className="interpretation-container" 
      ref={containerRef}
    >
      <h2>Интерпретация карт</h2>
      <div 
        id="interpretationText" 
        className="interpretation-text"
        dangerouslySetInnerHTML={{ __html: interpretationText }}
      />
    </div>
  );
}

export default InterpretationContainer;