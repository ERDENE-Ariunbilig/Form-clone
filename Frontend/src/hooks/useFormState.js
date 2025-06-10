import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

export function useFormState() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '', id: null });
  const [isLoading, setIsLoading] = useState(false);
  const [formLink, setFormLink] = useState('');

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: '', type: 'text', options: [] }
    ]);
  };

  const updateQuestion = (id, updatedQuestion) => {
    setQuestions(
      questions.map(q => q.id === id ? { ...q, ...updatedQuestion } : q)
    );
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const reorderQuestions = (oldIndex, newIndex) => {
    setQuestions((items) => {
      const newOrder = arrayMove(items, oldIndex, newIndex);
      return newOrder;
    });
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setQuestions([]);
  };

  const showNotification = (message, type) => {
    setNotification({
      message,
      type,
      id: Date.now()
    });
  };

  return {
    title, setTitle,
    description, setDescription,
    questions, setQuestions,
    notification, setNotification,
    isLoading, setIsLoading,
    formLink, setFormLink,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    clearForm,
    showNotification
  };
} 