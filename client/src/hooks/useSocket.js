import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Create the hook
export const useSocket = (serverUrl) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // For debugging purposes
    console.log('Connecting to socket server at:', serverUrl);
    
    // Make sure we're using the server URL, not the client URL
    const serverURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    
    const socketInstance = io(serverURL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected successfully with ID:', socketInstance.id);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [serverUrl]); // Keep the dependency for react-hooks/exhaustive-deps rule

  return socket;
};

// Also export as default for flexibility
export default useSocket; 