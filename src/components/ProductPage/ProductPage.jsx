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
            <div className="item-container">
                <button className="back" onClick={goBack}>&lt; назад </button>
                <img  className={'photo'} src={product.img} alt={product.title}/>
                <div className="title">{product.title}</div>
                <div className={'product-description'}>B - Basics: Базовые вещи. Слово указывает на то, что одежда предназначена для повседневного использования </div>
                <div className="price">₽{product.price}</div>
                <div className="buttons">
                    <select className="changeSize" onChange={(e) => setSize(e.target.value)} value={size}>
                        <option value="">Выберите размер</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                    <button disabled={isButtonDisabled} className="add-to-cart-btn" onClick={handleAddToCartButton}>
                        Добавить в корзину
                    </button>
                </div>
                <div className="product-container">

                </div>
            </div>
        </div>
    );
};

export default ProductPage;