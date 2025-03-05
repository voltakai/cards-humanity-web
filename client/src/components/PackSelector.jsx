import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PackSelector.css';

const PackSelector = ({ onPacksSelected }) => {
  const [packs, setPacks] = useState([]);
  const [selectedPacks, setSelectedPacks] = useState(new Set());
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeThemes, setActiveThemes] = useState(new Set());

  // Fetch available packs
  useEffect(() => {
    const fetchPacks = async () => {
      const response = await fetch('/api/card-packs');
      const data = await response.json();
      setPacks(data);
    };
    fetchPacks();
  }, []);

  // Extract unique themes from packs
  const themes = [...new Set(packs.flatMap(pack => pack.theme_tags))];

  const filteredPacks = packs.filter(pack => {
    const matchesSearch = pack.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'selected' && selectedPacks.has(pack.id)) ||
                         (filter === 'family' && pack.maturity_rating === 'family');
    const matchesThemes = activeThemes.size === 0 || 
                         pack.theme_tags.some(theme => activeThemes.has(theme));
    return matchesSearch && matchesFilter && matchesThemes;
  });

  const handlePackToggle = (packId) => {
    const newSelected = new Set(selectedPacks);
    if (newSelected.has(packId)) {
      newSelected.delete(packId);
    } else {
      newSelected.add(packId);
    }
    setSelectedPacks(newSelected);
    onPacksSelected(Array.from(newSelected));
  };

  const handleThemeToggle = (theme) => {
    const newThemes = new Set(activeThemes);
    if (newThemes.has(theme)) {
      newThemes.delete(theme);
    } else {
      newThemes.add(theme);
    }
    setActiveThemes(newThemes);
  };

  return (
    <div className="pack-selector">
      <div className="pack-selector-header">
        <h2>Select Card Packs</h2>
        <div className="pack-search">
          <input
            type="text"
            placeholder="Search packs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="pack-filters">
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All Packs
          </button>
          <button 
            className={filter === 'selected' ? 'active' : ''} 
            onClick={() => setFilter('selected')}
          >
            Selected
          </button>
          <button 
            className={filter === 'family' ? 'active' : ''} 
            onClick={() => setFilter('family')}
          >
            Family Friendly
          </button>
        </div>

        <div className="theme-tags">
          {themes.map(theme => (
            <motion.button
              key={theme}
              className={`theme-tag ${activeThemes.has(theme) ? 'active' : ''}`}
              onClick={() => handleThemeToggle(theme)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div className="packs-grid" layout>
        <AnimatePresence>
          {filteredPacks.map(pack => (
            <motion.div
              key={pack.id}
              className={`pack-card ${selectedPacks.has(pack.id) ? 'selected' : ''}`}
              onClick={() => handlePackToggle(pack.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              <div className="pack-info">
                <h3>{pack.name}</h3>
                <p>{pack.description}</p>
                <div className="pack-meta">
                  <span className="card-count">{pack.card_count} cards</span>
                  {pack.is_base_pack && (
                    <span className="base-pack-badge">Base Pack</span>
                  )}
                  <span className={`rating-badge ${pack.maturity_rating}`}>
                    {pack.maturity_rating}
                  </span>
                </div>
                <div className="pack-themes">
                  {pack.theme_tags.map(theme => (
                    <span key={theme} className="theme-badge">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="pack-selection-summary">
        <span>{selectedPacks.size} packs selected</span>
        <span>{Array.from(selectedPacks).reduce((total, packId) => 
          total + packs.find(p => p.id === packId).card_count, 0)} total cards
        </span>
      </div>
    </div>
  );
};

export default PackSelector; 