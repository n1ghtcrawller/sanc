import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { products } from '../ProductList/ProductList';
import { useTelegram } from '../../hooks/useTelegram';
import { useCart } from '../CartProvider/CartContext';
import './ProductPage.css';

const ProductPage = () => {
    const { tg } = useTelegram();
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find(p => p.id === parseInt(id));
    const [count, setCount] = useState(0);
    const [size, setSize] = useState('');
    const { addToCart } = useCart(); // используем хук для доступа к функции добавления

    const handleSizeChange = (e) => {
        setSize(e.target.value);
    }

    if (!product) {
        return <div>Товар не найден</div>;
    }

    const isButtonDisabled = count === 0 || !size;

    // Расчет общей стоимости
    const totalPrice = product.price * count;

    const handleAddToCart = () => {
        addToCart(product, count, size, totalPrice); // добавляем товар в корзину
        navigate('/order'); // перенаправляем на страницу заказа
    };

    return (
        <div>
            <Link to="/products" className="back-button">Назад</Link>
            <div className="product-item">
                <img src={product.img} alt={product.title} />
                <div className="title">{product.title}</div>
                <div className="price">₽<b>{product.price}</b></div>
                <div className="counter">
                    <button onClick={() => setCount(count + 1)}>+</button>
                    <span>{count}</span>
                    <button onClick={() => setCount(Math.max(count - 1, 0))}>-</button>
                </div>
                <select onChange={handleSizeChange} value={size}>
                    <option value="">Выберите размер</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                </select>
                <div>
                    <button disabled={isButtonDisabled} onClick={handleAddToCart}>Добавить в корзину</button>
                </div>
                {/* Отображение общей стоимости */}
                {count > 0 && (
                    <div className="total-price">
                        Общая стоимость: <b>{totalPrice}</b>₽
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPage;