// client/src/pages/EditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css'; // Reusing admin page styles

const EditProductPage = () => {
    const { id } = useParams(); // Get product ID from URL
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrlPreview, setImageUrlPreview] = useState(''); // For new image preview
    const [existingImageUrl, setExistingImageUrl] = useState(''); // To show current image
    const [stock, setStock] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false); // For form submission
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!user || user.role !== 'admin') {
                    setError('Not authorized to edit products.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`/api/products/${id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch product for editing');
                }

                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setCategory(data.category);
                setExistingImageUrl(data.imageUrl); // Set existing image
                setImageUrlPreview(data.imageUrl); // Also set preview to existing image
                setStock(data.stock);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching product.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProduct();
        }
    }, [id, user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageUrlPreview(URL.createObjectURL(file)); // Create a preview URL for the new image
        } else {
            setImageFile(null);
            setImageUrlPreview(existingImageUrl); // Revert to existing if no new file selected
        }
    };

    const uploadFileHandler = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Image upload failed');
            }

            const imageUrl = await response.text();
            return imageUrl;
        } catch (err) {
            setError(err.message || 'Image upload failed');
            throw err;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setSubmitting(true);

        if (!name || !description || !price || !category || !stock) {
            setError('Please fill all required fields.');
            setSubmitting(false);
            return;
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            setError('Price must be a positive number.');
            setSubmitting(false);
            return;
        }
        if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
            setError('Stock must be a non-negative integer.');
            setSubmitting(false);
            return;
        }

        try {
            if (!user || user.role !== 'admin') {
                setError('You are not authorized to update products.');
                setSubmitting(false);
                return;
            }

            let finalImageUrl = existingImageUrl;
            if (imageFile) { // Only upload if a new file is selected
                finalImageUrl = await uploadFileHandler(imageFile);
            }

            const productData = {
                name,
                description,
                price: parseFloat(price),
                category,
                imageUrl: finalImageUrl,
                stock: parseInt(stock)
            };

            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(productData)
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update product');
            }

            setMessage('Product updated successfully!');
            console.log('Product updated:', productData);
            setTimeout(() => navigate('/admin/products'), 2000); // Redirect to product management
        } catch (err) {
            setError(err.message || 'An error occurred while updating product.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading product for editing...</h2>;
    if (error) return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>{error}</h2>;
    if (!name) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Product not found or access denied.</h2>;

    return (
        <div className="admin-page container">
            <h1>Edit Product</h1>
            <div className="admin-form-card card">
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={submitting} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required disabled={submitting}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price (₹)</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" required disabled={submitting} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required disabled={submitting} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageFile">Product Image</label>
                        <input type="file" id="imageFile" accept="image/*" onChange={handleImageChange} disabled={submitting} />
                        {imageUrlPreview && (
                            <img src={imageUrlPreview} alt="Product Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px', borderRadius: '8px' }} />
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock">Stock Quantity</label>
                        <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} min="0" required disabled={submitting} />
                    </div>
                    <button type="submit" className="btn btn-primary admin-form-btn" disabled={submitting}>
                        {submitting ? 'Updating Product...' : 'Update Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProductPage;