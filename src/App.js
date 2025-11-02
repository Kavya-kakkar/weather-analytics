import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Dashboard from './components/Dashboard';
import CityDetail from './components/CityDetail';
import SearchBar from './components/SearchBar';
import Settings from './components/Settings';
import AuthButton from './components/AuthButton';
import './App.css';

// Suppress non-critical Firebase popup warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && 
      args[0].includes('Cross-Origin-Opener-Policy')) {
    return; // Suppress these specific warnings
  }
  originalWarn.apply(console, args);
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCity, setSelectedCity] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState(null);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentView('detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCity(null);
  };

  return (
    <Provider store={store}>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title" onClick={handleBackToDashboard}>
              <i className="fas fa-cloud-sun"></i> Weather Analytics
            </h1>
            {/* Only show SearchBar when user is logged in */}
            {user && <SearchBar onCitySelect={handleCitySelect} />}
            <div className="header-actions">
              <AuthButton user={user} onUserChange={setUser} />
              {user && (
                <button 
                  className="settings-btn"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <i className="fas fa-cog"></i>
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="app-main">
          {showSettings && (
            <Settings onClose={() => setShowSettings(false)} />
          )}
          
          {user ? (
            currentView === 'dashboard' ? (
              <Dashboard onCitySelect={handleCitySelect} />
            ) : (
              <CityDetail 
                city={selectedCity} 
                onBack={handleBackToDashboard} 
              />
            )
          ) : (
            <div className="welcome-section">
              <div className="welcome-content">
                <h2>Welcome to Weather Analytics</h2>
                <p>Please sign in to access weather data and personalized features.</p>
                <div className="welcome-auth">
                  <p>Use the login buttons in the top right corner to get started!</p>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>Weather data provided by OpenWeatherMap</p>
        </footer>
      </div>
    </Provider>
  );
}

export default App;