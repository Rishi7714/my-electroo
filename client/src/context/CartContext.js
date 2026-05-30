// client/src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage or as an empty array
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localCart = localStorage.getItem('cartItems');
            return localCart ? JSON.parse(localCart) : [];
        } catch (error) {
            console.error("Failed to parse cart items from localStorage", error);
            return [];
        }
    });

    // Save cart items to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        const existItem = cartItems.find(x => x.product === product._id);

        if (existItem) {
            setCartItems(
                cartItems.map(x =>
                    x.product === existItem.product
                        ? { ...existItem, quantity: existItem.quantity + quantity }
                        : x
                )
            );
        } else {
            setCartItems([...cartItems, {
                product: product._id, // Store product ID
                name: product.name,
                imageUrl: product.imageUrl,
                price: product.price,
                quantity,
            }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(x => x.product !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        setCartItems(
            cartItems.map(item =>
                item.product === id
                    ? { ...item, quantity: newQuantity }
                    : item
            ).filter(item => item.quantity > 0) // Remove if quantity drops to 0
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);