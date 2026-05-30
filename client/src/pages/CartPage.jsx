// client/src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate(); // Initialize useNavigate

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleUpdateQuantity = (id, e) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity >= 0) {
            updateQuantity(id, newQuantity);
        }
    };

    const handleRemoveItem = (id) => {
        removeFromCart(id);
    };

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            navigate('/checkout'); // Navigate to the CheckoutPage
        } else {
            // Provide feedback if cart is empty before navigating
            // alert('Your cart is empty. Please add items before checking out.');
            // Using a more integrated message (if you have one)
            console.log('Cart is empty, cannot proceed to checkout.');
        }
    };

    return (
        <div className="cart-page container">
            <h1>Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="empty-cart-message card">
                    <p>Your cart is empty. Looks like it's time to find some awesome electronics!</p>
                    <Link to="/products" className="btn btn-primary">Shop Now</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.product} className="cart-item card">
                                <img src={item.imageUrl} alt={item.name} className="cart-item-image" onError={(e) => e.target.src = 'https://placehold.co/100x100/cccccc/333333?text=No+Image'}/>
                                <div className="cart-item-details">
                                    <Link to={`/products/${item.product}`}><h3>{item.name}</h3></Link>
                                    <p>Price: ₹{item.price.toFixed(2)}</p>
                                    <div className="quantity-control">
                                        <label htmlFor={`quantity-${item.product}`}>Quantity:</label>
                                        <input
                                            type="number"
                                            id={`quantity-${item.product}`}
                                            min="0"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdateQuantity(item.product, e)}
                                        />
                                    </div>
                                    <p>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => handleRemoveItem(item.product)} className="btn btn-secondary remove-btn">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary card">
                        <h2>Order Summary</h2>
                        <p>Total Items: {cartItems.length}</p>
                        <p className="cart-total">Total: ₹{calculateTotal().toFixed(2)}</p>
                        <button onClick={handleCheckout} className="btn btn-accent checkout-btn">Proceed to Checkout</button>
                        <button onClick={clearCart} className="btn btn-secondary clear-cart-btn">Clear Cart</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;