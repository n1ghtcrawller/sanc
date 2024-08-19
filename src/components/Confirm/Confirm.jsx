import React from 'react';
import { useFormContext } from '../FormProvider/FormContext';
import { useCart } from '../CartProvider/CartContext';
import {Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";


const Confirm = () => {
    const { formData } = useFormContext();
    const { cartItems } = useCart();
    const navigate = useNavigate();

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