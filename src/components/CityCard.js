import React from 'react';
import './CityCard.css';

const CityCard = ({ city, weather, loading, onClick }) => {
  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Clear': 'fas fa-sun',
      'Clouds': 'fas fa-cloud',
      'Rain': 'fas fa-cloud-rain',
      'Drizzle': 'fas fa-cloud-drizzle',
      'Thunderstorm': 'fas fa-bolt',
      'Snow': 'fas fa-snowflake',
      'Mist': 'fas fa-smog',
      'Fog': 'fas fa-smog',
      'default': 'fas fa-cloud'
    };
    return iconMap[condition] || iconMap.default;
  };

  if (loading) {
    return (
      <div className="city-card loading">
        <div className="loading-spinner"></div>
        <p>Loading {city.name}...</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="city-card error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>No data for {city.name}</p>
      </div>
    );
  }

  return (
    <div className="city-card" onClick={onClick}>
      <div className="card-header">
        <h3 className="city-name">{city.name}</h3>
        <span className="country">{city.country}</span>
      </div>
      
      <div className="weather-main">
        <div className="temperature">
          {Math.round(weather.main?.temp)}°
        </div>
        <div className="weather-icon">
          <i className={getWeatherIcon(weather.weather?.[0]?.main)}></i>
        </div>
      </div>
      
      <div className="weather-description">
        {weather.weather?.[0]?.description || 'No data'}
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <i className="fas fa-tint"></i>
          <span>{weather.main?.humidity}%</span>
        </div>
        <div className="detail-item">
          <i className="fas fa-wind"></i>
          <span>{Math.round(weather.wind?.speed)} m/s</span>
        </div>
        <div className="detail-item">
          <i className="fas fa-temperature-low"></i>
          <span>{Math.round(weather.main?.feels_like)}°</span>
        </div>
      </div>
    </div>
  );
};

export default CityCard;