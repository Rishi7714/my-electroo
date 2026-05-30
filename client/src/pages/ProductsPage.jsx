// client/src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterBox from '../components/FilterBox';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const location = useLocation();

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams(location.search);
            const keyword = params.get('keyword') || '';

            const queryParams = new URLSearchParams();
            if (keyword) queryParams.append('keyword', keyword);
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

            const response = await fetch(`/api/products?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters, location.search]);

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
    };

    if (loading) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading products...</h2>;
    if (error) return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>{error}</h2>;

    return (
        <div className="products-page container">
            <h1>Our Products</h1>
            <div className="products-main-content"> {/* New wrapper for filter and products */}
                <aside className="products-filter-sidebar"> {/* Wrapper for FilterBox */}
                    <FilterBox onFilter={handleFilter} />
                </aside>
                <div className="products-list-area"> {/* Wrapper for product list */}
                    {products.length === 0 ? (
                        <p style={{textAlign: 'center', fontSize: '1.2rem', color: 'var(--secondary-color)', padding: '20px'}}>No products found matching your criteria.</p>
                    ) : (
                        <div className="product-list-grid">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;