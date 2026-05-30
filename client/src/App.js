// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AddProductPage from './pages/AddProductPage';
import OrderManagementPage from './pages/OrderManagementPage';
import ProductManagementPage from './pages/ProductManagementPage';
import EditProductPage from './pages/EditProductPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CheckoutPage from './pages/CheckoutPage'; // NEW IMPORT
import ProfilePage from './pages/ProfilePage'; // NEW IMPORT
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; // Import global CSS

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            
            {/* Protected Routes for logged-in users */}
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} /> {/* NEW PROTECTED ROUTE */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> {/* NEW PROTECTED ROUTE */}

            {/* Admin Routes - Protected */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products/add" element={<ProtectedRoute adminOnly={true}><AddProductPage /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute adminOnly={true}><ProductManagementPage /></ProtectedRoute>} />
            <Route path="/admin/products/edit/:id" element={<ProtectedRoute adminOnly={true}><EditProductPage /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminOnly={true}><OrderManagementPage /></ProtectedRoute>} />

            {/* Catch-all for 404 Not Found */}
            <Route path="*" element={<h2 style={{textAlign: 'center', marginTop: '50px'}}>404 - Page Not Found</h2>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;