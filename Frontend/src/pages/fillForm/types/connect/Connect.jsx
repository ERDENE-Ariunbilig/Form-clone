import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Connect.css';

export default function Connect({ question, value, onChange }) {
  const [connections, setConnections] = useState([]);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const connectionsRef = useRef(null);
  const [lines, setLines] = useState([]);
  const initializedRef = useRef(false);
  
  // Extract items from question
  useEffect(() => {
    if (initializedRef.current && leftItems.length > 0 && rightItems.length > 0) return;
    
    let left = [];
    let right = [];
    
    try {
      // Direct items have highest priority
      if (question.leftItems && Array.isArray(question.leftItems) && question.leftItems.length > 0) {
        left = question.leftItems.map((item, index) => ({
          id: item.id || `left-${index}`,
          text: item.text || String(item || '')
        }));
      } 
      
      if (question.rightItems && Array.isArray(question.rightItems) && question.rightItems.length > 0) {
        right = question.rightItems.map((item, index) => ({
          id: item.id || `right-${index}`,
          text: item.text || String(item || '')
        }));
      }
      
      // If no direct items, try connectOptions
      if (left.length === 0 && 
          question.connectOptions && 
          Array.isArray(question.connectOptions.left) && 
          question.connectOptions.left.length > 0) {
        left = question.connectOptions.left.map((item, index) => ({
          id: item.id || `left-${index}`,
          text: item.text || String(item || '')
        }));
      }
      
      if (right.length === 0 && 
          question.connectOptions && 
          Array.isArray(question.connectOptions.right) && 
          question.connectOptions.right.length > 0) {
        right = question.connectOptions.right.map((item, index) => ({
          id: item.id || `right-${index}`,
          text: item.text || String(item || '')
        }));
      }
      
      // Last resort - hardcoded fallback values
      if (left.length === 0) {
        left = [{ id: 'left-0', text: 'aaa' }, { id: 'left-1', text: 'vvv' }];
      }
      
      if (right.length === 0) {
        right = [{ id: 'right-0', text: 'www' }, { id: 'right-1', text: 'awwwwaxz' }];
      }
      
      console.log("Final connect items loaded:", { left, right });
      setLeftItems(left);
      setRightItems(right);
      
      if (!initializedRef.current && Array.isArray(value)) {
        setConnections(value);
      } else if (!initializedRef.current) {
        onChange([]);
      }
      
      initializedRef.current = true;
    } catch (e) {
      console.error("Error extracting connect items:", e);
    }
  }, [question.id, question.leftItems, question.rightItems]);
  
  // Update connections when value prop changes
  useEffect(() => {
    if (initializedRef.current && Array.isArray(value)) {
      setConnections(value);
    }
  }, [value]);
  
  // Calculate connection zuraaas
  const updateLines = useCallback(() => {
    if (!connectionsRef.current) return;
    
    setTimeout(() => {
      const newLines = [];
      connections.forEach(conn => {
        const leftEl = document.getElementById(`left-item-${conn.left}`);
        const rightEl = document.getElementById(`right-item-${conn.right}`);
        
        if (leftEl && rightEl) {
          const leftRect = leftEl.getBoundingClientRect();
          const rightRect = rightEl.getBoundingClientRect();
          const containerRect = connectionsRef.current.getBoundingClientRect();
          
          newLines.push({
            x1: leftRect.right - containerRect.left,
            y1: leftRect.top + leftRect.height/2 - containerRect.top,
            x2: rightRect.left - containerRect.left,
            y2: rightRect.top + rightRect.height/2 - containerRect.top,
            id: `${conn.left}-${conn.right}`
          });
        }
      });
      
      setLines(newLines);
    }, 100);
  }, [connections]);
  
  // Update lines when dependencies change
  useEffect(() => {
    if (leftItems.length > 0 && rightItems.length > 0 && connections.length > 0) {
      updateLines();
      
      const resizeObserver = new ResizeObserver(updateLines);
      if (connectionsRef.current) {
        resizeObserver.observe(connectionsRef.current);
      }
      
      return () => resizeObserver.disconnect();
    }
  }, [leftItems, rightItems, connections, updateLines]);
  
  const handleLeftSelect = useCallback((e, itemId) => {
    e.preventDefault(); // Prevent form submission
    setSelectedLeft(selectedLeft === itemId ? null : itemId);
  }, [selectedLeft]);
  
  const handleRightSelect = useCallback((e, itemId) => {
    e.preventDefault(); // Prevent form submission
    if (!selectedLeft) return;
    
    const existingIndex = connections.findIndex(c => 
      c.left === selectedLeft && c.right === itemId
    );
    
    let newConnections;
    
    if (existingIndex >= 0) {
      newConnections = [...connections];
      newConnections.splice(existingIndex, 1);
    } else {
      newConnections = [
        ...connections.filter(c => c.left !== selectedLeft),
        { left: selectedLeft, right: itemId }
      ];
    }
    
    setConnections(newConnections);
    onChange(newConnections);
    setSelectedLeft(null);
  }, [selectedLeft, connections, onChange]);
  
  const getConnectedRight = useCallback((leftId) => {
    const connection = connections.find(conn => conn.left === leftId);
    return connection ? connection.right : null;
  }, [connections]);
  
  const isConnected = useCallback((leftId, rightId) => {
    return connections.some(c => c.left === leftId && c.right === rightId);
  }, [connections]);
  
  const removeConnection = useCallback((e, leftId, rightId) => {
    e.preventDefault(); // Prevent form submission
    const newConnections = connections.filter(
      c => !(c.left === leftId && c.right === rightId)
    );
    setConnections(newConnections);
    onChange(newConnections);
  }, [connections, onChange]);
  
  return (
    <div className="connectContainer">
      {question.text && <p className="questionText">{question.text}</p>}
      
      <div className="gridContainer" ref={connectionsRef}>
        <div className="column">
          <h4 className="left">Left Items</h4>
          {leftItems.map(item => {
            const isConnected = getConnectedRight(item.id) !== null;
            const isSelected = selectedLeft === item.id;
            
            return (
              <div key={item.id} className="item" id={`left-item-${item.id}`}>
                <input 
                  type="text" 
                  className="input"
                  value={item.text} 
                  readOnly 
                />
                <button 
                  type="button" // Explicitly set button type
                  className={`button ${isSelected ? 'buttonSelected' : ''}`}
                  onClick={(e) => handleLeftSelect(e, item.id)}
                >
                  Connect →
                </button>
                <button type="button" className="removeButton">
                  ×
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="column">
          <h4 className="right">Right Items</h4>
          {rightItems.map(item => (
            <div key={item.id} className="item" id={`right-item-${item.id}`}>
              <button 
                type="button" // Explicitly set button type
                className="button"
                onClick={(e) => handleRightSelect(e, item.id)}
                disabled={!selectedLeft}
              >
                ← Connect
              </button>
              <input 
                type="text" 
                className="input"
                value={item.text} 
                readOnly 
              />
              <button type="button" className="removeButton">
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="connectionsContainer">
        <h4 className="title">Connections</h4>
        {connections.length === 0 ? (
          <p className="helpText">
            No connections yet. Select an item from the left side, then connect it to an item on the right.
          </p>
        ) : (
          connections.map(conn => {
            const leftItem = leftItems.find(item => item.id === conn.left);
            const rightItem = rightItems.find(item => item.id === conn.right);
            
            if (!leftItem || !rightItem) return null;
            
            return (
              <div 
                key={`${conn.left}-${conn.right}`}
                className="connectionItem"
              >
                <div className="connectionText">{leftItem.text}</div>
                <div className="arrow">↔</div>
                <div className="connectionText">{rightItem.text}</div>
                <button
                  type="button" // Explicitly set button type
                  onClick={(e) => removeConnection(e, conn.left, conn.right)}
                  className="removeButton"
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
