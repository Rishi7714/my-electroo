// client/src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; {new Date().getFullYear()} My Electroo. All rights reserved.</p>
                <div className="footer-links">
                    <Link to="/about">About Us</Link> {/* Use Link */}
                    <Link to="/contact">Contact</Link> {/* Use Link */}
                    <Link to="/privacy">Privacy Policy</Link> {/* Use Link */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;