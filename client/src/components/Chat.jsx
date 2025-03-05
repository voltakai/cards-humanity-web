import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import './Chat.css';

const Chat = ({ gameId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('chatMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('messageDeleted', (messageId) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    });

    return () => {
      socket.off('chatMessage');
      socket.off('messageDeleted');
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit('sendMessage', {
      gameId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    });

    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <span className="username">{msg.username}:</span>
            <span className="content">{msg.content}</span>
            <span className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          maxLength={200}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat; 