import React, { useState, useEffect } from 'react';                              // required things
import './Notification.css';
import { createPortal } from 'react-dom';

function Notification({ message, type = 'info', duration = 5000, onClose, id = Date.now() }) {    // yadiimbee yadiii asboulte bologtsooooooo
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose, id]);

  useEffect(() => {
    // message ymu id oorchlogdoh bolgondon shineer notifi haruuln
    if (message) {
      setVisible(true);
    }
  }, [message, id]);

  if (!message || !visible) return null;

  // createPortal getsn in notificationiig absuluto bolgjogo
  return createPortal(
    <div className={`notification ${type}`} key={id}>
      <div className="message">{message}</div>
      <button className="closeButton" onClick={() => setVisible(false)}>
        ✕
      </button>
    </div>,
    document.body
  );
}

export default Notification; 