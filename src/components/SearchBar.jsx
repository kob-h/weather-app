import { useState, useEffect, useRef } from 'react';
import { searchCities } from '../services/api';

export default function SearchBar({ onCitySelect, selectedCity }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const formatCityName = (city) => {
        if (!city) return '';
        return `${city.name}, ${city.admin1 ? city.admin1 + ', ' : ''}${city.country}`;
    };

    useEffect(() => {
        if (selectedCity) {
            setQuery(formatCityName(selectedCity));
        }
    }, [selectedCity]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (query.length < 3) {
                setResults([]);
                return;
            }

            // If the query matches the selected city exactly, don't search again (optional optimization)
            if (selectedCity && query === formatCityName(selectedCity)) {
                return;
            }

            setLoading(true);
            try {
                const cities = await searchCities(query);
                setResults(cities);
                setIsOpen(true);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchCities, 500);
        return () => clearTimeout(debounceTimer);
    }, [query, selectedCity]);

    const handleSelect = (city) => {
        onCitySelect(city);
        // Query update handled by useEffect on selectedCity
        setIsOpen(false);
    };

    const handleFocus = () => {
        setQuery('');
    };

    const handleBlur = () => {
        // Init a small timeout to allow click to register if needed, 
        // though mousedown usually precedes. 
        // We restore the name if no new selection happened.
        // If the user just clicked away, we restore.
        if (selectedCity) {
            // We use a timeout to let any click events on the list finish processing
            setTimeout(() => {
                setQuery(formatCityName(selectedCity));
            }, 200);
        }
    };

    return (
        <div className="relative w-full z-50" ref={wrapperRef}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Search city..."
                className="w-full p-4 text-lg bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all shadow-lg"
            />

            {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
            )}

            {isOpen && results.length > 0 && (
                <ul className="absolute w-full mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto list-none p-0 m-0">
                    {results.map((city) => (
                        <li
                            key={city.id}
                            onClick={() => handleSelect(city)}
                            className="p-3 hover:bg-white/20 cursor-pointer transition-colors text-white border-b border-white/5 last:border-0"
                        >
                            <div className="font-semibold">{city.name}</div>
                            <div className="text-sm opacity-70">
                                {[city.admin1, city.country].filter(Boolean).join(', ')}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
