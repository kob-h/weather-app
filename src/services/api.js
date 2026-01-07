
const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchCities(query) {
  if (!query || query.length < 3) return [];
  
  try {
    const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    if (!response.ok) throw new Error("Failed to fetch cities");
    
    const data = await response.json();
    if (!data.results) return [];
    
    return data.results.map(city => ({
      id: city.id,
      name: city.name,
      country: city.country,
      admin1: city.admin1,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone
    }));
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
}

export async function getWeather(lat, lon, timezone = "auto") {
  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current_weather: true,
      daily: "weathercode,temperature_2m_max,temperature_2m_min",
      timezone: timezone
    });

    const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch weather data");

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

export const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};
