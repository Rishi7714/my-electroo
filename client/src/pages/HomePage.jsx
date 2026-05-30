// client/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; // Re-use ProductCard
import './HomePage.css';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const allProducts = await response.json();

                // Group products by category and find the costliest in each
                const categoryCostliest = {};
                allProducts.forEach(product => {
                    const category = product.category || 'Uncategorized'; // Handle products without a category
                    if (!categoryCostliest[category] || product.price > categoryCostliest[category].price) {
                        categoryCostliest[category] = product;
                    }
                });

                // Convert the object of costliest products back into an array
                const topProducts = Object.values(categoryCostliest);

                // Sort these top products by price in descending order
                topProducts.sort((a, b) => b.price - a.price);

                // Take up to the first 6 products as featured
                setFeaturedProducts(topProducts.slice(0, 6));

            } catch (err) {
                setError('Failed to fetch featured products: ' + err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedProducts();
    }, []); // Empty dependency array means this runs once on component mount

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to My Electroo</h1>
                    <p>Your one-stop shop for the latest electronics.</p>
                    <Link to="/products" className="btn btn-primary">Shop Now</Link>
                </div>
            </section>

            <section className="featured-products container">
                <h2>Featured Products</h2>
                {loading ? (
                    <p style={{textAlign: 'center'}}>Loading featured products...</p>
                ) : error ? (
                    <p style={{textAlign: 'center', color: 'red'}}>{error}</p>
                ) : featuredProducts.length === 0 ? (
                    <p style={{textAlign: 'center'}}>No featured products available yet. Add some from admin panel!</p>
                ) : (
                    <div className="product-grid">
                        {featuredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <section className="about-us-section container">
                <h2>About My Electroo</h2>
                <p>We are dedicated to bringing you the best in electronics, from cutting-edge gadgets to essential home appliances. Our mission is to provide quality products at competitive prices with excellent customer service.</p>
                <p>Explore our wide range of categories and find exactly what you need!</p>
            </section>
        </div>
    );
};

export default HomePage;