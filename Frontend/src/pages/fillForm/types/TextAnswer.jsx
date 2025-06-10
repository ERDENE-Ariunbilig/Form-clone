import React from 'react';
import styles from '../fillForm.module.css';

export default function TextInput({ question, value, onChange, required = true }) {
  return (
    <>
      <label>{question.text}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={styles.textInput}
        placeholder={question.placeholder || ''}
      />
    </>
  );
}