import React, { useEffect, useState } from 'react';

const Order = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const items = localStorage.getItem('addedItems');


        if (items) {
            setCartItems(JSON.parse(items)); // Получаем данные из localStorage
        }
    }, []);

    return (
        <div>
            <h1>Корзина</h1>
            {cartItems.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index}>
                            {item.product.title} - {item.count} шт. - ₽{item.product.price * item.count}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Order;
