import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ onCitySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [favoriteCities, setFavoriteCities] = useState(() => {
    const saved = localStorage.getItem('favoriteCities');
    return saved ? JSON.parse(saved) : [];
  });

  // Replace with your actual OpenWeatherMap API key
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResult(null);
      setIsSearching(false);
      setError('');
      return;
    }

    // Only search when user stops typing for 500ms
    clearTimeout(handleSearch.timeout);
    handleSearch.timeout = setTimeout(() => {
      performSearch(query);
    }, 500);
  };

  const performSearch = async (query) => {
    setIsSearching(true);
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${API_URL}?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      
      // Transform API data to our format
      const cityData = {
        id: data.id,
        name: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        icon: data.weather[0].icon
      };
      
      setSearchResult(cityData);
      setError('');
    } catch (err) {
      setSearchResult(null);
      setError('City not found. Please check the spelling and try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityClick = (city) => {
    onCitySelect(city);
  };

  const addToFavorites = (city) => {
    const updatedFavorites = [...favoriteCities, city];
    setFavoriteCities(updatedFavorites);
    localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="dashboard">
      <div className="weather-analytics">
        {/* Search Section */}
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search for any city, state, or country worldwide..." 
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
          {loading && <div className="loading">Searching...</div>}
          {error && <div className="error-message">{error}</div>}
        </div>
        
        {/* Show search result */}
        {isSearching && searchResult && !loading && (
          <div className="search-result-section">
            <h2>Weather in {searchResult.name}, {searchResult.country}</h2>
            <div 
              className="city-card main-result"
              onClick={() => handleCityClick(searchResult)}
            >
              <div className="city-header">
                <h3>{searchResult.name}, {searchResult.country}</h3>
                <span className="temperature">{searchResult.temp}°C</span>
              </div>
              <div className="weather-info">
                <div className="condition-row">
                  <span className="condition">{searchResult.condition}</span>
                  {searchResult.icon && (
                    <img 
                      src={`https://openweathermap.org/img/wn/${searchResult.icon}.png`} 
                      alt={searchResult.condition}
                      className="weather-icon"
                    />
                  )}
                </div>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="label">Feels like:</span>
                    <span className="value">{searchResult.feels_like}°C</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Humidity:</span>
                    <span className="value">{searchResult.humidity}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Wind:</span>
                    <span className="value">{searchResult.windSpeed} m/s</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Pressure:</span>
                    <span className="value">{searchResult.pressure} hPa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show favorite cities ONLY when not searching */}
        {!isSearching && searchQuery.trim() === '' && (
          <div className="favorites-section">
            <h2>Favorite Cities</h2>
            <div className="cities-grid">
              {/* You can keep sample favorites or remove this section */}
              <div className="instruction-card">
                <h3>Start Searching</h3>
                <p>Enter any city name above to see real-time weather data from around the world!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;