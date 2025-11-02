import React, { useState } from 'react';
import './DateRangeSelector.css';

const DateRangeSelector = ({ onRangeChange, selectedRange = '7d' }) => {
  const [activeRange, setActiveRange] = useState(selectedRange);

  const ranges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '14d', label: '14 Days' },
    { value: '30d', label: '30 Days' }
  ];

  const handleRangeClick = (range) => {
    setActiveRange(range);
    onRangeChange(range);
  };

  return (
    <div className="date-range-selector">
      <h4>Time Range</h4>
      <div className="range-buttons">
        {ranges.map(range => (
          <button
            key={range.value}
            className={`range-btn ${activeRange === range.value ? 'active' : ''}`}
            onClick={() => handleRangeClick(range.value)}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateRangeSelector;