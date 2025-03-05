import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './AdminGameSettings.css';

const AdminGameSettings = () => {
  const [settings, setSettings] = useState({
    gameSettings: {
      maxPlayers: 20,
      minPlayers: 3,
      pointsToWin: 10,
      handSize: 10,
    },
    timeSettings: {
      submissionTime: 60,
      czarSelectionTime: 40,
      roundEndDisplayTime: 10,
      playerIdleTimeout: 180,
      gameStartCountdown: 10,
    },
    moderationSettings: {
      enableProfanityFilter: true,
      enableChatModeration: true,
      maxWarningsBeforeKick: 3,
      autoKickEnabled: true,
      allowRejoinAfterKick: true,
      rejoinCooldown: 300,
    },
    chatSettings: {
      enableChat: true,
      chatCooldown: 3,
      maxMessageLength: 200,
      enableEmojis: true,
      enableGiphy: false,
    },
    defaultPacks: {
      basePackEnabled: true,
      selectedExpansions: [],
      allowCustomCards: false,
      customCardReviewRequired: true,
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      try {
        const response = await fetch('/api/admin/settings/reset', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          fetchSettings();
        }
      } catch (error) {
        console.error('Error resetting settings:', error);
      }
    }
  };

  return (
    <div className="admin-settings">
      <header className="settings-header">
        <h2>Game Settings</h2>
        <div className="header-actions">
          <button 
            className={`edit-button ${isEditing ? 'active' : ''}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Settings'}
          </button>
          {isEditing && (
            <button className="save-button" onClick={handleSave}>
              Save Changes
            </button>
          )}
          <button className="reset-button" onClick={handleReset}>
            Reset to Default
          </button>
        </div>
      </header>

      {savedSuccess && (
        <motion.div 
          className="save-success"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          Settings saved successfully!
        </motion.div>
      )}

      <div className="settings-grid">
        {/* Game Settings Section */}
        <section className="settings-section">
          <h3>Game Settings</h3>
          <div className="settings-group">
            <div className="setting-item">
              <label>Maximum Players</label>
              <input
                type="number"
                value={settings.gameSettings.maxPlayers}
                onChange={(e) => setSettings({
                  ...settings,
                  gameSettings: {
                    ...settings.gameSettings,
                    maxPlayers: parseInt(e.target.value)
                  }
                })}
                disabled={!isEditing}
                min="3"
                max="50"
              />
            </div>
            <div className="setting-item">
              <label>Points to Win</label>
              <input
                type="number"
                value={settings.gameSettings.pointsToWin}
                onChange={(e) => setSettings({
                  ...settings,
                  gameSettings: {
                    ...settings.gameSettings,
                    pointsToWin: parseInt(e.target.value)
                  }
                })}
                disabled={!isEditing}
                min="1"
                max="50"
              />
            </div>
            <div className="setting-item">
              <label>Hand Size</label>
              <input
                type="number"
                value={settings.gameSettings.handSize}
                onChange={(e) => setSettings({
                  ...settings,
                  gameSettings: {
                    ...settings.gameSettings,
                    handSize: parseInt(e.target.value)
                  }
                })}
                disabled={!isEditing}
                min="5"
                max="15"
              />
            </div>
          </div>
        </section>

        {/* Time Settings Section */}
        <section className="settings-section">
          <h3>Time Limits</h3>
          <div className="settings-group">
            <div className="setting-item">
              <label>Submission Time (seconds)</label>
              <input
                type="number"
                value={settings.timeSettings.submissionTime}
                onChange={(e) => setSettings({
                  ...settings,
                  timeSettings: {
                    ...settings.timeSettings,
                    submissionTime: parseInt(e.target.value)
                  }
                })}
                disabled={!isEditing}
                min="30"
                max="180"
              />
            </div>
            <div className="setting-item">
              <label>Card Czar Selection Time (seconds)</label>
              <input
                type="number"
                value={settings.timeSettings.czarSelectionTime}
                onChange={(e) => setSettings({
                  ...settings,
                  timeSettings: {
                    ...settings.timeSettings,
                    czarSelectionTime: parseInt(e.target.value)
                  }
                })}
                disabled={!isEditing}
                min="20"
                max="120"
              />
            </div>
            <div className="setting-item">
              <label>Player Idle Timeout (seconds)</label>
              <input
                type="number"
                value={settings.timeSettings.playerIdleTimeout}
                onChange={(e) => setSettings({
                  ...settings,
                  timeSettings: {
                    ...settings.timeSettings,
                    playerIdleTimeout: parseInt(e.target.value)
                  }
                })}
                disabled={!isEditing}
                min="60"
                max="600"
              />
            </div>
          </div>
        </section>

        {/* Moderation Settings Section */}
        <section className="settings-section">
          <h3>Moderation</h3>
          <div className="settings-group">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.moderationSettings.enableProfanityFilter}
                  onChange={(e) => setSettings({
                    ...settings,
                    moderationSettings: {
                      ...settings.moderationSettings,
                      enableProfanityFilter: e.target.checked
                    }
                  })}
                  disabled={!isEditing}
                />
                Enable Profanity Filter
              </label>
            </div>
            <div className="setting-item">
              <label>Warnings Before Kick</label>
              <input
                type="number"
                value={settings.moderationSettings.maxWarningsBeforeKick}
                onChange={(e) => setSettings({
                  ...settings,
                  moderationSettings: {
                    ...settings.moderationSettings,
                    maxWarningsBeforeKick: parseInt(e.target.value)
                  }
                })}
                disabled={!isEditing}
                min="1"
                max="10"
              />
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.moderationSettings.autoKickEnabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    moderationSettings: {
                      ...settings.moderationSettings,
                      autoKickEnabled: e.target.checked
                    }
                  })}
                  disabled={!isEditing}
                />
                Enable Auto-Kick
              </label>
            </div>
            <div className="setting-item">
              <label>Rejoin Cooldown (seconds)</label>
              <input
                type="number"
                value={settings.moderationSettings.rejoinCooldown}
                onChange={(e) => setSettings({
                  ...settings,
                  moderationSettings: {
                    ...settings.moderationSettings,
                    rejoinCooldown: parseInt(e.target.value)
                  }
                })}
                disabled={!isEditing}
                min="0"
                max="3600"
              />
            </div>
          </div>
        </section>

        {/* Chat Settings Section */}
        <section className="settings-section">
          <h3>Chat Settings</h3>
          <div className="settings-group">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.chatSettings.enableChat}
                  onChange={(e) => setSettings({
                    ...settings,
                    chatSettings: {
                      ...settings.chatSettings,
                      enableChat: e.target.checked
                    }
                  })}
                  disabled={!isEditing}
                />
                Enable Chat
              </label>
            </div>
            <div className="setting-item">
              <label>Message Cooldown (seconds)</label>
              <input
                type="number"
                value={settings.chatSettings.chatCooldown}
                onChange={(e) => setSettings({
                  ...settings,
                  chatSettings: {
                    ...settings.chatSettings,
                    chatCooldown: parseInt(e.target.value)
                  }
                })}
                disabled={!isEditing}
                min="0"
                max="30"
              />
            </div>
            <div className="setting-item">
              <label>Max Message Length</label>
              <input
                type="number"
                value={settings.chatSettings.maxMessageLength}
                onChange={(e) => setSettings({
                  ...settings,
                  chatSettings: {
                    ...settings.chatSettings,
                    maxMessageLength: parseInt(e.target.value)
                  }
                })}
                disabled={!isEditing}
                min="50"
                max="500"
              />
            </div>
          </div>
        </section>

        {/* Default Card Packs Section */}
        <section className="settings-section">
          <h3>Default Card Packs</h3>
          <div className="settings-group">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.defaultPacks.basePackEnabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    defaultPacks: {
                      ...settings.defaultPacks,
                      basePackEnabled: e.target.checked
                    }
                  })}
                  disabled={!isEditing}
                />
                Enable Base Pack
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.defaultPacks.allowCustomCards}
                  onChange={(e) => setSettings({
                    ...settings,
                    defaultPacks: {
                      ...settings.defaultPacks,
                      allowCustomCards: e.target.checked
                    }
                  })}
                  disabled={!isEditing}
                />
                Allow Custom Cards
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.defaultPacks.customCardReviewRequired}
                  onChange={(e) => setSettings({
                    ...settings,
                    defaultPacks: {
                      ...settings.defaultPacks,
                      customCardReviewRequired: e.target.checked
                    }
                  })}
                  disabled={!isEditing}
                />
                Require Review for Custom Cards
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminGameSettings; 