import React, {  useEffect } from 'react';
import { useCart } from '../CartProvider/CartContext';
import { useNavigate} from "react-router-dom";
import { useTelegram } from '../../hooks/useTelegram';
import './Order.css'; // Импортируем стили


const Order = () => {
    const { tg } = useTelegram();
    const { cartItems, removeFromCart, updateItemCount } = useCart();
    const navigate = useNavigate();
    const redirectToForm = () => {
        navigate('/form')
    };

    const getTotalPrice = (items) => {
        return items.reduce((total, item) => total + item.product.price * item.count, 0);
    };

    const totalPrice = getTotalPrice(cartItems);


    useEffect(() => {
        tg.onEvent('mainButtonClicked', redirectToForm);
        tg.MainButton.setParams({
            text: `Продолжить`,
            is_visible: true,
        });

        return () => {
            tg.offEvent('mainButtonClicked', redirectToForm);
        };
    }, [redirectToForm, tg, totalPrice]);

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
    const goBack = () => {
        navigate('/products')
    }

    return (
        <div className="order-container">
            <button className='back-button' onClick={goBack}>
                Назад
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
                            <button className={'minus-btn'} onClick={() => handleDecrement(item)}>-</button>
                            <span>{item.count}</span>
                            <button className={'add-btn'} onClick={() => handleIncrement(item)}>+</button>
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
