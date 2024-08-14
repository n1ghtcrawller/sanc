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
    const { addToCart } = useCart();

    useEffect(() => {
        tg.MainButton.show();
        tg.MainButton.setParams({
            text: 'Перейти в корзину'
        });

        const onMainButtonClick = () => {
            navigate('/order');
        };

        tg.onEvent('mainButtonClicked', onMainButtonClick);

        return () => {
            tg.offEvent('mainButtonClicked', onMainButtonClick);
        };
    }, [tg]);

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return <div>Товар не найден</div>;
    }

    const isButtonDisabled = !size;
    const totalPrice = product.price * count;

    const handleAddToCart = () => {
        setInCart(true);
        setCount(count + 1);
    };

    const handleAddToCartButton = () => {
        addToCart(product, count, size, totalPrice);
        // navigate('/order');
        alert('Товар добавлен в корзину!'); // Сообщение о добавлении
    };

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        if (count > 1) {
            setCount(count - 1);
        } else {
            setCount(0);
            setInCart(false);
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

                {inCart ? (
                    <div className="shopping-info-body">
                        <div className="counter">
                            <button className="minus-btn" onClick={handleDecrement}>-</button>
                            <span>{count}</span>
                            <button className="add-btn" onClick={handleIncrement}>+</button>
                        </div>
                        <div className="buttons">
                            <button onClick={handleAddToCartButton} className="add-to-cart-btn">В корзину</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <select className="changeSize" onChange={(e) => setSize(e.target.value)} value={size}>
                            <option value="">Выберите размер</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                        <div className="buttons">
                            <button disabled={isButtonDisabled} className="add-to-cart-btn" onClick={handleAddToCart}>
                                Добавить в корзину
                            </button>
                        </div>
                    </>
                )}
                <div className="description">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                </div>
                </div>
        </div>
    );
};

export default ProductPage;
