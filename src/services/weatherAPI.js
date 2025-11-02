import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'http://api.openweathermap.org/geo/1.0';

const log = (...args) => {
  if(process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};
// Enhanced global search for cities, states, and countries
export const searchCities = async (query) => {
  console.log('Searching globally for:', query);

  try {
    const response = await fetch(
       `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${demo_key}&units=metric`
    );
     if (response.ok) {
      const data = await response.json();
      log('API Search results:', data);
      return data;
    }
  } catch (error) {
    console.error('Weather API error:', error);
  };
 
  if (!API_KEY || API_KEY === 'REACT_APP_WEATHER_API_KEY') {
    // Use enhanced mock data for demo
    return getEnhancedMockCities(query);
  }

  try {
    // First try direct city search
    const cityResponse = await axios.get(
      `${GEO_URL}/direct?q=${query}&limit=10&appid=${API_KEY}`
    );
    
    // If no cities found, try state/country search
    if (cityResponse.data.length === 0) {
      return await searchStatesAndCountries(query);
    }
    
    console.log('API Search results:', cityResponse.data);
    
    return cityResponse.data.map(city => ({
      id: `${city.name}-${city.country}-${city.lat}-${city.lon}`.replace(/[^a-zA-Z0-9-]/g, ''),
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    // Fallback to enhanced mock data
    return getEnhancedMockCities(query);
  }
};

// Search for states and countries by returning their capital/major cities
const searchStatesAndCountries = async (query) => {
  try {
    // For states/countries, return their capital or major cities
    const stateCountryMap = {
      // Indian States
      'maharashtra': { name: 'Mumbai', lat: 19.0760, lon: 72.8777, country: 'IN', state: 'Maharashtra' },
      'delhi': { name: 'New Delhi', lat: 28.6139, lon: 77.2090, country: 'IN', state: 'Delhi' },
      'karnataka': { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, country: 'IN', state: 'Karnataka' },
      'tamil nadu': { name: 'Chennai', lat: 13.0827, lon: 80.2707, country: 'IN', state: 'Tamil Nadu' },
      'kerala': { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366, country: 'IN', state: 'Kerala' },
      'gujarat': { name: 'Gandhinagar', lat: 23.2156, lon: 72.6369, country: 'IN', state: 'Gujarat' },
      'rajasthan': { name: 'Jaipur', lat: 26.9124, lon: 75.7873, country: 'IN', state: 'Rajasthan' },
      'punjab': { name: 'Chandigarh', lat: 30.7333, lon: 76.7794, country: 'IN', state: 'Punjab' },
      'west bengal': { name: 'Kolkata', lat: 22.5726, lon: 88.3639, country: 'IN', state: 'West Bengal' },
      'uttar pradesh': { name: 'Lucknow', lat: 26.8467, lon: 80.9462, country: 'IN', state: 'Uttar Pradesh' },
      
      // Countries and their capitals
      'india': { name: 'New Delhi', lat: 28.6139, lon: 77.2090, country: 'IN', state: 'Delhi' },
      'usa': { name: 'Washington DC', lat: 38.9072, lon: -77.0369, country: 'US', state: 'District of Columbia' },
      'united states': { name: 'Washington DC', lat: 38.9072, lon: -77.0369, country: 'US', state: 'District of Columbia' },
      'canada': { name: 'Ottawa', lat: 45.4215, lon: -75.6972, country: 'CA', state: 'Ontario' },
      'australia': { name: 'Canberra', lat: -35.2809, lon: 149.1300, country: 'AU', state: 'ACT' },
      'uk': { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB', state: 'England' },
      'united kingdom': { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB', state: 'England' },
      'germany': { name: 'Berlin', lat: 52.5200, lon: 13.4050, country: 'DE', state: 'Berlin' },
      'france': { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'FR', state: 'Paris' },
      'japan': { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'JP', state: 'Tokyo' },
      'china': { name: 'Beijing', lat: 39.9042, lon: 116.4074, country: 'CN', state: 'Beijing' },
      'brazil': { name: 'Brasília', lat: -15.7975, lon: -47.8919, country: 'BR', state: 'Federal District' },
      'russia': { name: 'Moscow', lat: 55.7558, lon: 37.6173, country: 'RU', state: 'Moscow' },
      'mexico': { name: 'Mexico City', lat: 19.4326, lon: -99.1332, country: 'MX', state: 'CDMX' },
      
      // US States
      'california': { name: 'Sacramento', lat: 38.5816, lon: -121.4944, country: 'US', state: 'California' },
      'texas': { name: 'Austin', lat: 30.2672, lon: -97.7431, country: 'US', state: 'Texas' },
      'florida': { name: 'Tallahassee', lat: 30.4383, lon: -84.2807, country: 'US', state: 'Florida' },
      'new york': { name: 'Albany', lat: 42.6526, lon: -73.7562, country: 'US', state: 'New York' },
      'illinois': { name: 'Springfield', lat: 39.7817, lon: -89.6501, country: 'US', state: 'Illinois' },
    };

    const searchTerm = query.toLowerCase().trim();
    const matchedLocation = stateCountryMap[searchTerm];
    
    if (matchedLocation) {
      return [{
        id: `${matchedLocation.name}-${matchedLocation.country}`.replace(/[^a-zA-Z0-9-]/g, ''),
        name: matchedLocation.name,
        country: matchedLocation.country,
        state: matchedLocation.state,
        lat: matchedLocation.lat,
        lon: matchedLocation.lon,
        isCapital: true
      }];
    }
    
    return [];
  } catch (error) {
    console.error('Error searching states/countries:', error);
    return [];
  }
};

// Enhanced mock data with states and countries
const getEnhancedMockCities = (query) => {
  const globalLocations = [
    // Indian States (Capitals)
    { id: 'mumbai-maharashtra', name: 'Mumbai', country: 'IN', state: 'Maharashtra', lat: 19.0760, lon: 72.8777, isCapital: true },
    { id: 'new-delhi-delhi', name: 'New Delhi', country: 'IN', state: 'Delhi', lat: 28.6139, lon: 77.2090, isCapital: true },
    { id: 'bengaluru-karnataka', name: 'Bengaluru', country: 'IN', state: 'Karnataka', lat: 12.9716, lon: 77.5946, isCapital: true },
    { id: 'chennai-tamilnadu', name: 'Chennai', country: 'IN', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, isCapital: true },
    { id: 'thiruvananthapuram-kerala', name: 'Thiruvananthapuram', country: 'IN', state: 'Kerala', lat: 8.5241, lon: 76.9366, isCapital: true },
    
    // Country Capitals
    { id: 'washington-usa', name: 'Washington DC', country: 'US', state: 'District of Columbia', lat: 38.9072, lon: -77.0369, isCapital: true },
    { id: 'ottawa-canada', name: 'Ottawa', country: 'CA', state: 'Ontario', lat: 45.4215, lon: -75.6972, isCapital: true },
    { id: 'london-uk', name: 'London', country: 'GB', state: 'England', lat: 51.5074, lon: -0.1278, isCapital: true },
    { id: 'tokyo-japan', name: 'Tokyo', country: 'JP', state: 'Tokyo', lat: 35.6762, lon: 139.6503, isCapital: true },
    { id: 'beijing-china', name: 'Beijing', country: 'CN', state: 'Beijing', lat: 39.9042, lon: 116.4074, isCapital: true },
    
    // Major Cities
    { id: '5128581', name: 'New York', country: 'US', state: 'NY', lat: 40.7128, lon: -74.0060 },
    { id: '5368361', name: 'Los Angeles', country: 'US', state: 'CA', lat: 34.0522, lon: -118.2437 },
    { id: '1850147', name: 'Tokyo', country: 'JP', state: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { id: '2643743', name: 'London', country: 'GB', state: 'England', lat: 51.5074, lon: -0.1278 },
    { id: '2988507', name: 'Paris', country: 'FR', state: 'Paris', lat: 48.8566, lon: 2.3522 },
  ];

  if (!query || query.length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase();
  
  // Enhanced search: match name, state, country, or partial matches
  const results = globalLocations.filter(location => 
    location.name.toLowerCase().includes(searchTerm) ||
    (location.state && location.state.toLowerCase().includes(searchTerm)) ||
    location.country.toLowerCase().includes(searchTerm) ||
    (location.isCapital && getStateFromQuery(searchTerm) === location.state?.toLowerCase()) ||
    (location.isCapital && getCountryFromQuery(searchTerm) === location.country.toLowerCase())
  );

  console.log('Enhanced search results:', results);
  return results;
};

// Helper functions for state/country matching
const getStateFromQuery = (query) => {
  const stateMap = {
    'maharashtra': 'maharashtra',
    'delhi': 'delhi', 
    'karnataka': 'karnataka',
    'tamil nadu': 'tamil nadu',
    'tamilnadu': 'tamil nadu',
    'kerala': 'kerala',
    'gujarat': 'gujarat',
    'rajasthan': 'rajasthan',
    'punjab': 'punjab',
    'west bengal': 'west bengal',
    'uttar pradesh': 'uttar pradesh',
    'california': 'california',
    'texas': 'texas',
    'florida': 'florida',
    'new york': 'new york',
    'illinois': 'illinois'
  };
  return stateMap[query];
};

const getCountryFromQuery = (query) => {
  const countryMap = {
    'india': 'in',
    'usa': 'us',
    'united states': 'us',
    'canada': 'ca',
    'australia': 'au',
    'uk': 'gb',
    'united kingdom': 'gb',
    'germany': 'de',
    'france': 'fr',
    'japan': 'jp',
    'china': 'cn',
    'brazil': 'br',
    'russia': 'ru',
    'mexico': 'mx'
  };
  return countryMap[query];
};

// ... keep the existing getCurrentWeather, getForecast, and other functions the same
export const getCurrentWeather = async (lat, lon, cityName = 'Unknown City') => {
  console.log('Fetching weather for:', lat, lon, cityName);
  
  if (!API_KEY || API_KEY === 'demo_key') {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateRealisticWeather(lat, lon, cityName);
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return generateRealisticWeather(lat, lon, cityName);
  }
};

export const getForecast = async (lat, lon, cityName = 'Unknown City') => {
  if (!API_KEY || API_KEY === 'demo_key') {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateRealisticForecast(lat, lon, cityName);
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,alerts`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return generateRealisticForecast(lat, lon, cityName);
  }
};

const generateRealisticForecast = (lat, lon, cityName) => {
  const baseTemp = lat > 0 ? 15 : 20;
  const now = Math.floor(Date.now() / 1000);

  return {
    current: {
      temp: baseTemp + (Math.random() * 10 - 5),
      feels_like: baseTemp + (Math.random() * 8 - 4),
      humidity: 50 + Math.random() * 30,
      pressure: 1010 + Math.random() * 20,
      wind_speed: 2 + Math.random() * 10,
      wind_deg: Math.random() * 360,
      weather: [{ main: 'Clear', description: 'clear sky' }],
      visibility: 10000
    },
    hourly: Array.from({ length: 48 }, (_, i) => ({
      dt: now + i * 3600,
      temp: baseTemp + Math.sin(i * 0.1) * 8 + (Math.random() * 4 - 2),
      feels_like: baseTemp + Math.sin(i * 0.1) * 8 + (Math.random() * 3 - 1.5),
      humidity: 40 + Math.random() * 40,
      pressure: 1005 + Math.random() * 20,
      pop: Math.random() * 0.8,
      wind_speed: 1 + Math.random() * 12,
      wind_deg: Math.random() * 360,
      weather: [{
        main: i < 12 ? 'Clear' : i < 24 ? 'Clouds' : 'Rain',
        description: i < 12 ? 'clear sky' : i < 24 ? 'cloudy' : 'light rain'
      }]
    })),
    daily: Array.from({ length: 7 }, (_, i) => ({
      dt: now + i * 86400,
      temp: {
        max: baseTemp + 8 + Math.sin(i) * 6,
        min: baseTemp - 5 + Math.sin(i) * 4
      },
      humidity: 45 + Math.random() * 25,
      wind_speed: 3 + Math.random() * 8,
      wind_deg: Math.random() * 360,
      pop: Math.random() * 0.6,
      weather: [{
        main: i % 4 === 0 ? 'Clear' : i % 4 === 1 ? 'Clouds' : i % 4 === 2 ? 'Rain' : 'Snow',
        description: i % 4 === 0 ? 'clear sky' : i % 4 === 1 ? 'cloudy' : i % 4 === 2 ? 'rain' : 'snow'
      }]
    }))
  };
};


export const getHistoricalData = async (lat, lon) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    hourly: Array.from({ length: 24 }, (_, i) => ({
      dt: Math.floor(Date.now() / 1000) - (24 - i) * 3600,
      temp: 15 + Math.sin(i * 0.25) * 5,
      humidity: 60 + Math.random() * 20,
      pressure: 1010 + Math.random() * 10
    }))
  };
};