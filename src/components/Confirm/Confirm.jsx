import React, { useCallback, useEffect } from 'react';
import { useFormContext } from '../FormProvider/FormContext';
import { useCart } from '../CartProvider/CartContext';
import { useNavigate } from "react-router-dom";
import { useTelegram } from '../../hooks/useTelegram';
import './Confirm.css';

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
                name: formData.name,
                city: formData.city,
                street: formData.street,
                house: formData.house,
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

    useEffect(() => {
        // Динамическое подключение скрипта для Tinkoff
        const script = document.createElement('script');
        script.src = "https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (!formData) {
        return null; // или можно вернуть какое-то сообщение
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
                                <img src={item.product.img} className="item-product-img-confirm" alt={item.product.title}/>
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

            {typeof formData !== 'object' || Array.isArray(formData) ? (
                <p>Данные не заполнены</p>
            ) : (
                <div className="confirm-form">
                    <p>имя: {formData.name}</p>
                    <p>телефон: {formData.phone}</p>
                    <p>почта: {formData.email}</p>
                    <p>cпособ получения: {formData.subject}</p>
                    <p>город: {formData.city}</p>
                    <p>Улица: {formData.street}</p>
                    <p>дом: {formData.house}</p>
                    <p>квартира: {formData.office}</p>
                    <p>комментарий: {formData.comment}</p>
                </div>
            )}

            {/* Форма оплаты Тинькофф */}
            <form className="payform-tbank" name="payform-tbank" id="payform-tbank">
                <input className="payform-tbank-row" type="hidden" name="terminalkey" value="25471612"/>
                <input className="payform-tbank-row" type="hidden" name="frame" value="false"/>
                <input className="payform-tbank-row" type="hidden" name="language" value="ru"/>
                <input className="payform-tbank-row" type="hidden" name="receipt" value=""/>
                <input className="payform-tbank-row" type="text" placeholder="Сумма заказа" name="amount" required/>
                <input className="payform-tbank-row" type="hidden" name="order"/>
                <input className="payform-tbank-row" type="text" placeholder="Описание заказа" name="description"/>
                <input className="payform-tbank-row" type="text" placeholder="ФИО плательщика" name="name"/>
                <input className="payform-tbank-row" type="email" placeholder="E-mail" name="email"/>
                <input className="payform-tbank-row" type="tel" placeholder="Контактный телефон" name="phone"/>
                <input className="payform-tbank-row payform-tbank-btn" type="submit" value="Оплатить"/>
            </form>
        </div>
    );
};

export default Confirm;
