import React, {useCallback, useEffect} from 'react';
import { useFormContext } from '../FormProvider/FormContext';
import { useCart } from '../CartProvider/CartContext';
import {useNavigate} from "react-router-dom";
import { useTelegram } from '../../hooks/useTelegram';



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
            text: `Продолжить`,
            is_visible: true,
        });

        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData, tg, totalPrice]);


    if (!formData) {
        return null; // или можно вернуть какое-то сообщение
    }
    const goBack = () => {
        navigate('/form')
    }
    return (
        <div>
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
            {formData.length === 0 ? (
                <p>Данные не заполнены</p>
            ) : (
                formData.map((data, index) => (
                    <div key={index}>
                            <p>Страна: {data.country}</p>
                            <p>Город: {data.city}</p>
                            <p>Улица: {data.street}</p>
                            <p>Дом: {data.house}</p>
                            <p>Квартира: {data.flat}</p>
                            <p>Телефон: {data.phone}</p>
                            <p>Тип: {data.subject}</p>

                </div>
                    ))
                )}
        </div>
    );
};

export default Confirm;