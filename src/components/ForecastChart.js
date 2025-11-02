import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';
import DateRangeSelector from './DateRangeSelector';
import './ForecastChart.css';

const ForecastChart = ({ hourly, daily, historical }) => {
  const [chartType, setChartType] = useState('temperature');
  const [dateRange, setDateRange] = useState('7d');

  // Process data based on date range
  const processedData = useMemo(() => {
    if (chartType === 'daily' || chartType === '7day') {
      return daily?.slice(0, 7).map(day => ({
        date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        max_temp: Math.round(day.temp.max),
        min_temp: Math.round(day.temp.min),
        humidity: day.humidity,
        wind_speed: day.wind_speed,
        precipitation: day.pop * 100
      })) || [];
    }

    // For hourly data, limit based on range
    let hourLimit = 24; // default 24 hours
    if (dateRange === '24h') hourLimit = 24;
    if (dateRange === '7d') hourLimit = 24 * 7; // 1 week of hours
    
    return hourly?.slice(0, hourLimit).map(hour => ({
      time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      }),
      temperature: Math.round(hour.temp),
      feels_like: Math.round(hour.feels_like),
      humidity: hour.humidity,
      pressure: hour.pressure,
      wind_speed: hour.wind_speed,
      precipitation: hour.pop * 100
    })) || [];
  }, [hourly, daily, chartType, dateRange]);

  const handleRangeChange = (range) => {
    setDateRange(range);
  };

  const renderChart = () => {
    switch (chartType) {
      case 'temperature':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart 
              data={processedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ff6b35" 
                strokeWidth={2}
                name="Temperature (°C)"
              />
              <Line 
                type="monotone" 
                dataKey="feels_like" 
                stroke="#4ecdc4" 
                strokeWidth={2}
                name="Feels Like (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'humidity':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={processedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="humidity" 
                stroke="#ffce56" 
                fill="#ffce56" 
                fillOpacity={0.3}
                name="Humidity (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'precipitation':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={processedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="precipitation" 
                fill="#36a2eb" 
                name="Precipitation (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'wind':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={processedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="wind_speed" 
                stroke="#9966ff" 
                strokeWidth={2}
                name="Wind Speed (m/s)"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="no-data">
            Select a chart type to display data
          </div>
        );
    }
  };

  return (
    <div className="forecast-chart">
      <div className="chart-controls">
        <h3>Weather Charts</h3>
        <div className="chart-controls-right">
          <DateRangeSelector 
            onRangeChange={handleRangeChange} 
            selectedRange={dateRange}
          />
          <div className="chart-type-selector">
            <button 
              className={`chart-btn ${chartType === 'temperature' ? 'active' : ''}`}
              onClick={() => setChartType('temperature')}
            >
              Temperature
            </button>
            <button 
              className={`chart-btn ${chartType === 'humidity' ? 'active' : ''}`}
              onClick={() => setChartType('humidity')}
            >
              Humidity
            </button>
            <button 
              className={`chart-btn ${chartType === 'precipitation' ? 'active' : ''}`}
              onClick={() => setChartType('precipitation')}
            >
              Precipitation
            </button>
            <button 
              className={`chart-btn ${chartType === 'wind' ? 'active' : ''}`}
              onClick={() => setChartType('wind')}
            >
              Wind
            </button>
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        {renderChart()}
      </div>
    </div>
  );
};

export default ForecastChart;