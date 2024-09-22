import React, { useEffect, useState, useContext } from 'react';
import './ProductList.css';
import { Link, useNavigate } from "react-router-dom";
import { useTelegram } from "../../hooks/useTelegram";
import { CartContext } from "../CartProvider/CartContext";
import { fetchProducts } from '../api/api'; // Импортируем fetchProducts

export const products = []; // Глобальная переменная для хранения продуктов

const ProductList = () => {
    const { tg } = useTelegram();
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext);
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [selectedCategory, setSelectedCategory] = useState('Все');

    const goBack = () => {
        navigate('/');
    };

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

    // Получение продуктов с API
    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts();
            products.push(...data); // Сохраняем загруженные продукты в глобальную переменную
            setLoading(false); // Устанавливаем состояние загрузки в false
        };

        loadProducts();
    }, []);

    // Фильтруем товары по выбранной категории
    const filteredProducts = selectedCategory === 'Все'
        ? products
        : products.filter(product => product.category === selectedCategory);

    // Функция для определения стиля кнопки
    const getButtonStyle = (category) => {
        return selectedCategory === category
            ? { backgroundColor: '#071E57', color: '#F2EDEA' }
            : {};
    };

    if (loading) {
        return <div>Загрузка...</div>; // Отображаем индикатор загрузки
    }

    return (
        <div className="product-list">
            <button className="back" onClick={goBack}>&lt; назад</button>
            <div className="category-buttons">
                <button
                    className={'category-button'}
                    style={getButtonStyle('Футболки')}
                    onClick={() => setSelectedCategory('Футболки')}
                >
                    Футболки
                </button>
                <button
                    className={'category-button'}
                    style={getButtonStyle('Худи')}
                    onClick={() => setSelectedCategory('Худи')}
                >
                    Худи
                </button>
                <button
                    className={'category-button'}
                    style={getButtonStyle('Все')}
                    onClick={() => setSelectedCategory('Все')}
                >
                    Весь каталог
                </button>
            </div>

            <div className="list">
                {filteredProducts.map(item => (
                    <Link to={`/ProductPage/${item.id}`} key={item.id} className="item">
                        <img className={'image'} src={item.img} alt={item.title}/>
                        <h2>{item.title}</h2>
                        <div className={'size-prise'}>
                            <span className={'size'}>s/m/l/xl</span>
                            <span className={"item-price"}>Цена: ₽{item.price}</span>
                        </div>
                        <button className={'add-to-cart-button'}>Добавить в корзину</button>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
