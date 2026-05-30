// client/src/components/FilterBox.jsx
import React, { useState } from 'react';
import './FilterBox.css'; // Create this CSS file

const FilterBox = ({ onFilter }) => {
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleApplyFilter = () => {
        onFilter({
            category,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        });
    };

    const handleClearFilter = () => {
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        onFilter({}); // Clear all filters
    };

    return (
        <div className="filter-box card">
            <h3>Filter Products</h3>
            <div className="form-group">
                <label htmlFor="category-filter">Category</label>
                <select
                    id="category-filter"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Audio">Audio</option>
                    <option value="Televisions">Televisions</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Storage">Storage</option>
                    {/* Add more categories as needed */}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="min-price">Min Price</label>
                <input
                    type="number"
                    id="min-price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="e.g., 50"
                />
            </div>
            <div className="form-group">
                <label htmlFor="max-price">Max Price</label>
                <input
                    type="number"
                    id="max-price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="e.g., 500"
                />
            </div>
            <div className="filter-actions">
                <button onClick={handleApplyFilter} className="btn btn-primary">Apply Filters</button>
                <button onClick={handleClearFilter} className="btn btn-secondary">Clear Filters</button>
            </div>
        </div>
    );
};

export default FilterBox;
