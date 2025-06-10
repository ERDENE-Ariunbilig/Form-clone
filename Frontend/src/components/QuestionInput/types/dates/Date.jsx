import { useState, useEffect } from 'react';
import './Date.css';

export default function Date({ value = '', onChange }) {
  const [selectedDate, setSelectedDate] = useState(value || "");

  useEffect(() => {
    if (value !== selectedDate) {
      setSelectedDate(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSelectedDate(newValue);
    onChange && onChange(newValue);
  };

  return (
    <div className="dateWrapper">
      <label htmlFor="date">Select a date:</label>
      <input
        type="date"
        id="date"
        value={selectedDate}
        onChange={handleChange}
        className="dateInput"
      />
    </div>
  );
}
