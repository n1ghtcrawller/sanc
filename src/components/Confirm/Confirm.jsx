import React, { useCallback, useEffect } from 'react';
import { useFormContext } from '../FormProvider/FormContext';
import { useCart } from '../CartProvider/CartContext';
import { useNavigate } from "react-router-dom";
import { useTelegram } from '../../hooks/useTelegram';
import './Confirm.css'

const Confirm = () => {
    const getTotalPrice = (items) => {
        return items.reduce((total, item) => total + item.product.price * item.count, 0);
    };

    const { tg, queryId, user } = useTelegram();
    const { formData } = useFormContext();
    const { cartItems } = useCart();
    const navigate = useNavigate();
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
            chatId: user.id,
            deliveryInfo: {
                // country: formData.country,
                city: formData.city,
                street: formData.street,
                house: formData.house,
                // flat: formData.flat,
                phone: formData.phone,
                email: formData.email,
                subject: formData.subject
            }
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
    }, [cartItems, totalPrice, tg, queryId, user.id, formData]);

    useEffect(() => {
        tg.MainButton.show();
        tg.MainButton.setParams({
            text: "Подтвердить заказ"
        });

        tg.MainButton.onClick(onSendData);

        return () => {
            tg.MainButton.offClick(onSendData);
        };
    }, [onSendData, tg]);

    if (!formData) {
        return null; // или можно вернуть какое-то сообщение
    }

    const goBack = () => {
        navigate('/form');
    };

    return (
        <div className="confirm-container">
            <button className="back-button" onClick={goBack}>
                Назад
            </button>
            <h3>Подтверждение заказа</h3>
            {cartItems.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                cartItems.map((item, index) => (
                    <div key={index} className="product-item">
                        <h2>{item.product.title}</h2>
                        <p>Размер: <b>{item.size}</b>, кол-во: {item.count}, Цена:
                            ₽<b>{item.product.price * item.count}</b></p>
                    </div>
                ))
            )}
            {/* Проверка на тип formData */}
            {typeof formData !== 'object' || Array.isArray(formData) ? (
                <p>Данные не заполнены</p>
            ) : (
                <div>
                    {/*<p>Страна: {formData.country}</p>*/}
                    <p>Город: {formData.city}</p>
                    <p>Улица: {formData.street}</p>
                    <p>Дом: {formData.house}</p>
                    {/*<p>Квартира: {formData.flat}</p>*/}
                    <p>Телефон: {formData.phone}</p>
                    <p>Тип: {formData.subject}</p>
                </div>
            )}
        </div>
    );
};

export default Confirm;
