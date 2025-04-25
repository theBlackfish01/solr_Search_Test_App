import React, { useState, useEffect, useRef } from 'react';
import { getSuggestions } from '../services/solrService';
import AutocompleteDropdown from './AutocompleteDropdown';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchTimeout = useRef(null);
    const searchBarRef = useRef(null);

    useEffect(() => {
        // Handle clicks outside of the search component
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Debounce autocomplete requests
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Ensure query is a string and check if it's not empty
        const queryString = typeof query === 'string' ? query : '';
        
        if (queryString.trim() !== '') {
            searchTimeout.current = setTimeout(async () => {
                try {
                    const fetchedSuggestions = await getSuggestions(queryString);
                    setSuggestions(fetchedSuggestions);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                    setSuggestions([]);
                }
            }, 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(query);
        setShowSuggestions(false);
    };

    const handleSuggestionSelect = (suggestion) => {
        // If we have a title, search for that exact title
        if (suggestion.title) {
            onSearch(`title:"${suggestion.title}"`);
        } 
        // If we have an author, search for that exact author
        else if (suggestion.author) {
            onSearch(`author:"${suggestion.author}"`);
        } 
        // Fallback to using the display text
        else {
            const term = suggestion.title || suggestion.author;
            onSearch(term);
        }
        
        setQuery(suggestion.title || suggestion.author);
        setShowSuggestions(false);
    };

    return (
        <div className="search-container" ref={searchBarRef}>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        // Safely check if query is non-empty
                        const queryString = typeof query === 'string' ? query : '';
                        if (queryString.trim() !== '') {
                            setShowSuggestions(true);
                        }
                    }}
                    className="search-input"
                    placeholder="Search for books, authors, or genres..."
                />
                <button
                    type="submit"
                    className="search-button"
                >
                    Search
                </button>
            </form>
            <div className="search-help">
                <small>Try searching: author:"J.K. Rowling" or title:"Harry Potter"</small>
            </div>
            <AutocompleteDropdown
                suggestions={suggestions}
                onSelect={handleSuggestionSelect}
                visible={showSuggestions}
            />
        </div>
    );
};

export default SearchBar;