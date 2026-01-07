import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchCities, getWeather } from './api';

// Mock global fetch
global.fetch = vi.fn();

describe('api service', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('searchCities', () => {
        it('returns empty array for short query', async () => {
            const results = await searchCities('ab');
            expect(results).toEqual([]);
            expect(fetch).not.toHaveBeenCalled();
        });

        it('returns cities on valid search', async () => {
            const mockData = {
                results: [
                    { id: 1, name: 'London', country: 'UK', admin1: 'England', latitude: 51.5, longitude: -0.1, timezone: 'GMT' }
                ]
            };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData
            });

            const results = await searchCities('London');
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('London');
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        it('handles fetch error gracefully', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));
            const results = await searchCities('London');
            expect(results).toEqual([]);
        });
    });

    describe('getWeather', () => {
        it('fetches weather data correctly', async () => {
            const mockWeather = { current_weather: { temperature: 20 } };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockWeather
            });

            const data = await getWeather(51.5, -0.1);
            expect(data).toEqual(mockWeather);
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://api.open-meteo.com/v1/forecast'));
        });

        it('throws error on failure', async () => {
            fetch.mockResolvedValueOnce({ ok: false });
            await expect(getWeather(51.5, -0.1)).rejects.toThrow('Failed to fetch weather data');
        });
    });
});
