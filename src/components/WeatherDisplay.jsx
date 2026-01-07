import { weatherCodes } from '../services/api';
import MapComponent from './MapComponent';

export default function WeatherDisplay({ weather, city }) {
    if (!weather || !city) return null;

    const { current_weather, daily } = weather;

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', { event: 'short', weekday: 'short' });
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 fade-in">
            {/* Current Weather */}
            <div className="glass-panel p-8 mb-8 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">{city.name}</h2>
                    <p className="text-xl opacity-80 mb-6">{city.admin1 ? `${city.admin1}, ` : ''}{city.country}</p>

                    <div className="flex flex-col items-center justify-center">
                        <div className="text-8xl font-bold mb-4 tracking-tighter">
                            {Math.round(current_weather.temperature)}°
                        </div>
                        <div className="text-2xl font-light bg-white/20 px-6 py-2 rounded-full">
                            {weatherCodes[current_weather.weathercode]}
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-8 w-full max-w-xs opacity-90">
                            <div className="flex flex-col">
                                <span className="text-sm uppercase tracking-wider opacity-70">Wind</span>
                                <span className="text-xl font-semibold">{current_weather.windspeed} km/h</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm uppercase tracking-wider opacity-70">Direction</span>
                                <span className="text-xl font-semibold">{current_weather.winddirection}°</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Map */}
            <div className="mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
                <MapComponent lat={city.latitude} lon={city.longitude} city={city.name} />
            </div>

            {/* Forecast */}
            <h3 className="text-xl font-semibold mb-4 px-2">7-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {daily.time.map((time, index) => (
                    <div key={time} className="glass-panel p-4 flex flex-col items-center justify-center min-w-[100px] hover:bg-white/5 transition-colors">
                        <span className="text-sm opacity-70 mb-2">{index === 0 ? 'Today' : formatDate(time)}</span>
                        <div className="my-2 text-3xl opacity-80">
                            {/* Simple placeholder icon logic could go here, or just text */}
                            {/* For simplicity in this iteration, we use the code mapping text truncated or icon mapping if we had assets */}
                        </div>
                        <span className="text-center text-sm font-medium mb-2 h-10 flex items-center justify-center leading-tight">
                            {weatherCodes[daily.weathercode[index]]}
                        </span>
                        <div className="flex gap-2 text-lg font-bold">
                            <span className="text-white">{Math.round(daily.temperature_2m_max[index])}°</span>
                            <span className="text-white/60">{Math.round(daily.temperature_2m_min[index])}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}
