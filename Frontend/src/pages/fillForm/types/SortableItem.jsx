import React from 'react';                          // dnd kit hergtei type uud imoportlon okee
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableItem({ id, children }) {
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
    backgroundColor: isDragging ? '#f4f4f4' : 'white',
    padding: '12px',
    margin: '8px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
    boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.1)' : 'none',
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
    >
      <div className="drag-handle" style={{marginRight: '8px', color: '#aaa'}}>
        ☰
      </div>
      <div>{children}</div>
    </div>
  );
} 