import React from 'react';
import './DataFreshnessIndicator.css';

const DataFreshnessIndicator = ({ lastUpdated, isStale }) => {
  if (!lastUpdated) return null;

  return (
    <div className={`freshness-indicator ${isStale ? 'stale' : 'fresh'}`}>
      <i className={`fas ${isStale ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
      <span>{isStale ? 'Data may be outdated' : 'Data is current'}</span>
    </div>
  );
};

export default DataFreshnessIndicator;