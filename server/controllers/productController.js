// server/controllers/productController.js
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice } = req.query;
        let query = {};

        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' }; // Case-insensitive search
        }
        if (category) {
            query.category = category;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching product' });
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const { name, description, price, category, imageUrl, stock } = req.body;

    if (!name || !description || !price || !category || !stock) {
        return res.status(400).json({ message: 'Please fill all required fields' });
    }

    try {
        const product = new Product({
            name,
            description,
            price,
            category,
            imageUrl: imageUrl || 'https://placehold.co/300x200/cccccc/333333?text=No+Image',
            stock,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating product' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { name, description, price, category, imageUrl, stock } = req.body; // imageUrl now comes from frontend upload

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name !== undefined ? name : product.name;
            product.description = description !== undefined ? description : product.description;
            product.price = price !== undefined ? price : product.price;
            product.category = category !== undefined ? category : product.category;
            product.imageUrl = imageUrl !== undefined ? imageUrl : product.imageUrl; // Update imageUrl
            product.stock = stock !== undefined ? stock : product.stock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating product' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne(); // Use deleteOne() for Mongoose 6+
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};