import React from 'react';
import styles from '../fillForm.module.css';

export default function RadioInput({ question, value, onChange, options = [], extractOptionText }) {
  const questionId = question.id;
  return (
    <>
      <label>{question.text}</label>
      <div className={styles.optionsContainer}>
        {options.map((option, i) => {
          const optionText = extractOptionText ? extractOptionText(option) : String(option);
          const optionValue = typeof option === 'string' ? option : JSON.stringify(option);
          
          return (
            <div key={i} className={styles.radioOption}>
              <input
                type="radio"
                id={`${questionId}-${i}`}
                name={questionId}
                value={optionValue}
                checked={value === optionValue}
                onChange={() => onChange(optionValue)}
                required
              />
              <label htmlFor={`${questionId}-${i}`}>{optionText}</label>
            </div>
          );
        })}
      </div>
    </>
  );
}
