import React, { useState } from 'react';
import { hapticFeedback } from '../utils/mobileUtils';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search expenses...", 
  onClear 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    hapticFeedback.light();
    onChange('');
    if (onClear) onClear();
  };

  const handleFocus = () => {
    hapticFeedback.light();
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`search-container ${isFocused ? 'focused' : ''}`}>
      <div className="search-icon">🔍</div>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {value && (
        <button
          className="search-clear"
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchInput;
