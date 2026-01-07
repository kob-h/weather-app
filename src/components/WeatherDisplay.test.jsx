import { render, screen } from '@testing-library/react';
import WeatherDisplay from './WeatherDisplay';
import { vi, describe, it, expect } from 'vitest';

// Mock MapComponent since it might need leaflet context which is hard to mock in jsdom
vi.mock('./MapComponent', () => ({
    default: () => <div data-testid="map-mock">Map</div>
}));

describe('WeatherDisplay', () => {
    const mockWeather = {
        current_weather: {
            temperature: 25,
            weathercode: 0,
            windspeed: 10,
            winddirection: 180
        },
        daily: {
            time: ['2023-01-01'],
            weathercode: [0],
            temperature_2m_max: [20],
            temperature_2m_min: [10],
            precipitation_probability_max: [0]
        }
    };

    const mockCity = {
        name: 'London',
        country: 'UK',
        latitude: 51.5,
        longitude: -0.1
    };

    it('renders nothing when props are missing', () => {
        const { container } = render(<WeatherDisplay />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders weather info correctly', () => {
        render(<WeatherDisplay weather={mockWeather} city={mockCity} />);

        expect(screen.getByText('London')).toBeInTheDocument();
        expect(screen.getByText('25°')).toBeInTheDocument(); // Temperature
        expect(screen.getAllByText('Clear sky').length).toBeGreaterThan(0); // Appears in current and forecast
        expect(screen.getByTestId('map-mock')).toBeInTheDocument();
    });
});
