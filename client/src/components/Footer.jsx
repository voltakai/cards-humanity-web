import React from 'react';
import { FaDiscord, FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Created by voltakai</h4>
          <div className="social-links">
            <a 
              href="https://discord.com/users/voltakai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link discord"
            >
              <FaDiscord /> Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 