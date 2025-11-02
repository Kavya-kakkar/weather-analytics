// components/SearchBar.js
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/weatherslice'; // Fixed import
import { searchCities } from '../services/weatherAPI';
import './SearchBar.css';

const SearchBar = ({ onCitySelect }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector(state => state.weather);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
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
      const delaySearch = setTimeout(async () => {
        try {
          const cities = await searchCities(query);
          setResults(cities);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        }
      }, 300);

      return () => clearTimeout(delaySearch);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const handleCityClick = (city) => {
    setQuery('');
    setShowResults(false);
    onCitySelect(city);
  };

  const toggleFavorite = (city, e) => {
    e.stopPropagation();
    
    const isFavorite = favorites.some(fav => fav.id === city.id);
    if (isFavorite) {
      dispatch(removeFavorite(city.id));
    } else {
      dispatch(addFavorite(city));
    }
  };

  const isFavorite = (cityId) => {
    return favorites.some(fav => fav.id === cityId);
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-input-container">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city, state, or country..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
        {query && (
          <button 
            className="clear-search"
            onClick={() => setQuery('')}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map(city => (
  <div
    key={city.id}
    className="search-result-item"
    onClick={() => handleCityClick(city)}
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
    >
      <i className={`fas ${isFavorite(city.id) ? 'fa-heart' : 'fa-heart'}`}></i>
    </button>
  </div>
))}
        </div>
      )}

      {showResults && query.length > 2 && results.length === 0 && (
        <div className="search-results">
          <div className="no-results">No cities found for "{query}"</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;