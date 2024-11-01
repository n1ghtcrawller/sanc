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
                name: formData.name,
                city: formData.city,
                address: formData.address,
                username: user.username,
                office: formData.office,
                phone: formData.phone,
                email: formData.email,
                subject: formData.subject,
                comment: formData.comment
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
        return null;
    }

    const goBack = () => {
        navigate('/form');
    };

    return (
        <div className="confirm-container">
            <button className="back" onClick={goBack}>&lt; вернуться к выбору</button>
            <h3>Подтверждение заказа</h3>
            {cartItems.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                cartItems.map((item, index) => (
                    <div key={index} className="product-item">
                        <div className="item-product-content-confirm">
                            <div className="item-product-img-confirm">
                                <img src={item.product.img} className="item-product-img-confirm"/>
                            </div>
                            <div className="item-product-description">
                                <p className="item-product-title">{item.product.title}</p>
                                <p>Размер: {item.size}</p>
                                <p>Количество: </p>
                                <div className="counter">
                                    <span>{item.count}</span>
                                </div>
                                <span className="item-product-price">{item.product.price * item.count}₽</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
            {/* Проверка на тип formData */}
            {typeof formData !== 'object' || Array.isArray(formData) ? (
                <p>Данные не заполнены</p>
            ) : (
                <div className="confirm-form">
                    {/*<p>Страна: {formData.country}</p>*/}
                    <p>имя: {formData.name}</p>
                    <p>телефон: {formData.phone}</p>
                    <p>почта: {formData.email}</p>
                    <p>cпособ получения: {formData.subject}</p>
                    <p>город: {formData.city}</p>
                    <p>адрес: {formData.address}</p>
                    <p>квартира: {formData.office}</p>
                    <p>комментарий: {formData.comment}</p>
                </div>
            )}
        </div>
    );
};

export default Confirm;
