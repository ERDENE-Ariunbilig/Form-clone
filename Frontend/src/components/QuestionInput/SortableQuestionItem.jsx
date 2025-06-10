import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import QuestionInput from './QuestionInput';
import styles from './SortableQuestionItem.module.css';

function SortableQuestionItem({ id, question, onQuestionChange, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={styles.sortableItem}
    >
      <div className={styles.questionContent}>
        <QuestionInput
          id={id}
          question={question}
          onQuestionChange={onQuestionChange}
          onDelete={onDelete}
          dragHandle={
            <div className={styles.dragHandle} {...attributes} {...listeners}>
              :::
            </div>
          }
        />
      </div>
    </div>
  );
}

export default SortableQuestionItem; 