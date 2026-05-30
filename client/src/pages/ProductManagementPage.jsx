// client/src/pages/ProductManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext';
import './AdminPage.css'; // Reusing admin page styles
import './ProductManagementPage.css'; // Specific styles for this page

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null); // For success/error messages after actions
    const { user } = useAuth(); // To get the admin token
    const navigate = useNavigate(); // Initialize navigate

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!user || user.role !== 'admin') {
                setError('You are not authorized to view products.');
                setLoading(false);
                return;
            }

            const response = await fetch('/api/products', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) { // Only fetch if user is available (and thus auth context is ready)
            fetchProducts();
        }
    }, [user]); // Re-fetch when user object changes (e.g., after login/logout)

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                if (!user || user.role !== 'admin') {
                    setError('You are not authorized to delete products.');
                    return;
                }

                const response = await fetch(`/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to delete product');
                }

                setMessage('Product deleted successfully!');
                // Remove the product from the local state
                setProducts(products.filter(p => p._id !== productId));
                setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
            } catch (err) {
                setError(err.message || 'An error occurred during deletion.');
                setTimeout(() => setError(null), 3000);
            }
        }
    };

    const handleEditProduct = (productId) => {
        navigate(`/admin/products/edit/${productId}`); // Navigate to the edit page
    };


    if (loading) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading products...</h2>;
    if (error) return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>{error}</h2>;

    return (
        <div className="admin-page container">
            <h1>Product Management</h1>
            <Link to="/admin/products/add" className="btn btn-primary add-new-product-btn">Add New Product</Link>
            {message && <p className="success-message">{message}</p>}
            {products.length === 0 ? (
                <p style={{textAlign: 'center', fontSize: '1.2rem', color: 'var(--secondary-color)', marginTop: '20px'}}>No products found. Add some products!</p>
            ) : (
                <div className="product-management-list card">
                    <table className="product-management-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th> {/* Added Image column */}
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>
                                        <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => e.target.src = 'https://placehold.co/50x50/cccccc/333333?text=N/A'}/>
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>₹{product.price.toFixed(2)}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <button onClick={() => handleEditProduct(product._id)} className="btn btn-secondary edit-btn">Edit</button>
                                        <button onClick={() => handleDeleteProduct(product._id)} className="btn btn-secondary delete-btn">Delete</button>
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

export default ProductManagementPage;