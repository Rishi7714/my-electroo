// client/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        pendingOrders: 0,
        totalUsers: 0,
        revenueToday: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAdminStats = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!user || user.role !== 'admin') {
                    setError('Not authorized to view admin stats.');
                    setLoading(false);
                    return;
                }

                // Fetch products count
                const productsRes = await fetch('/api/products', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const productsData = await productsRes.json();
                if (!productsRes.ok) throw new Error(productsData.message || 'Failed to fetch products count');

                // Fetch orders count and revenue (simplified, in a real app, this would be a dedicated endpoint)
                const ordersRes = await fetch('/api/orders', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const ordersData = await ordersRes.json();
                if (!ordersRes.ok) throw new Error(ordersData.message || 'Failed to fetch orders');

                const pendingOrdersCount = ordersData.filter(order => order.status === 'Pending').length;
                const revenueToday = ordersData
                                        .filter(order => new Date(order.createdAt).toDateString() === new Date().toDateString())
                                        .reduce((acc, order) => acc + order.totalPrice, 0);

                // Fetch users count (assuming a /api/auth/users endpoint for admin)
                // For simplicity, we'll hardcode totalUsers for now, as we don't have a /api/auth/users endpoint yet.
                // In a real app, you'd add:
                // const usersRes = await fetch('/api/auth/users', { headers: { 'Authorization': `Bearer ${user.token}` } });
                // const usersData = await usersRes.json();
                // if (!usersRes.ok) throw new Error(usersData.message || 'Failed to fetch users count');


                setStats({
                    totalProducts: productsData.length,
                    pendingOrders: pendingOrdersCount,
                    totalUsers: 50, // Placeholder: Replace with actual fetch from backend
                    revenueToday: revenueToday
                });

            } catch (err) {
                setError(err.message || 'An error occurred while fetching admin stats.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAdminStats();
        }
    }, [user]);

    if (loading) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading Admin Dashboard...</h2>;
    if (error) return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>{error}</h2>;

    return (
        <div className="admin-page container">
            <h1>Admin Dashboard</h1>
            <div className="admin-stats-grid">
                <div className="stat-card card">
                    <h3>Total Products</h3>
                    <p>{stats.totalProducts}</p>
                </div>
                <div className="stat-card card">
                    <h3>Pending Orders</h3>
                    <p>{stats.pendingOrders}</p>
                </div>
                <div className="stat-card card">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card card">
                    <h3>Revenue Today</h3>
                    <p>₹{stats.revenueToday.toFixed(2)}</p>
                </div>
            </div>

            <div className="admin-actions card">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <Link to="/admin/products/add" className="btn btn-primary">Add New Product</Link>
                    <Link to="/admin/orders" className="btn btn-secondary">Manage Orders</Link>
                    <Link to="/admin/products" className="btn btn-secondary">View/Edit Products</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;