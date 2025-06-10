import React, { useState } from 'react';
import './QuestionInput.css';

import MultipleChoice from './types/choices/MultipleChoice';
import Connect from './types/advanced/Connect';
import Swap from './types/advanced/Swap';
import ShortAnswer from './types/inputs/ShortAnswer';
import MultipleChoiceGrid from './types/choices/MultipleChoiceGrid';
import Date from './types/dates/Date';
import Time from './types/dates/Time';

function QuestionInput({ id, question, onQuestionChange, onDelete, dragHandle }) {
  const questionType = question.type || 'radio';

  return (
    <div className="questionCard">
      <div className="questionHeader">
        {dragHandle}
        
        <input
          type="text"
          className="questionInput"
          value={question.text}
          onChange={(e) => onQuestionChange({ ...question, text: e.target.value })}
          placeholder="Question"
        />
        
        <select 
          className="typeSelect"
          value={questionType}
          onChange={(e) => onQuestionChange({ ...question, type: e.target.value })}
        >
          <option value="radio">Multiple Choice</option>
          <option value="connect">Connect</option>
          <option value="swap">Swap</option>
          <option value="text">Text Answer</option>
          <option value="grid">Multiple Choice Grid</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
        </select>
        
        <button 
          className="deleteButton"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
      
      {questionType === 'text' && (
        <ShortAnswer 
          onChange={(value) => onQuestionChange({ ...question, shortAnswerValue: value })}
          value={question.shortAnswerValue}
        />
      )}
      
      {questionType === 'radio' && (
        <MultipleChoice
          options={question.options || []}
          selectedOptionId={question.correctOptionId}
          onChange={(options) =>
            onQuestionChange({ ...question, options })
          }
          onSelect={(selected) =>
            onQuestionChange({ ...question, correctOptionId: selected?.id })
          }
        />
      )}
      
      {questionType === 'date' && (
        <Date 
          onChange={(value) => onQuestionChange({ ...question, dateValue: value })}
          value={question.dateValue}
        />
      )}
      
      {questionType === 'time' && (
        <Time 
          onChange={(value) => onQuestionChange({ ...question, timeValue: value })}
          value={question.timeValue}
        />
      )}
      
      {questionType === 'grid' && (
        <MultipleChoiceGrid 
          options={question.gridOptions || {rows: [], columns: []}}
          onChange={(gridOptions) => {
            onQuestionChange({ 
              ...question, 
              gridOptions,
              options: [JSON.stringify(gridOptions)]
            });
            console.log("Updated grid question with options:", gridOptions);
          }}
        />
      )}
      
      {questionType === 'connect' && (
        <Connect 
          options={question.connectOptions || {left: [], right: []}}
          onChange={(connectOptions) => {
            onQuestionChange({ 
              ...question, 
              connectOptions,
              leftItems: connectOptions.left,
              rightItems: connectOptions.right,
              options: [JSON.stringify(connectOptions)]
            });
            console.log("Updated connect question with options:", connectOptions);
          }}
        />
      )}
      
      {questionType === 'swap' && (
        <Swap 
          options={question.swapOptions || []}
          onChange={(swapOptions) => {
            onQuestionChange({ 
              ...question, 
              swapOptions, 
              options: swapOptions
            });
            console.log("Updated swap question with options:", swapOptions);
          }}
        />
      )}
    </div>
  );
}

export default QuestionInput; 