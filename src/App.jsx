import { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import { getWeather } from './services/api';

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    setLoading(true);
    setError(null);

    try {
      const data = await getWeather(city.latitude, city.longitude, city.timezone);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-gradient-to-br from-blue-500 to-purple-600';

    const isDay = weatherData.current_weather.is_day === 1;
    const code = weatherData.current_weather.weathercode;

    // Clear/Sunny: 0, 1
    // Cloudy: 2, 3, 45, 48
    // Rain/Snow: 51+

    if (isDay) {
      if (code <= 1) return 'bg-day-sunny';
      if (code <= 48) return 'bg-day-cloudy';
      return 'bg-day-rain';
    } else {
      if (code <= 1) return 'bg-night-clear';
      if (code <= 48) return 'bg-night-cloudy';
      return 'bg-night-rain';
    }
  };

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 transition-all duration-1000 ${getBackgroundClass()}`}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center pt-8 fade-in">
          <h1 className="text-5xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            Atmosphere
          </h1>
          <p className="text-white/60 text-lg">Real-time weather & forecast</p>
        </header>

        <SearchBar onCitySelect={handleCitySelect} selectedCity={selectedCity} />

        {error && (
          <div className="mt-8 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-center backdrop-blur-md">
            {error}
          </div>
        )}

        {loading && !weatherData && (
          <div className="mt-20 flex justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-white/20 border-t-white rounded-full"></div>
          </div>
        )}

        {weatherData && !loading && (
          <WeatherDisplay city={selectedCity} weather={weatherData} />
        )}
      </div>
    </div>
  );
}

export default App;
