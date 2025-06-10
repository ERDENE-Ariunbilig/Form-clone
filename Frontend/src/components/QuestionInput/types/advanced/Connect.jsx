import { useState, useEffect } from 'react';
import './Connect.css';

export default function Connect({ options = {left: [], right: []}, onChange }) {
  const [leftOptions, setLeftOptions] = useState(options.left || []);
  const [rightOptions, setRightOptions] = useState(options.right || []);
  const [connections, setConnections] = useState(options.connections || []);
  const [activeConnection, setActiveConnection] = useState(null);
  
  useEffect(() => {
    if (JSON.stringify(options.left) !== JSON.stringify(leftOptions)) {
      setLeftOptions(options.left || []);
    }
    if (JSON.stringify(options.right) !== JSON.stringify(rightOptions)) {
      setRightOptions(options.right || []);
    }
    if (JSON.stringify(options.connections) !== JSON.stringify(connections)) {
      setConnections(options.connections || []);
    }
  }, [options]);
  
  const addLeftOption = () => {
    const newOptions = [...leftOptions, { id: Date.now(), text: '' }];
    setLeftOptions(newOptions);
    onChange({ left: newOptions, right: rightOptions, connections });
  };
  
  const addRightOption = () => {
    const newOptions = [...rightOptions, { id: Date.now(), text: '' }];
    setRightOptions(newOptions);
    onChange({ left: leftOptions, right: newOptions, connections });
  };
  
  const updateLeftOption = (id, text) => {
    const newOptions = leftOptions.map(opt => opt.id === id ? { ...opt, text } : opt);
    setLeftOptions(newOptions);
    onChange({ left: newOptions, right: rightOptions, connections });
  };
  
  const updateRightOption = (id, text) => {
    const newOptions = rightOptions.map(opt => opt.id === id ? { ...opt, text } : opt);
    setRightOptions(newOptions);
    onChange({ left: leftOptions, right: newOptions, connections });
  };
  
  const removeLeftOption = (id) => {
    const newOptions = leftOptions.filter(opt => opt.id !== id);
    const newConnections = connections.filter(conn => conn.leftId !== id);
    setLeftOptions(newOptions);
    setConnections(newConnections);
    onChange({ left: newOptions, right: rightOptions, connections: newConnections });
  };
  
  const removeRightOption = (id) => {
    const newOptions = rightOptions.filter(opt => opt.id !== id);
    const newConnections = connections.filter(conn => conn.rightId !== id);
    setRightOptions(newOptions);
    setConnections(newConnections);
    onChange({ left: leftOptions, right: newOptions, connections: newConnections });
  };
  


  {/* aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */}
  

  
  const startConnection = (leftId) => {
    setActiveConnection({ leftId });
  };
  
  const completeConnection = (rightId) => {
    if (activeConnection) {
      const newConnection = { 
        id: Date.now(), 
        leftId: activeConnection.leftId, 
        rightId 
      };
      
      // Check if this connection already exists
      const existingConnection = connections.find(
        conn => conn.leftId === activeConnection.leftId && conn.rightId === rightId
      );
      
      if (!existingConnection) {
        // Remove any existing connection from this left item
        const filteredConnections = connections.filter(
          conn => conn.leftId !== activeConnection.leftId
        );
        
        const newConnections = [...filteredConnections, newConnection];
        setConnections(newConnections);
        onChange({ left: leftOptions, right: rightOptions, connections: newConnections });
      }
      
      setActiveConnection(null);
    }
  };
  
  const removeConnection = (connectionId) => {
    const newConnections = connections.filter(conn => conn.id !== connectionId);
    setConnections(newConnections);
    onChange({ left: leftOptions, right: rightOptions, connections: newConnections });
  };
  
  // Find a connection for a left option
  const getConnectionForLeft = (leftId) => {
    return connections.find(conn => conn.leftId === leftId);
  };
  
  return (
    <div className="connectWrapper">
      <div className="connectColumns">
        <div className="connectColumn">
          <h4>Left Items</h4>
          {leftOptions.map(option => (
            <div key={option.id} className="connectItem">
              <input
                type="text"
                className="connectInput"
                value={option.text}
                onChange={(e) => updateLeftOption(option.id, e.target.value)}
                placeholder="Left item"
              />
              <button 
                className="connectButton"
                onClick={() => startConnection(option.id)}
                disabled={activeConnection !== null}
              >
                Connect →
              </button>
              <button 
                className="removeButton"
                onClick={() => removeLeftOption(option.id)}
              >
                ✕
              </button>
            </div>
          ))}
          <button className="addButton" onClick={addLeftOption}>
            Add Left Item
          </button>
        </div>
        
        <div className="connectColumn">
          <h4>Right Items</h4>
          {rightOptions.map(option => (
            <div key={option.id} className="connectItem">
              <button 
                className="connectButton"
                onClick={() => completeConnection(option.id)}
                disabled={activeConnection === null}
              >
                ← Connect
              </button>
              <input
                type="text"
                className="connectInput"
                value={option.text}
                onChange={(e) => updateRightOption(option.id, e.target.value)}
                placeholder="Right item"
              />
              <button 
                className="removeButton"
                onClick={() => removeRightOption(option.id)}
              >
                ✕
              </button>
            </div>
          ))}
          <button className="addButton" onClick={addRightOption}>
            Add Right Item
          </button>
        </div>
      </div>
      
      <div className="connectionsPreview">
        <h4>Connections</h4>
        {connections.length > 0 ? (
          <div className="connectionsList">
            {connections.map(conn => {
              const leftOption = leftOptions.find(opt => opt.id === conn.leftId);
              const rightOption = rightOptions.find(opt => opt.id === conn.rightId);
              
              if (!leftOption || !rightOption) return null;
              
              return (
                <div key={conn.id} className="connectionItem">
                  <span className="connectionText">{leftOption.text || 'Untitled'}</span>
                  <span className="connectionArrow">↔</span>
                  <span className="connectionText">{rightOption.text || 'Untitled'}</span>
                  <button 
                    className="removeConnectionButton"
                    onClick={() => removeConnection(conn.id)}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="noConnections">No connections yet. Connect items by clicking the connect buttons.</p>
        )}
      </div>
    </div>
  );
}
