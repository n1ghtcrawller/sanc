import React, { useCallback, useEffect } from 'react';
import { useCart } from '../CartProvider/CartContext';
import { Link } from "react-router-dom";
import { useTelegram } from '../../hooks/useTelegram';
import './Order.css'; // Импортируем стили

const Order = () => {
    const { tg, queryId, user } = useTelegram();
    const { cartItems, removeFromCart, updateItemCount } = useCart();

    const getTotalPrice = (items) => {
        return items.reduce((total, item) => total + item.product.price * item.count, 0);
    };

    const totalPrice = getTotalPrice(cartItems);

    const onSendData = useCallback(() => {
        const productsToSend = cartItems.map(item => ({
            id: item.product.id,
            title: item.product.title,
            count: item.count,
            size: item.size,
            price: item.product.price
        }));

        const data = {
            products: productsToSend,
            totalPrice: totalPrice,
            queryId: queryId,
            chatId: user.id
        };

        fetch('https://keybasicsneutral.ru/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(`HTTP error! status: ${response.status}, message: ${text}`); });
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                tg.close();
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));

        tg.sendData(JSON.stringify(data));
    }, [cartItems, totalPrice, tg]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        tg.MainButton.setParams({
            text: `Отправить заказ на сумму ₽${totalPrice}`,
            is_visible: true,
        });

        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData, tg, totalPrice]);

    const handleRemoveFromCart = (productId) => {
        removeFromCart(productId);
    };

    const handleDecrement = (item) => {
        if (item.count > 1) {
            updateItemCount(item.product.id, item.count - 1);
        } else {
            handleRemoveFromCart(item.product.id);
        }
    };

    const handleIncrement = (item) => {
        updateItemCount(item.product.id, item.count + 1);
    };

    return (
        <div className="order-container">
            <button className='back-button'>
                <Link to="/products" className='text-on-back-button'>Назад</Link>
            </button>
            <h1>Ваш заказ</h1>
            {cartItems.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                cartItems.map((item, index) => (
                    <div key={index} className="product-item">
                        <h2>{item.product.title}</h2>
                        <p>Размер: <b>{item.size}</b></p>
                        <p>Цена за товар: ₽<b>{item.product.price * item.count}</b></p>
                        <p>Количество: </p>
                        <div className="counter">
                            <button className="minus-btn" onClick={() => handleDecrement(item.count)}>-</button>
                            <span>{item.count}</span>
                            <button className="add-btn" onClick={() => handleIncrement(item.count)}>+</button>
                        </div>
                        <button onClick={() => handleRemoveFromCart(item.product.id)} className="remove-button">Удалить</button>


                    </div>
                ))
            )}
            <h2 className="total-price">Общая стоимость заказа: ₽<b>{totalPrice}</b></h2>
        </div>
    );
};

export default Order;
