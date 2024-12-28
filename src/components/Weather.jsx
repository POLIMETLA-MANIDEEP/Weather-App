import React, { useState, useEffect } from 'react';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import './weather.css';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = "b9dfa0c8937644c28ae160307242812"; // Updated here
  const API_URL = 'https://api.weatherapi.com/v1/current.json';

  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}&q=${city}`);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchWeather(searchTerm);
    }
  };

  useEffect(() => {
    // Fetch weather data for a default city on component mount
    fetchWeather('London');
  }, []);

  return (
    <div className='weather'>
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <img
          src={search_icon}
          alt='Search'
          className='search-icon'
          onClick={handleSearch}
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className='error'>{error}</p>}
      {weatherData && (
        <>
          <img
            src={
              weatherData.current.condition.text.includes('Clear')
                ? clear_icon
                : weatherData.current.condition.text.includes('Rain')
                ? rain_icon
                : weatherData.current.condition.text.includes('Drizzle')
                ? drizzle_icon
                : weatherData.current.condition.text.includes('Snow')
                ? snow_icon
                : clear_icon // Fallback icon
            }
            alt={weatherData.current.condition.text}
            className='weather-icon'
          />
          <p className='temprature'>{Math.round(weatherData.current.temp_c)}°c</p>
          <p className='location'>{weatherData.location.name}</p>
          <div className='weather-data'>
            <div className='col'>
              <img src={humidity_icon} alt='Humidity' />
              <div>
                <p>{weatherData.current.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className='col'>
              <img src={wind_icon} alt='Wind Speed' />
              <div>
                <p>{weatherData.current.wind_kph} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
