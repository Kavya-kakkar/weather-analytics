// store/weatherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getCurrentWeather, 
  getForecast, 
  getHistoricalData,
  searchCities as searchCitiesAPI 
} from '../services/weatherAPI';

// Enhanced thunk with cache checking
export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (city, { getState }) => {
    const state = getState();
    const cacheKey = `weather_${city.id}`;
    const cachedTime = state.weather.cacheTimestamps[cacheKey];
    const now = Date.now();
    
    // Return cached data if it's less than 10 minutes old
    if (cachedTime && (now - cachedTime) < 10 * 60 * 1000) {
      console.log('Using cached weather data for:', city.name);
      return { cityId: city.id, data: state.weather.currentWeather[city.id] };
    }
    
    console.log('Fetching fresh weather data for:', city.name);
    const response = await getCurrentWeather(city.lat, city.lon, city.name);
    return { cityId: city.id, data: response };
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (city, { getState }) => {
    const state = getState();
    const cacheKey = `forecast_${city.id}`;
    const cachedTime = state.weather.cacheTimestamps[cacheKey];
    const now = Date.now();
    
    // Return cached forecast if it's less than 30 minutes old
    if (cachedTime && (now - cachedTime) < 30 * 60 * 1000) {
      console.log('Using cached forecast for:', city.name);
      return { cityId: city.id, data: state.weather.forecast[city.id] };
    }
    
    console.log('Fetching fresh forecast for:', city.name);
    const response = await getForecast(city.lat, city.lon, city.name);
    return { cityId: city.id, data: response };
  }
);

export const fetchHistoricalData = createAsyncThunk(
  'weather/fetchHistorical',
  async (city) => {
    const response = await getHistoricalData(city.lat, city.lon);
    return { cityId: city.id, data: response };
  }
);

export const searchCities = createAsyncThunk(
  'weather/searchCities',
  async (query) => {
    const response = await searchCitiesAPI(query);
    return response;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    theme : 'default',
    favorites: JSON.parse(localStorage.getItem('favoriteCities')) || [],
    currentWeather: {},
    forecast: {},
    historicalData: {},
    loading: {},
    unit: localStorage.getItem('temperatureUnit') || 'celsius',
    searchResults: [],
    cacheTimestamps: {} // Track when data was cached
  },
  reducers: {
    setTemperatureUnit : (state , action) => {
      state.unit = action.payload;
    },
    setTheme : (state , action) => {
      state.theme = action.payload;
    },
    addFavorite: (state, action) => {
      const city = action.payload;
      if (!state.favorites.some(fav => fav.id === city.id)) {
        state.favorites.push(city);
        localStorage.setItem('favoriteCities', JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(city => city.id !== action.payload);
      localStorage.setItem('favoriteCities', JSON.stringify(state.favorites));
    },
    setTemperatureUnit: (state, action) => {
      state.unit = action.payload;
      localStorage.setItem('temperatureUnit', action.payload);
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    // NEW: Cache timestamp reducer
    updateCacheTimestamp: (state, action) => {
      const { key, timestamp } = action.payload;
      state.cacheTimestamps[key] = timestamp;
    },
    // NEW: Clear specific cache
    clearCache: (state, action) => {
      const { key } = action.payload;
      if (key) {
        delete state.cacheTimestamps[key];
      } else {
        // Clear all cache
        state.cacheTimestamps = {};
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch current weather
      .addCase(fetchCurrentWeather.pending, (state, action) => {
        state.loading[action.meta.arg.id] = true;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        const { cityId, data } = action.payload;
        state.currentWeather[cityId] = data;
        state.loading[cityId] = false;
        state.cacheTimestamps[`weather_${cityId}`] = Date.now(); // Fixed typo: waether → weather
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading[action.meta.arg.id] = false;
      })
      // Fetch forecast
      .addCase(fetchForecast.fulfilled, (state, action) => {
        const { cityId, data } = action.payload;
        state.forecast[cityId] = data;
        state.cacheTimestamps[`forecast_${cityId}`] = Date.now();
      })
      // Fetch historical data
      .addCase(fetchHistoricalData.fulfilled, (state, action) => {
        const { cityId, data } = action.payload;
        state.historicalData[cityId] = data;
        state.cacheTimestamps[`historical_${cityId}`] = Date.now();
      })
      // Search cities
      .addCase(searchCities.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  }
});

export const { 
  addFavorite, 
  removeFavorite, 
  setTemperatureUnit,
  setTheme, 
  clearSearchResults,
  updateCacheTimestamp, // NEW
  clearCache // NEW,
} = weatherSlice.actions;

export default weatherSlice.reducer;