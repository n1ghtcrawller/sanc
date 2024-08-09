import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();


export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const handleAdd = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, count: item.count + 1 }
                        : item
                );
            }
            return [...prevItems, { product, count: 1 }];
        });
    };

    const handleRemove = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id);
            if (existingItem.count > 1) {
                return prevItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, count: item.count - 1 }
                        : item
                );
            }
            return prevItems.filter(item => item.product.id !== product.id);
        });
    };

    const getTotalPrice = () => {
        return cartItems.reduce((acc, item) => acc + item.product.price * item.count, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, handleAdd, handleRemove, getTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};