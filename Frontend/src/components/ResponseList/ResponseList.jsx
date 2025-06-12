import './ResponseList.css';
import React from 'react';

function ResponseList({ responses = [] }) {
  if (responses.length === 0) {
    return <div className="noResponses">No responses yet</div>;
  }
  
  // Helper function to format answer values for display
  const formatAnswerValue = (answer) => {
    if (answer === null || answer === undefined) return 'No answer';
    
    if (typeof answer === 'object') {
      // Handle different object types
      if (Array.isArray(answer)) {
        return answer.join(', ');
      }
      
      // Handle grid selections (key-value pairs)
      if (Object.keys(answer).length > 0) {
        return Object.entries(answer)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      }
      
      return JSON.stringify(answer);
    }
    
    return String(answer);
  };
  
  return (
    <div className="responseList">
      {responses.map((response, index) => (
        <div key={index} className="responseItem">
          <div className="responseHeader">
            <h3>Response #{index + 1}</h3>
            <span className="timestamp">
              {new Date(response.submittedAt || response.timestamp || Date.now()).toLocaleString()}
            </span>
          </div>

          <div className="responseContent">
            {response.responses && response.responses.length > 0 ? (
              response.responses.map((answer, i) => (
                <div key={i} className="answer">
                  <div className="question">{answer?.question || 'Question ' + (i+1)}</div>
                  <div className="answerText">{formatAnswerValue(answer?.answer)}</div>
                </div>
              ))
            ) : (
              <div className="noAnswers">No answers provided</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default ResponseList; 
