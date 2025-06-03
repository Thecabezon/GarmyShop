import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function IconsComponent() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate(); // 👈 Importante

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSearchVisible(false);
      }
    };

    if (searchVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchVisible]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/buscar?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchVisible(false);
      setSearchTerm('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setSearchVisible(false);
      setSearchTerm('');
    }
  };

  return (
    <div className="icons-container" ref={containerRef}>
      <div className="icons">
        <div className="search-icon-wrapper">
          <i 
            className={`bi bi-search search-icon ${searchVisible ? 'active' : ''}`} 
            onClick={toggleSearch}
          ></i>
          <div className={`search-container ${searchVisible ? 'visible' : ''}`}>
            <div className="search-input-wrapper">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="¿Qué estás buscando?"
                className="search-input"
              />
              <button 
                className="search-button" 
                onClick={handleSearch}
                disabled={!searchTerm.trim()}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
            <button className="close-button" onClick={toggleSearch}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        <i className="bi bi-person icon"></i>
        <i className="bi bi-heart icon"></i>
        <div className="cart-wrapper">
          <i className="bi bi-cart icon"></i>
          <span className="cart-badge">0</span>
        </div>
      </div>
    </div>
  );
}

export default IconsComponent;
