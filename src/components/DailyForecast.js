import React from 'react';
import { formatDate, getWeatherIcon } from '../utils/helpers';
import './DailyForecast.css';

const DailyForecast = ({ daily }) => {
  if (!daily || daily.length === 0) {
    return (
      <div className="daily-forecast">
        <h3>7-Day Forecast</h3>
        <div className="no-data">No forecast data available</div>
      </div>
    );
  }

  return (
    <div className="daily-forecast">
      <h3>7-Day Forecast</h3>
      <div className="daily-list">
        {daily.slice(0, 7).map((day, index) => (
          <div key={index} className="day-item">
            <div className="day-date">
              {index === 0 ? 'Today' : formatDate(day.dt)}
            </div>
            <div className="day-icon">
              <i className={getWeatherIcon(day.weather[0].main)}></i>
            </div>
            <div className="day-description">
              {day.weather[0].description}
            </div>
            <div className="day-temps">
              <span className="high-temp">{Math.round(day.temp.max)}°</span>
              <span className="low-temp">{Math.round(day.temp.min)}°</span>
            </div>
            <div className="day-details">
              <div className="detail">
                <i className="fas fa-tint"></i>
                {day.humidity}%
              </div>
              <div className="detail">
                <i className="fas fa-wind"></i>
                {Math.round(day.wind_speed)}m/s
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;