import React from 'react';
import styles from '../fillForm.module.css';

export default function Time({ question, value, onChange }) {
  return (
    <div className={styles.questionType}>
      <label className={styles.questionLabel}>{question.text}</label>
      <div className={styles.timeInputContainer}>
        <p>Select a time:</p>
        <input 
          type="time" 
          className={styles.timeInput}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="--:-- --"
        />
      </div>
    </div>
  );
}
