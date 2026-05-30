// client/src/components/SearchBar.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useLocation } from 'react-router-dom'; // Import useLocation
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const initialKeyword = params.get('keyword') || ''; // Get initial keyword from URL

    const [query, setQuery] = useState(initialKeyword);

    // Update internal query state if URL keyword changes (e.g., navigating back/forward)
    useEffect(() => {
        setQuery(initialKeyword);
    }, [initialKeyword]);


    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query); // Call the onSearch prop passed from Header
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={handleInputChange}
                className="search-input"
            />
            <button type="submit" className="btn btn-primary search-btn">Search</button>
        </form>
    );
};

export default SearchBar;