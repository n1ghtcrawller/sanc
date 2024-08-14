import React, { createContext, useContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    };

    const addToCart = (product, count, size) => {
        setCartItems(prevItems => [
            ...prevItems,
            { product, count, size }
        ]);
    };

    const updateItemCount = (productId, newCount) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.product.id === productId ? { ...item, count: newCount } : item
            )
        );
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};