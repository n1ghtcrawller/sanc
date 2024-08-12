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
    const [inCart, setInCart] = useState(false); // состояние для отслеживания наличия товара в корзине

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
    const [count, setCount] = useState(0);
    const [size, setSize] = useState('');
    const { addToCart } = useCart();

    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };

    if (!product) {
        return <div>Товар не найден</div>;
    }

    const isButtonDisabled = !size;

    // Расчет общей стоимости
    const totalPrice = product.price * count;

    const handleAddToCart = () => {
        setInCart(true); // Устанавливаем состояние, что товар в корзине
        setCount(count + 1);
        // navigate('/order');
    };
    const handleAddToCartButton = () => {
        addToCart(product, count, size, totalPrice);
        navigate('/order');
    }
    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        if (count > 1) {
            setCount(count - 1);
        } else {
            setCount(0);
            setInCart(false); // Если количество 0, сбрасываем состояние
        }
    };

    return (
        <div>
            <button className={'back-button'}>
            <Link to="/products" className={'text-on-back-button'} >Назад</Link>
            </button>
            <div className="product-item">
                <img src={product.img} alt={product.title}/>
                <div className="title">{product.title}</div>
                <div className="price">₽<b>{product.price}</b></div>

                {/* Логика отображения кнопки и счетчика */}
                {inCart ? (
                    <div className={'shopping-info-body'}>
                    <div className="counter">
                        <button className={'minus-btn'} onClick={handleDecrement}>-</button>
                        <span>{count}</span>
                        <button className={'add-btn'} onClick={handleIncrement}>+</button>
                    </div>
                    <div>
                    <button onClick={handleAddToCartButton} className={'add-to-cart-btn'}>В корзину</button>
                    </div>
                    </div>

                ) : (
                    <>
                        <select className={'changeSize'} onChange={handleSizeChange} value={size}>
                            <option value="">Выберите размер</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                        <div>
                            <button disabled={isButtonDisabled} className={'add-to-cart-btn'}
                                    onClick={handleAddToCart}>Добавить в корзину
                            </button>
                        </div>
                    </>
                )}

                {/* Отображение общей стоимости */}
                {count > 0 && (
                    <div className="total-price">
                        Общая стоимость: <b>{totalPrice}</b>₽
                    </div>
                )}
            </div>
            <div className="description">{product.description}</div>
        </div>
    );
};

export default ProductPage;
