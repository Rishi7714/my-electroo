// client/src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (query) => {
        if (query) {
            navigate(`/products?keyword=${encodeURIComponent(query)}`);
        } else {
            navigate('/products');
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo-section">
                    <Link to="/" className="logo">My Electroo</Link>
                    <p className='into'>Your One-Stop Tech Shop</p>
                </div>

                <div className="header-search">
                    <SearchBar onSearch={handleSearch} />
                </div>
                
                <nav className="nav-links">
                    <Link to="/products">Products</Link>
                    <Link to="/cart">Cart</Link>
                    
                    {user ? ( // Check if user is logged in
                        <>
                            <Link to="/profile">Profile</Link> {/* Link to ProfilePage */}
                            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                            <button onClick={handleLogout} className="nav-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;