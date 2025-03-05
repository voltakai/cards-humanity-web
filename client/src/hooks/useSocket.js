import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export function useSocket(url) {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(url, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketRef.current.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Attempting to reconnect... (${attemptNumber})`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url]);

  return socketRef.current;
} 