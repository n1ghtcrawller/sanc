import React, { useCallback, useEffect } from 'react';
import { useCart } from '../CartProvider/CartContext';
import { Link } from "react-router-dom";
import { useTelegram } from '../../hooks/useTelegram';

const Order = () => {
    const { tg } = useTelegram();
    const { cartItems } = useCart();

    // Функция для расчета общей стоимости
    const getTotalPrice = (items) => {
        return items.reduce((total, item) => total + item.product.price * item.count, 0);
    };

    const totalPrice = getTotalPrice(cartItems);

    const onSendData = useCallback(() => {
        // Формируем массив с продуктами
        const productsToSend = cartItems.map(item => ({
            id: item.product.id,
            title: item.product.title,
            count: item.count,
            price: item.product.price
        }));

        const data = {
            products: productsToSend,
            totalPrice: totalPrice,
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
            .then(data => console.log(data))
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

    return (
        <div>
            <Link to="/products" className="back-button">Назад</Link>
            <h1>Ваш заказ</h1>
            {cartItems.map((item, index) => (
                <div key={index}>
                    <h2>{item.product.title}</h2>
                    <p>Количество: {item.count}</p>
                    <p>Размер: {item.size}</p>
                    {/* Отображение общей стоимости для данного товара */}
                    <p>Цена за товар: ₽<b>{item.product.price * item.count}</b></p>
                </div>
            ))}
            <h2>Общая стоимость заказа: ₽<b>{totalPrice}</b></h2>
        </div>
    );
};

export default Order;