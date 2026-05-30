// client/src/pages/AddProductPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrlPreview, setImageUrlPreview] = useState(''); 
    const [stock, setStock] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageUrlPreview(URL.createObjectURL(file)); // Create a preview URL
        } else {
            setImageFile(null);
            setImageUrlPreview('');
        }
    };

    const uploadFileHandler = async (file) => {
        const formData = new FormData();
        formData.append('image', file); // 'image' must match the field name in multer setup

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}` // If upload route is protected
                },
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Image upload failed');
            }

            const imageUrl = await response.text(); // Multer returns the path as plain text
            return imageUrl; // Return the URL
        } catch (err) {
            setError(err.message || 'Image upload failed');
            throw err; // Re-throw to be caught by handleSubmit
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (!name || !description || !price || !category || !stock) {
            setError('Please fill all required fields.');
            setLoading(false);
            return;
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            setError('Price must be a positive number.');
            setLoading(false);
            return;
        }
        if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
            setError('Stock must be a non-negative integer.');
            setLoading(false);
            return;
        }

        try {
            if (!user || user.role !== 'admin') {
                setError('You are not authorized to add products.');
                setLoading(false);
                return;
            }

            let uploadedImageUrl = '';
            if (imageFile) {
                uploadedImageUrl = await uploadFileHandler(imageFile);
            }

            const productData = {
                name,
                description,
                price: parseFloat(price),
                category,
                imageUrl: uploadedImageUrl || 'https://placehold.co/300x200/cccccc/333333?text=No+Image',
                stock: parseInt(stock)
            };

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(productData)
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add product');
            }

            setMessage('Product added successfully!');
            console.log('Product added:', productData);
            // Clear form
            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImageFile(null);
            setImageUrlPreview('');
            setStock('');
            setTimeout(() => navigate('/admin/products'), 2000); // Redirect to product management
        } catch (err) {
            setError(err.message || 'An error occurred while adding product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page container">
            <h1>Add New Product</h1>
            <div className="admin-form-card card">
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required disabled={loading}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price (₹)</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageFile">Product Image</label>
                        <input type="file" id="imageFile" accept="image/*" onChange={handleImageChange} disabled={loading} />
                        {imageUrlPreview && (
                            <img src={imageUrlPreview} alt="Product Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px', borderRadius: '8px' }} />
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock">Stock Quantity</label>
                        <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} min="0" required disabled={loading} />
                    </div>
                    <button type="submit" className="btn btn-primary admin-form-btn" disabled={loading}>
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;