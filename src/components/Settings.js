import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTemperatureUnit, setTheme } from '../store/weatherslice';
import './Settings.css';

const Settings = ({ onClose }) => {
  const dispatch = useDispatch();
  const { unit, theme } = useSelector(state => state.weather);

  const handleUnitChange = (newUnit) => {
    dispatch(setTemperatureUnit(newUnit));
  };

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
    // Optional: Apply theme immediately to document
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="settings-content">
          <div className="setting-group">
            <h3>Temperature Unit</h3>
            <div className="unit-selector">
              <button 
                className={`unit-btn ${unit === 'celsius' ? 'active' : ''}`}
                onClick={() => handleUnitChange('celsius')}
              >
                °C Celsius
              </button>
              <button 
                className={`unit-btn ${unit === 'fahrenheit' ? 'active' : ''}`}
                onClick={() => handleUnitChange('fahrenheit')}
              >
                °F Fahrenheit
              </button>
            </div>
          </div>

          <div className="setting-group">
            <h3>Theme</h3>
            <div className="theme-selector">
              <button 
                className={`theme-btn ${theme === 'default' ? 'active' : ''}`}
                onClick={() => handleThemeChange('default')}
              >
                <div className="theme-preview default-theme"></div>
                Default
              </button>
              <button 
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <div className="theme-preview light-theme"></div>
                Light
              </button>
              <button 
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <div className="theme-preview dark-theme"></div>
                Dark
              </button>
            </div>
          </div>
          
          <div className="setting-group">
            <h3>About</h3>
            <p>Weather Analytics Dashboard v1.0</p>
            <p>Real-time weather data and forecasts with interactive visualizations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;