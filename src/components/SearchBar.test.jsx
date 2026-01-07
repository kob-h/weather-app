import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SearchBar from './SearchBar';
import { searchCities } from '../services/api';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the api module
vi.mock('../services/api', () => ({
    searchCities: vi.fn(),
}));

describe('SearchBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders input correctly', () => {
        render(<SearchBar onCitySelect={() => { }} />);
        expect(screen.getByPlaceholderText('Search city...')).toBeInTheDocument();
    });

    it('searches for cities when typing', async () => {
        searchCities.mockResolvedValue([
            { id: 1, name: 'Test City', country: 'Test Country' }
        ]);

        render(<SearchBar onCitySelect={() => { }} />);
        const input = screen.getByPlaceholderText('Search city...');

        fireEvent.change(input, { target: { value: 'Test' } });

        // Wait for debounce and search
        await waitFor(() => {
            expect(searchCities).toHaveBeenCalledWith('Test');
        });

        expect(screen.getByText('Test City')).toBeInTheDocument();
    });

    it('clears text on focus', () => {
        const city = { name: 'London', country: 'UK' };
        render(<SearchBar onCitySelect={() => { }} selectedCity={city} />);

        const input = screen.getByPlaceholderText('Search city...');
        // Should initially show city name
        expect(input.value).toBe('London, UK');

        fireEvent.focus(input);
        expect(input.value).toBe('');
    });

    it('restores text on blur if no selection made', async () => {
        const city = { name: 'London', country: 'UK' };
        render(<SearchBar onCitySelect={() => { }} selectedCity={city} />);

        const input = screen.getByPlaceholderText('Search city...');
        fireEvent.focus(input);
        expect(input.value).toBe('');

        fireEvent.blur(input);

        // Wait for the timeout in blur handler
        await waitFor(() => {
            expect(input.value).toBe('London, UK');
        });
    });

    it('calls onCitySelect when clicking a result', async () => {
        const mockOnSelect = vi.fn();
        const city = { id: 1, name: 'Paris', country: 'France' };
        searchCities.mockResolvedValue([city]);

        render(<SearchBar onCitySelect={mockOnSelect} />);
        const input = screen.getByPlaceholderText('Search city...');

        fireEvent.change(input, { target: { value: 'Paris' } });

        await waitFor(() => {
            expect(screen.getByText('Paris')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Paris'));
        expect(mockOnSelect).toHaveBeenCalledWith(city);
    });
});
