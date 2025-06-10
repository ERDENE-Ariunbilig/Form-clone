import React, { useState } from 'react';
import './FormTitle.css';

function FormTitle({ title, description, onTitleChange, onDescriptionChange }) {
  return (
    <div className="formTitle">
      <input
        type="text"
        className="titleInput"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)} // changeljaga funcn shuu
        placeholder="Title"
      />
      <input
        type="text"
        className="descriptionInput"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)} // changeljaga funcn shuu
        placeholder="Description"
      />
    </div>
  );
}

export default FormTitle; 