import React from 'react';
import './WeatherStats.css';

const WeatherStats = ({ data }) => {
  if (!data) return null;

  // Wind direction function
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const stats = [
    { icon: 'fas fa-thermometer-half', label: 'Feels Like', value: `${Math.round(data.feels_like)}°` },
    { icon: 'fas fa-tachometer-alt', label: 'Pressure', value: `${data.pressure} hPa` },
    { 
      icon: 'fas fa-wind', 
      label: 'Wind', 
      value: (
        <div className="wind-info">
          <span>{Math.round(data.wind_speed)} m/s</span>
          {data.wind_deg && (
            <div className="wind-direction">
              <i 
                className="fas fa-location-arrow" 
                style={{ transform: `rotate(${data.wind_deg}deg)` }}
              ></i>
              <span>{getWindDirection(data.wind_deg)}</span>
            </div>
          )}
        </div>
      ) 
    },
    { icon: 'fas fa-compass', label: 'Wind Direction', value: data.wind_deg ? `${getWindDirection(data.wind_deg)} (${data.wind_deg}°)` : 'N/A' },
    { icon: 'fas fa-eye', label: 'Visibility', value: `${(data.visibility / 1000).toFixed(1)} km` },
    { icon: 'fas fa-sun', label: 'UV Index', value: data.uvi || 'N/A' },
    { icon: 'fas fa-cloud-rain', label: 'Cloudiness', value: `${data.clouds}%` },
    { icon: 'fas fa-temperature-high', label: 'Dew Point', value: `${Math.round(data.dew_point)}°` },
  ];

  return (
    <div className="weather-stats">
      <h3>Weather Details</h3>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-icon">
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherStats;