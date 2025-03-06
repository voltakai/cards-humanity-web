import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Export as default
const useSocket = (serverUrl) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create socket connection
    const socketInstance = io(serverUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });

    // Set socket in state
    setSocket(socketInstance);

    // Clean up function
    return () => {
      socketInstance.disconnect();
    };
  }, [serverUrl]);

  return socket;
};

export default useSocket; 