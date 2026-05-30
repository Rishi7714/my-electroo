// client/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './ProfilePage.css'; // Create this CSS file

const ProfilePage = () => {
    const { user, loading: authLoading, logout } = useAuth(); // Get user and logout
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState(null);

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (!user) {
                setOrdersLoading(false);
                return;
            }

            setOrdersLoading(true);
            setOrdersError(null);
            try {
                const response = await fetch('/api/orders/myorders', { // Fetch user's specific orders
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setOrdersError('Failed to fetch orders: ' + err.message);
                console.error(err);
            } finally {
                setOrdersLoading(false);
            }
        };

        if (!authLoading && user) { // Only fetch orders once auth is ready and user is logged in
            fetchMyOrders();
        }
    }, [user, authLoading]);

    if (authLoading) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading profile...</h2>;
    if (!user) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Please log in to view your profile.</h2>;

    return (
        <div className="profile-page container">
            <h1>My Profile</h1>

            <div className="profile-details card">
                <h2>User Information</h2>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <button onClick={logout} className="btn btn-secondary logout-btn">Logout</button>
            </div>

            <div className="order-history card">
                <h2>My Orders</h2>
                {ordersLoading ? (
                    <p style={{textAlign: 'center'}}>Loading order history...</p>
                ) : ordersError ? (
                    <p style={{textAlign: 'center', color: 'red'}}>{ordersError}</p>
                ) : orders.length === 0 ? (
                    <p style={{textAlign: 'center', fontSize: '1.1rem', color: 'var(--secondary-color)'}}>You have not placed any orders yet.</p>
                ) : (
                    <table className="order-history-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Items</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id.substring(0, 8)}...</td> {/* Shorten ID */}
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>₹{order.totalPrice.toFixed(2)}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        {order.orderItems.map(item => (
                                            <div key={item.product}>{item.name} ({item.quantity})</div>
                                        ))}
                                    </td>
                                    <td>
                                        <Link to={`/orders/${order._id}`} className="btn btn-primary view-details-btn">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;