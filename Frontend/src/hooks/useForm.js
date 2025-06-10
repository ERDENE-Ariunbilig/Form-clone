import { useState, useEffect } from 'react';
import { getForm, submitFormResponse } from '../api';

// Custom hook for handling form operations
const useForm = (formId) => {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch form data
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const formData = await getForm(formId);
        
        // Log raw response
        console.log("Raw form data from API:", formData);
        
        // Normalize form data
        const normalizedForm = {
          ...formData,
          title: formData.title || "Маягт",
          description: formData.description || "",
          questions: normalizeQuestions(formData.questions || [])
        };
        
        setForm(normalizedForm);
        
        // Initialize responses
        const initialResponses = {};
        if (normalizedForm.questions) {
          normalizedForm.questions.forEach(question => {
            if (question && question.id) {
              // Initialize different response types based on question type
              switch(question.type) {
                case 'checkbox':
                  initialResponses[question.id] = [];
                  break;
                case 'connect':
                  initialResponses[question.id] = [];
                  break;
                case 'swap':
                  initialResponses[question.id] = [];
                  break;
                case 'grid':
                  initialResponses[question.id] = {};
                  break;
                default:
                  initialResponses[question.id] = '';
              }
            }
          });
        }
        setResponses(initialResponses);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching form:", err);
        setError("Маягтыг ачааллахад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchForm();
    }
  }, [formId]);

  // Helper function to normalize questions
  const normalizeQuestions = (questions) => {
    if (!Array.isArray(questions)) {
      console.error("Questions is not an array:", questions);
      return [];
    }
    
    return questions.map((q, index) => {
      if (!q || typeof q !== 'object') {
        console.error("Invalid question object:", q);
        return null;
      }
      
      // Create base question object
      const normalizedQuestion = {
        id: q.id || `question-${index}`,
        text: typeof q.text === 'string' ? q.text : String(q.text || ''),
        type: q.type || 'text',
      };
      
      // Process options differently based on question type
      if (q.type === 'connect') {
        // For connect questions, preserve the original structure
        normalizedQuestion.options = q.options || [];
        
        // Check for specific connect data format
        if (q.leftItems && q.rightItems) {
          normalizedQuestion.leftItems = q.leftItems;
          normalizedQuestion.rightItems = q.rightItems;
        }
        
        // Check for special connectData format
        if (q.connectData) {
          normalizedQuestion.connectData = q.connectData;
        }
      } 
      else if (q.type === 'grid') {
        // For grid questions, preserve grid-specific data
        normalizedQuestion.options = q.options || [];
        
        if (q.rows && q.columns) {
          normalizedQuestion.rows = q.rows;
          normalizedQuestion.columns = q.columns;
        }
        
        if (q.gridData) {
          normalizedQuestion.gridData = q.gridData;
        }
      }
      else if (q.type === 'swap') {
        // Improved swap question normalization
        console.log("Normalizing swap question:", q);
        
        // Prepare options array
        let swapOptions = [];
        
        // Case 1: If the question has an items array, use that directly
        if (Array.isArray(q.items) && q.items.length > 0) {
          swapOptions = q.items.map((item, i) => {
            if (typeof item === 'object' && item !== null) {
              return item;
            } else {
              return { id: `item-${i}`, text: String(item) };
            }
          });
          normalizedQuestion.items = swapOptions;
        }
        // Case 2: If the question has options, convert them to proper format
        else if (Array.isArray(q.options) && q.options.length > 0) {
          swapOptions = q.options.map((opt, i) => {
            if (typeof opt === 'object' && opt !== null) {
              return opt;
            } else {
              return { id: `item-${i}`, text: String(opt) };
            }
          });
        }
        // Case 3: Try to extract numbers or values from the question text
        else if (q.text) {
          const matches = q.text.match(/\b(\d+|[a-zA-Z]+)\b/g);
          if (matches && matches.length > 0) {
            swapOptions = matches.map((match, i) => ({
              id: `item-${i}`,
              text: match
            }));
          }
        }
        
        // If we still don't have options, create default ones
        if (swapOptions.length === 0) {
          swapOptions = [
            { id: 'item-0', text: '1' },
            { id: 'item-1', text: '2' },
            { id: 'item-2', text: '3' },
            { id: 'item-3', text: '4' }
          ];
        }
        
        normalizedQuestion.options = swapOptions;
        console.log("Normalized swap options:", swapOptions);
      }
      else {
        // For standard questions (text, radio, checkbox), normalize options
        normalizedQuestion.options = Array.isArray(q.options) ? 
          q.options.map(opt => {
            // If option is already an object with text property, keep as is
            if (typeof opt === 'object' && opt !== null) {
              return opt;
            }
            return String(opt || '');
          }) : [];
      }
      
      return normalizedQuestion;
    }).filter(Boolean); // Remove null/undefined entries
  };

  // Handle response change
  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Submit form responses
  const submitForm = async () => {
    if (!form) return;
    
    setIsSubmitting(true);
    try {
      // Prepare response data
      const responseData = {
        formId: form.formId,
        responses: Object.keys(responses).map(questionId => {
          // Find the question to determine type
          const question = form.questions.find(q => q.id === questionId);
          const questionType = question ? question.type : 'text';
          
          // Format answer based on question type
          let answer = responses[questionId];
          
          // For complex types, stringify the data
          if (
            questionType === 'connect' || 
            questionType === 'swap' || 
            questionType === 'grid' || 
            (questionType === 'checkbox' && Array.isArray(answer))
          ) {
            answer = JSON.stringify(answer);
          }
          
          return {
            questionId: questionId,
            answer: answer,
            type: questionType
          };
        })
      };
      
      console.log("Submitting form data:", responseData);
      await submitFormResponse(formId, responseData);
      setSubmitSuccess(true);
      setError(null);
      return true;
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Хариултыг хадгалахад алдаа гарлаа. Дахин оролдоно уу.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    responses,
    loading,
    error,
    isSubmitting,
    submitSuccess,
    handleResponseChange,
    submitForm
  };
};

export default useForm; 