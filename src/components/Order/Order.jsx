import React, {  useEffect } from 'react';
import { useCart } from '../CartProvider/CartContext';
import { useNavigate} from "react-router-dom";
import { useTelegram } from '../../hooks/useTelegram';
import './Order.css';


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
            <div className="title-div">
                <div className="cart-title">КОРЗИНА</div>
            </div>
            <button className="back" onClick={goBack}>&lt; вернуться к выбору</button>
            {cartItems.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                cartItems.map((item, index) => (
                    <div key={index} className="product-item">
                        <div className="item-product-content">
                            <div className="item-product-img">
                                <img src={item.product.img}/>
                            </div>
                            <div className="item-product-description">
                                <p className="item-product-title">{item.product.title}</p>
                                <p>Размер: {item.size}</p>
                                <p>Количество: </p>
                                <div className="counter">
                                    <button className={'minus-btn'} onClick={() => handleDecrement(item)}>-</button>
                                    <span>{item.count}</span>
                                    <button className={'add-btn'} onClick={() => handleIncrement(item)}>+</button>
                                </div>
                                <button onClick={() => handleRemoveFromCart(item.product.id)}
                                        className="remove-button">Удалить
                                </button>
                                <span className="item-product-price">{item.product.price * item.count}₽</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
            <div className="display-total-price">
                <span className="total-price">Итого: {totalPrice}₽</span>
            </div>
        </div>
    );
};

export default Order;
