import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './fillForm.module.css';
import useForm from '../../hooks/useForm';

// Import question type
import Connect from "./types/connect/Connect";
import Swap from "./types/Swap";
import MultipleChoiceGrid from "./types/MultipleChoiceGrid";
import TextInput from "./types/TextAnswer";
import RadioInput from "./types/MultipleChoice";
import Date from  "./types/Date"
import Time from "./types/Time"

import { getForm, submitFormResponse } from "../../api";

export default function FillForm() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { 
    form, 
    responses, 
    loading, 
    error, 
    isSubmitting,
    submitSuccess,
    handleResponseChange,
    submitForm
  } = useForm(formId);

  useEffect(() => {
    if (form) console.log("Form loaded:", form.title);
  }, [form]);

  // sub nii dara Redirect len ok
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm();
  };

  if (loading) return <div className={styles.loading}>Маягтыг ачааллаж байна...</div>;
  if (submitSuccess) return (
    <div className={styles.successMessage}>
      <h2>Танд баярлалаа!</h2>
      <p>Таны хариултууд амжилттай хадгалагдлаа.</p>
    </div>
  );
  if (!form) return <div className={styles.errorMessage}>Маягт олдсонгүй.</div>;

  // Ensure questions is an array
  const questions = Array.isArray(form.questions) ? form.questions : [];

  // Extract text from option objects or JSON strings
  const extractOptionText = (option) => {
    if (typeof option === 'string' && (option.startsWith('{') || option.startsWith('['))) {
      try {
        const parsedOption = JSON.parse(option);
        if (parsedOption?.text) return parsedOption.text;
      } catch (e) { /* continue with other cases */ }
    }
    return option?.text || String(option || '');
  };

  // Create a standard question wrapper
  const QuestionWrapper = ({ children, question }) => (
    <div className={styles.questionItem}>
      {children}
    </div>
  );
  
  // Handle checkbox options
  const renderCheckboxOptions = (question, index) => {
    const questionId = question.id || `q-${index}`;
    return (
      <QuestionWrapper question={question}>
        <div className={styles.optionsContainer}>
          {Array.isArray(question.options) && question.options.map((option, i) => {
            const optionText = extractOptionText(option);
            const optionValue = typeof option === 'string' ? option : JSON.stringify(option);
            const isChecked = Array.isArray(responses[questionId]) 
              ? responses[questionId].includes(optionValue) 
              : false;
            
            return (
              <div key={i} className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  id={`${questionId}-${i}`}
                  name={`${questionId}-${i}`}
                  value={optionValue}
                  checked={isChecked}
                  onChange={() => {
                    const currentValues = Array.isArray(responses[questionId]) ? [...responses[questionId]] : [];
                    const newValues = isChecked 
                      ? currentValues.filter(v => v !== optionValue)
                      : [...currentValues, optionValue];
                    handleResponseChange(questionId, newValues);
                  }}
                />
                <label htmlFor={`${questionId}-${i}`}>{optionText}</label>
              </div>
            );
          })}
        </div>
      </QuestionWrapper>
    );
  };

  // Render specific question type component based on type
  const renderQuestionByType = (question, index) => {
    const questionId = question.id || `q-${index}`;
    
    switch(question.type) {
      case 'date':
        return (
          <QuestionWrapper question={question}>
            <Date
              question={question} 
              value={responses[questionId] || ''}
              onChange={(value) => handleResponseChange(questionId, value)}
            />
          </QuestionWrapper>
        );
      case 'time':
        return (
          <QuestionWrapper question={question}>
            <Time
              question={question} 
              value={responses[questionId] || ''}
              onChange={(value) => handleResponseChange(questionId, value)}
            />
          </QuestionWrapper>
        );
      case 'radio':
        return (
          <QuestionWrapper question={question}>
            <RadioInput 
              question={question}
              value={responses[questionId]}
              onChange={(value) => handleResponseChange(questionId, value)}
              options={question.options || []}
              extractOptionText={extractOptionText}
            />
          </QuestionWrapper>
        );
      case 'checkbox':
        return renderCheckboxOptions(question, index);
      case 'connect':
      case 'swap':
      case 'grid':
        const Components = {
          connect: Connect,
          swap: Swap,
          grid: MultipleChoiceGrid
        };
        const Component = Components[question.type];
        const defaultValue = question.type === 'grid' ? {} : [];
        
        return (
          <QuestionWrapper question={question}>
            <Component 
              question={question}
              value={responses[questionId] || defaultValue}
              onChange={(value) => handleResponseChange(questionId, value)}
            />
          </QuestionWrapper>
        );
      default:
        return <QuestionWrapper question={question}><label>{question.text}</label></QuestionWrapper>;
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h1>{form.title || 'Маягт'}</h1>
        {form.description && <p>{form.description}</p>}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {questions.map((question, index) => (
          <div key={question.id || index} className={styles.questionContainer}>
            {renderQuestionByType(question, index)}
          </div>
        ))}

        <div className={styles.submitContainer}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Илгээж байна...' : 'Илгээх'}
          </button>
        </div>
      </form>
    </div>
  );
}
