import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products, getTotalPrice } from '../ProductList/ProductList';
import { useTelegram } from '../../hooks/useTelegram';
import './ProductPage.css';

const ProductPage = () => {
    const { tg } = useTelegram();
    const { id } = useParams(); // Получаем id из параметров маршрута
    const product = products.find(p => p.id === parseInt(id)); // Находим продукт по id
    const [count, setCount] = useState(0);
    const [size, setSize] = useState('');
    const [addedItems, setAddedItems] = useState([]);

    const updateMainButton = () => {
        if (addedItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: (`Перейти к оплате ${getTotalPrice(addedItems)} ₽`),
        });
        }
    };

    const handleAddItem = () => {
        if (size) {
            const alreadyAdded = addedItems.find(item => item.product.id === product.id);
            let newItems;

            if (alreadyAdded) {
                newItems = addedItems.map(item => {
                    if (item.product.id === product.id) {
                        return { ...item, count: item.count + count };
                    }
                    return item;
                });
            } else {
                newItems = [...addedItems, { product, count }];
            }

            setAddedItems(newItems);
            updateMainButton();
        }
    };

    const handleSizeChange = (e) => {
        setSize(e.target.value);
        if (count > 0) {
            tg.MainButton.show();
        }
    };

    if (!product) {
        return <div>Товар не найден</div>; // Обработка случая, если товар не найден
    }

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
                <button onClick={handleAddItem}>Добавить в корзину</button>
            </div>
        </div>
    );
};

export default ProductPage;