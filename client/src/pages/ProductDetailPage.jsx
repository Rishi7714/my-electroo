// client/src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart(); // Get addToCart function from context
    const [quantity, setQuantity] = useState(1); // State for quantity input

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/products/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError('Failed to fetch product details: ' + err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity); // Pass product and chosen quantity
            console.log(`${quantity} of ${product.name} added to cart!`);
            // Optionally, add a visual feedback
        }
    };

    if (loading) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading product details...</h2>;
    if (error) return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>{error}</h2>;
    if (!product) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Product not found.</h2>;

    return (
        <div className="product-detail-page container">
            <div className="product-detail-card card">
                <div className="product-image-container">
                    <img src={product.imageUrl} alt={product.name} className="product-detail-image" onError={(e) => e.target.src = 'https://placehold.co/400x300/cccccc/333333?text=No+Image'} />
                </div>
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="product-category">Category: {product.category}</p>
                    <p className="product-description">{product.description}</p>
                    {/* Assuming features are part of description or a separate array in product model */}
                    {product.features && product.features.length > 0 && (
                        <ul className="product-features">
                            {product.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    )}
                    <p className="product-price">₹{product.price.toFixed(2)}</p>
                    <p className="product-stock">In Stock: {product.stock}</p>

                    <div className="quantity-control form-group">
                        <label htmlFor="qty-input">Quantity:</label>
                        <input
                            type="number"
                            id="qty-input"
                            min="1"
                            max={product.stock} // Limit quantity to available stock
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} // Ensure at least 1
                        />
                    </div>

                    <button onClick={handleAddToCart} className="btn btn-primary add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;