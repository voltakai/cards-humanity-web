import React from 'react';
import './Card.css';

const Card = ({ type, content, onClick, disabled }) => {
  return (
    <div 
      className={`card ${type} ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? null : onClick}
    >
      <div className="card-content">
        {content}
      </div>
    </div>
  );
};

export default Card; 