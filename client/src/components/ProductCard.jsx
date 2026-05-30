// client/src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart(); // Get addToCart function from context

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigating when clicking add to cart button
        addToCart(product);
        console.log(`${product.name} added to cart!`);
        // Optionally, add a visual feedback (e.g., a toast notification)
    };

    return (
        <div className="product-card card">
            <Link to={`/products/${product._id}`} className="product-link"> {/* Use product._id */}
                <img src={product.imageUrl} alt={product.name} className="product-image" onError={(e) => e.target.src = 'https://placehold.co/180x180/cccccc/333333?text=No+Image'}/>
                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">₹{product.price.toFixed(2)}</p>
                </div>
            </Link>
            <button onClick={handleAddToCart} className="btn btn-primary add-to-cart-btn">Add to Cart</button>
        </div>
    );
};

export default ProductCard;