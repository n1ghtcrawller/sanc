import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../ProductList/ProductList';
import { useTelegram } from '../../hooks/useTelegram';
import { useCart } from '../CartProvider/CartContext';
import './ProductPage.css';

const ProductPage = () => {
    const { tg } = useTelegram();
    const { id } = useParams();
    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const [size, setSize] = useState('');
    const { addToCart, cartItems } = useCart();
    function toggleDescription() {
        const description = document.querySelector('.product-description');
        const button = document.querySelector('.toggle-button');

        description.classList.toggle('visible');

        // Изменение текста кнопки в зависимости от состояния
        if (description.classList.contains('visible')) {
            button.textContent = '▴ Скрыть описание';
        } else {
            button.textContent = '▾ Показать описание';
        }
    }

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
    const goBack = () => {
        navigate('/products');
    }

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
            <div className="product-item">
                <button className="back-button" onClick={goBack}>Назад</button>
                <img src={product.img} alt={product.title}/>
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

                <div className="product-container">
                    <button className="toggle-button" onClick={toggleDescription}>▾ Показать описание</button>
                    <div className="product-description hidden">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;