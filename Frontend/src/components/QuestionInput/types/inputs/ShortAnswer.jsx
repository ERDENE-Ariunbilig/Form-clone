import { useState, useEffect } from 'react';
import './ShortAnswer.css';

export default function ShortAnswer({ value = '', onChange }) {
  const [text, setText] = useState(value || "");

  useEffect(() => {
    if (value !== text) {
      setText(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setText(newValue);
    onChange && onChange(newValue);
  };

  return (
    <div className="shortAnswerWrapper">
      <p className="shortAnswerHint">Users will be able to enter a text response</p>
      <div className="shortAnswerPreview">
        <input
          type="text"
          className="shortAnswerInput"
          placeholder="Text answer"
          value={text}
          onChange={handleChange}
        />
      </div>
    </div>
  );
} 