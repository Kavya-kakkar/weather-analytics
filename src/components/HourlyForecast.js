import React from 'react';
import { formatTime, getWeatherIcon } from '../utils/helpers';
import './HourlyForecast.css';

const HourlyForecast = ({ hourly, extended = false }) => {
  if (!hourly || hourly.length === 0) {
    return (
      <div className="hourly-forecast">
        <h3>Hourly Forecast</h3>
        <div className="no-data">No hourly data available</div>
      </div>
    );
  }

  const displayHours = extended ? hourly.slice(0, 24) : hourly.slice(0, 12);

  return (
    <div className="hourly-forecast">
      <h3>{extended ? '24-Hour Forecast' : '12-Hour Forecast'}</h3>
      <div className="hourly-scroll">
        {displayHours.map((hour, index) => (
          <div key={index} className="hour-item">
            <div className="hour-time">
              {index === 0 ? 'Now' : formatTime(hour.dt)}
            </div>
            <div className="hour-icon">
              <i className={getWeatherIcon(hour.weather[0].main)}></i>
            </div>
            <div className="hour-temp">
              {Math.round(hour.temp)}°
            </div>
            <div className="hour-precip">
              {Math.round(hour.pop * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;