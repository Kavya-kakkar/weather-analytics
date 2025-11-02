import React, { useState, useEffect } from 'react';
import './CityDetail.css';

const CityDetail = ({ city, onBack }) => {
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Replace with your actual API key
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    if (city) {
      fetchWeatherDetails();
    }
  }, [city]);

  const fetchWeatherDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather data for the specific city
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Failed to fetch current weather');
      }
      
      const currentData = await currentResponse.json();
      
      // Transform current weather data
      const transformedCurrentData = {
        name: currentData.name,
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        condition: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        pressure: currentData.main.pressure,
        visibility: (currentData.visibility / 1000).toFixed(1),
        icon: currentData.weather[0].icon
      };
      
      setCurrentWeather(transformedCurrentData);

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&appid=${API_KEY}&units=metric`
      );
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        
        // Process hourly forecast (next 24 hours)
        const next24Hours = forecastData.list.slice(0, 8);
        setHourlyForecast(next24Hours);
        
        // Process daily forecast (next 5 days)
        const dailyData = processDailyForecast(forecastData.list);
        setDailyForecast(dailyData);
      }
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processDailyForecast = (list) => {
    const daily = {};
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!daily[date]) {
        daily[date] = {
          date: date,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          condition: item.weather[0].description,
          icon: item.weather[0].icon
        };
      } else {
        daily[date].temp_min = Math.min(daily[date].temp_min, item.main.temp_min);
        daily[date].temp_max = Math.max(daily[date].temp_max, item.main.temp_max);
      }
    });
    return Object.values(daily).slice(0, 5);
  };

  const formatTime = (dt_txt) => {
    return new Date(dt_txt).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Use current weather data if available, otherwise use passed city data as fallback
  const displayData = currentWeather || city;

  if (loading) {
    return (
      <div className="city-detail">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div className="loading">Loading detailed forecast for {city.name}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="city-detail">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchWeatherDetails} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="city-detail">
      {/* Header */}
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h1>{displayData.name} Weather Details</h1>
      </div>

      {/* Current Weather */}
      <div className="current-weather">
        <div className="current-main">
          <div className="current-temp">
            <span className="temp">{displayData.temp}°C</span>
            <span className="feels-like">Feels like {displayData.feels_like}°C</span>
          </div>
          <div className="current-condition">
            <img 
              src={`https://openweathermap.org/img/wn/${displayData.icon}@2x.png`} 
              alt={displayData.condition}
            />
            <span className="condition-text">{displayData.condition}</span>
          </div>
        </div>
        <div className="current-details">
          <div className="detail-item">
            <span className="label">Humidity</span>
            <span className="value">{displayData.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Wind Speed</span>
            <span className="value">{displayData.windSpeed} m/s</span>
          </div>
          <div className="detail-item">
            <span className="label">Pressure</span>
            <span className="value">{displayData.pressure} hPa</span>
          </div>
          <div className="detail-item">
            <span className="label">Visibility</span>
            <span className="value">{displayData.visibility} km</span>
          </div>
        </div>
      </div>

      {/* Hourly Forecast Chart */}
      <div className="forecast-section">
        <h2>24-Hour Forecast</h2>
        <div className="hourly-forecast">
          {hourlyForecast.map((hour, index) => (
            <div key={index} className="hour-item">
              <span className="time">{formatTime(hour.dt_txt)}</span>
              <img 
                src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} 
                alt={hour.weather[0].description}
                className="hour-icon"
              />
              <span className="hour-temp">{Math.round(hour.main.temp)}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="forecast-section">
        <h2>5-Day Forecast</h2>
        <div className="daily-forecast">
          {dailyForecast.map((day, index) => (
            <div key={index} className="day-item">
              <span className="day-date">{formatDate(day.date)}</span>
              <img 
                src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                alt={day.condition}
                className="day-icon"
              />
              <span className="day-condition">{day.condition}</span>
              <div className="day-temps">
                <span className="temp-max">{Math.round(day.temp_max)}°</span>
                <span className="temp-min">{Math.round(day.temp_min)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="forecast-section">
        <h2>Temperature Trends</h2>
        <div className="temperature-chart">
          {hourlyForecast.slice(0, 6).map((hour, index) => (
            <div key={index} className="chart-bar-container">
              <div className="chart-time">{formatTime(hour.dt_txt)}</div>
              <div className="chart-bar-wrapper">
                <div 
                  className="chart-bar"
                  style={{ height: `${(Math.round(hour.main.temp) + 10) * 3}px` }}
                ></div>
              </div>
              <div className="chart-temp">{Math.round(hour.main.temp)}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityDetail;