import React from 'react';
import './ConfirmDialog.css';                 // required things

function ConfirmDialog({ 
  isOpen, 
  title = 'Confirm Action', 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="dialog">
        <h3 className="title">{title}</h3>
        <p className="message">{message}</p>
        <div className="actions">
          <button 
            className="button cancelButton" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className="button confirmButton" 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog; 