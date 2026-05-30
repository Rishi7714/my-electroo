// client/src/pages/OrderManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

const OrderManagementPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null); // For success/error messages after actions
    const { user } = useAuth(); // To get the admin token

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!user || user.role !== 'admin') {
                setError('You are not authorized to view orders.');
                setLoading(false);
                return;
            }

            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Sort orders by creation date, newest first
            const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (err) {
            setError('Failed to fetch orders: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            if (!user || user.role !== 'admin') {
                setError('You are not authorized to update order status.');
                return;
            }

            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update order status');
            }

            setMessage('Order status updated successfully!');
            fetchOrders(); // Re-fetch orders to get updated data
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setError(err.message || 'An error occurred during status update.');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                if (!user || user.role !== 'admin') {
                    setError('You are not authorized to delete orders.');
                    return;
                }

                const response = await fetch(`/api/orders/${orderId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to delete order');
                }

                setMessage('Order deleted successfully!');
                fetchOrders(); // Re-fetch orders
                setTimeout(() => setMessage(null), 3000);
            } catch (err) {
                setError(err.message || 'An error occurred during deletion.');
                setTimeout(() => setError(null), 3000);
            }
        }
    };

    if (loading) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading Orders...</h2>;
    if (error) return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>{error}</h2>;

    return (
        <div className="admin-page container">
            <h1>Order Management</h1>
            {message && <p className="success-message">{message}</p>}
            {orders.length === 0 ? (
                <p style={{textAlign: 'center', fontSize: '1.2rem', color: 'var(--secondary-color)', marginTop: '20px'}}>No orders to display.</p>
            ) : (
                <div className="order-list-card card">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User Email</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user ? order.user.email : 'N/A'}</td>
                                    <td>₹{order.totalPrice.toFixed(2)}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => handleDeleteOrder(order._id)} className="btn btn-secondary delete-order-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderManagementPage;