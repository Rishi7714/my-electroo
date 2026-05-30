// client/src/components/ProtectedRoute.jsx (Create this file)
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading authentication...</h2>;
    }

    if (!user) {
        // Not logged in, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        // Logged in but not admin, redirect to home or unauthorized page
        return <Navigate to="/" replace />; // Or a specific unauthorized page
    }

    return children;
};

export default ProtectedRoute;
