import { useState, useEffect } from 'react';
import './Time.css';

export default function Time({ value = '', onChange }) {
  const [selectedTime, setSelectedTime] = useState(value || "");

  useEffect(() => {
    if (value !== selectedTime) {
      setSelectedTime(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSelectedTime(newValue);
    onChange && onChange(newValue);
  };

  return (
    <div className="timeWrapper">
      <label htmlFor="time">Select a time:</label>
      <input
        type="time"
        id="time"
        value={selectedTime}
        onChange={handleChange}
        className="timeInput"
      />
    </div>
  );
}
