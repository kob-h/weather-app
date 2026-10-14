import { render, screen } from '@testing-library/react';
import MapComponent from './MapComponent';
import { vi, describe, it, expect } from 'vitest';

// Leaflet needs a real browser layout, so replace react-leaflet with simple elements
vi.mock('react-leaflet', () => ({
    MapContainer: ({ children, center, zoom }) => (
        <div data-testid="map" data-center={center.join(',')} data-zoom={zoom}>{children}</div>
    ),
    TileLayer: () => null,
    Marker: ({ children }) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }) => <div>{children}</div>,
    useMap: () => ({ setView: vi.fn() }),
}));

describe('MapComponent', () => {
    it('shows the city name in the marker popup', () => {
        render(<MapComponent lat={51.5} lon={-0.12} city="London" />);
        expect(screen.getByTestId('marker')).toHaveTextContent('London');
    });

    it('centers the map on the given coordinates', () => {
        render(<MapComponent lat={51.5} lon={-0.12} city="London" />);
        expect(screen.getByTestId('map')).toHaveAttribute('data-center', '51.5,-0.12');
    });
});
