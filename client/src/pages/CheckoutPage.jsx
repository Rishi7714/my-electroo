// client/src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css'; // Create this CSS file

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: 'India' // Default country
    });
    const [paymentMethod, setPaymentMethod] = useState('Credit Card'); // Default payment
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const calculateSubtotal = () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxPrice = (calculateSubtotal() * 0.18).toFixed(2); // Example 18% tax
    const shippingPrice = calculateSubtotal() > 5000 ? 0 : 500; // Free shipping over ₹5000
    const totalPrice = (parseFloat(calculateSubtotal()) + parseFloat(taxPrice) + shippingPrice).toFixed(2);

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (cartItems.length === 0) {
            setError('Your cart is empty. Cannot place an order.');
            setLoading(false);
            return;
        }

        if (!user) {
            setError('You must be logged in to place an order.');
            setLoading(false);
            return;
        }

        // Basic validation for shipping address
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            setError('Please fill in all shipping details.');
            setLoading(false);
            return;
        }

        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item.product,
                    name: item.name,
                    imageUrl: item.imageUrl,
                    price: item.price,
                    quantity: item.quantity,
                })),
                shippingAddress,
                paymentMethod,
                taxPrice: parseFloat(taxPrice),
                shippingPrice,
                totalPrice: parseFloat(totalPrice),
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to place order.');
            }

            setMessage('Order placed successfully!');
            clearCart(); // Clear cart after successful order
            console.log('Order Details:', data);
            navigate(`/profile`); // Navigate to user profile or a dedicated order confirmation page
        } catch (err) {
            setError(err.message || 'An error occurred while placing your order.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !message) { // Only show this if cart is empty and no success message from a recent order
        return (
            <div className="checkout-page container">
                <div className="empty-cart-message card">
                    <p>Your cart is empty. Please add items to proceed to checkout.</p>
                    <Link to="/products" className="btn btn-primary">Shop Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page container">
            <h1>Checkout</h1>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <div className="checkout-content">
                <div className="shipping-payment-section card">
                    <h2>Shipping Address</h2>
                    <form onSubmit={placeOrderHandler}>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={shippingAddress.address}
                                onChange={handleShippingChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={shippingAddress.city}
                                onChange={handleShippingChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="postalCode">Postal Code</label>
                            <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                value={shippingAddress.postalCode}
                                onChange={handleShippingChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={shippingAddress.country}
                                onChange={handleShippingChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <h2 style={{marginTop: '30px'}}>Payment Method</h2>
                        <div className="form-group payment-method-options">
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Credit Card"
                                    checked={paymentMethod === 'Credit Card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    disabled={loading}
                                /> Credit Card (Placeholder)
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Cash on Delivery"
                                    checked={paymentMethod === 'Cash on Delivery'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    disabled={loading}
                                /> Cash on Delivery
                            </label>
                            {/* Add more payment options here if needed */}
                        </div>

                        <button type="submit" className="btn btn-primary place-order-btn" disabled={loading}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="order-summary-checkout card">
                    <h2>Order Summary</h2>
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item.product} className="summary-item">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-details">
                        <p>Subtotal: <span>₹{calculateSubtotal().toFixed(2)}</span></p>
                        <p>Shipping: <span>₹{shippingPrice.toFixed(2)}</span></p>
                        <p>Tax (18%): <span>₹{taxPrice}</span></p>
                        <p className="summary-total">Order Total: <span>₹{totalPrice}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;