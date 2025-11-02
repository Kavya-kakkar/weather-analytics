import React from 'react';
import './WeatherApp.css';

const WeatherApp = () => {
  return (
    <div className="weather-app">
      {/* Search Section */}
      <div className="search-section">
        <input 
          type="text" 
          placeholder="Search for a city, state, or country..." 
          className="search-input"
        />
      </div>
      
      {/* Favorite Cities Section */}
      <div className="favorites-section">
        <h2>Favorite Cities</h2>
        <div className="cities-grid">
          {/* London Card */}
          <div className="city-card">
            <div className="city-header">
              <h3>London</h3>
              <span className="temperature">8°</span>
            </div>
            <div className="weather-info">
              <span className="condition">Broken Clouds</span>
              <div className="details">
                <span>💧 92%</span>
                <span>💨 2 m/s</span>
              </div>
            </div>
          </div>
          
          {/* New York Card */}
          <div className="city-card">
            <div className="city-header">
              <h3>New York</h3>
              <span className="temperature">6°</span>
            </div>
            <div className="weather-info">
              <span className="condition">Clear Sky</span>
              <div className="details">
                <span>💧 67%</span>
                <span>💨 3 m/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Results Section */}
      <div className="results-section">
        <h2>Search Results</h2>
        <div className="cities-grid">
          {/* Delhi Card */}
          <div className="city-card">
            <div className="city-header">
              <h3>Delhi</h3>
              <span className="temperature">29°</span>
            </div>
            <div className="weather-info">
              <span className="condition">Haze</span>
              <div className="details">
                <span>💧 37%</span>
                <span>💨 4 m/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;