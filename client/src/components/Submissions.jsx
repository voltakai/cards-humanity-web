import React from 'react';
import Card from './Card';
import './Submissions.css';

const Submissions = ({ submissions, isCardCzar, onSelect, selectedSubmission }) => {
  return (
    <div className="submissions">
      <h3>Submitted Cards</h3>
      <div className="submissions-grid">
        {submissions.map(submission => (
          <div 
            key={submission.id}
            className={`submission-slot ${
              selectedSubmission?.id === submission.id ? 'selected' : ''
            }`}
          >
            <Card
              type="white"
              content={submission.content}
              onClick={() => isCardCzar && onSelect(submission)}
              selectable={isCardCzar}
              selected={selectedSubmission?.id === submission.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submissions; 