// components/SearchBar.js
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/weatherslice'; 
import { searchCities } from '../services/weatherAPI';
import './SearchBar.css';

const SearchBar = ({ onCitySelect }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector(state => state.weather);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      setError(null);
      
      const delaySearch = setTimeout(async () => {
        try {
          const cities = await searchCities(query);
          setResults(cities);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setError('Failed to search cities');
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(delaySearch);
    } else {
      setResults([]);
      setShowResults(false);
      setIsLoading(false);
    }
  }, [query]);

  const handleCityClick = (city) => {
    setQuery('');
    setShowResults(false);
    onCitySelect(city);
  };

  const toggleFavorite = (city, e) => {
    e.stopPropagation();
    
    const isCurrentlyFavorite = favorites.some(fav => fav.id === city.id);
    if (isCurrentlyFavorite) {
      dispatch(removeFavorite(city.id));
    } else {
      dispatch(addFavorite(city));
    }
  };

  const isFavorite = (cityId) => {
    return favorites.some(fav => fav.id === cityId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-input-container">
        <i className="fas fa-search search-icon" aria-hidden="true"></i>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city, state, or country..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search for cities"
        />
        {query && (
          <button 
            className="clear-search"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        )}
      </div>

      {showResults && (
        <div className="search-results" role="listbox">
          {isLoading && (
            <div className="search-loading">Searching...</div>
          )}
          
          {!isLoading && results.length > 0 && results.map(city => (
            <div
              key={city.id}
              className="search-result-item"
              onClick={() => handleCityClick(city)}
              role="option"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCityClick(city)}
            >
              <div className="city-info">
                <span className="city-name">
                  {city.name}
                  {city.isCapital && <span className="capital-badge">Capital</span>}
                </span>
                <span className="city-details">
                  {city.state && `${city.state}, `}{city.country}
                  {city.isCapital && ` • ${city.state ? 'State' : 'Country'} Capital`}
                </span>
              </div>
              <button
                className={`favorite-btn ${isFavorite(city.id) ? 'favorited' : ''}`}
                onClick={(e) => toggleFavorite(city, e)}
                aria-label={isFavorite(city.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <i 
                  className={`fas ${isFavorite(city.id) ? 'fa-heart' : 'fa-heart'}`}
                  style={{ opacity: isFavorite(city.id) ? 1 : 0.3 }}
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          ))}
          
          {!isLoading && query.length > 2 && results.length === 0 && (
            <div className="no-results">No cities found for "{query}"</div>
          )}
          
          {error && (
            <div className="search-error">{error}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;