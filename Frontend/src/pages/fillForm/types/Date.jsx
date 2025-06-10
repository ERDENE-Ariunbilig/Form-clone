import React from 'react';
import styles from '../fillForm.module.css';

export default function Date({ question, value, onChange }) {
  return (
    <div className={styles.questionType}>
      <label className={styles.questionLabel}>{question.text}</label>
      <div className={styles.dateInputContainer}>
        <p>Select a date:</p>
        <input 
          type="date" 
          className={styles.dateInput}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="mm/dd/yyyy"
        />
      </div>
    </div>
  );
}
