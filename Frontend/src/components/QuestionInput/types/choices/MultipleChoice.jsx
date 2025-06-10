import { useState, useEffect } from 'react';
import './MultipleChoice.css';

export default function MultipleChoice({
  options = [],
  onChange,
  onSelect,
  selectedOptionId = null,
}) {
  const [items, setItems] = useState(options || []);
  const [selectedOption, setSelectedOption] = useState(selectedOptionId);

  useEffect(() => {
    if (JSON.stringify(options) !== JSON.stringify(items)) {
      setItems(options);
    }
  }, [options]);
  useEffect(() => {
    setSelectedOption(selectedOptionId);
  }, [selectedOptionId]);
 
  const addOption = () => {
    const newItems = [...items, { id: Date.now(), text: '' }];
    setItems(newItems);
    onChange(newItems);
  };

  const updateOption = (id, text) => {
    const newItems = items.map(item => item.id === id ? { ...item, text } : item);
    setItems(newItems);
    onChange(newItems);
  };

  const removeOption = (id) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    onChange(newItems);

    if (selectedOption === id) {
      setSelectedOption(null);
    }
  };

  const handleSelect = (id) => {
  setSelectedOption(id);
  if (onSelect) {
    const selected = items.find(item => item.id === id);
    onSelect(selected);
  }
};


  return (
    <div className="multipleChoiceWrapper">
      <div className="optionsSection">
        <p className="optionsHint">Add options for users to choose from</p>
        
        {items.map((option, index) => (
          <div key={option.id} className="optionItem">
            <div className="radioIcon">
              <div className="radioCircle"></div>
            </div>
            
            <input
              type="text"
              className="optionInput"
              value={option.text}
              onChange={e => updateOption(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            
            <button 
              className="removeButton"
              onClick={() => removeOption(option.id)}
            >
              ✕
            </button>
          </div>
        ))}
        
        <button className="addButton" onClick={addOption}>
          Add Option
        </button>
      </div>
      
      {items.length > 0 && (
        <div className="previewSection">
          <h4>Preview</h4>
          <div className="optionsPreview">
            {items.map(option => (
              <div key={option.id} className="previewItem">
                <label className="radioLabel">
                  <input
                    type="radio"
                    className="radioInput"
                    name="previewRadio"
                    checked={selectedOption === option.id}
                    onChange={() => handleSelect(option.id)}
                  />
                  <span className="radioLabelText">{option.text || `Untitled Option`}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 