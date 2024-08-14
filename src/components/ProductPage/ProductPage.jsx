import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { products } from '../ProductList/ProductList';
import { useTelegram } from '../../hooks/useTelegram';
import { useCart } from '../CartProvider/CartContext';
import './ProductPage.css';

const ProductPage = () => {
    const { tg } = useTelegram();
    const { id } = useParams();
    const navigate = useNavigate();
    const [inCart, setInCart] = useState(false);
    const [count, setCount] = useState(0);
    const [size, setSize] = useState('');
    const { addToCart, cartItems } = useCart();

    useEffect(() => {
        tg.MainButton.show();

        const totalCount = cartItems.reduce((acc, item) => acc + item.count, 0);

        tg.MainButton.setParams({
            text: `Перейти в корзину (${totalCount})`
        });

        const onMainButtonClick = () => {
            navigate('/order');
        };

        tg.onEvent('mainButtonClicked', onMainButtonClick);

        return () => {
            tg.offEvent('mainButtonClicked', onMainButtonClick);
        };
    }, [tg, cartItems]);

    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
        return <div>Товар не найден</div>;
    }

    const isButtonDisabled = !size;

    const handleAddToCartButton = () => {
        if (size) {
            const newCount = count + 1; // Увеличиваем количество
            setCount(newCount); // Обновляем локальное состояние
            addToCart(product, newCount, size, product.price); // Передаем актуальное количество и цену
            alert('Товар добавлен в корзину!');
            navigate('/products');
        } else {
            alert('Пожалуйста, выберите размер!');
        }
    };

    return (
        <div className="product-page">
            <button className="back-button">
                <Link to="/products" className="text-on-back-button">Назад</Link>
            </button>
            <div className="product-item">
                <img src={product.img} alt={product.title} />
                <div className="title">{product.title}</div>
                <div className="price"><h2>₽<b>{product.price}</b></h2></div>

                <select className="changeSize" onChange={(e) => setSize(e.target.value)} value={size}>
                    <option value="">Выберите размер</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                </select>
                <div className="buttons">
                    <button disabled={isButtonDisabled} className="add-to-cart-btn" onClick={handleAddToCartButton}>
                        Добавить в корзину
                    </button>
                </div>

                <div className="description"></div>
            </div>
        </div>
    );
};

export default ProductPage;
