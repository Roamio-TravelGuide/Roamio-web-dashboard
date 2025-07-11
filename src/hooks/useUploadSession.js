// hooks/useUploadSession.js
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useUploadSession() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const storedSession = localStorage.getItem('uploadSession');
    const storedSessionId = storedSession ? JSON.parse(storedSession).id : null;
    
    if (storedSessionId && isValidSessionId(storedSessionId)) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('uploadSession', JSON.stringify({
        id: newSessionId,
        createdAt: new Date().toISOString()
      }));
      setSessionId(newSessionId);
    }

    return () => {
      // Optional: Clear session if form is completed
    };
  }, []);

  return sessionId;
}

function isValidSessionId(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}