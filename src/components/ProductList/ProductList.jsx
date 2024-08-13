import React, { useEffect } from 'react';
import './ProductList.css';
import { Link } from "react-router-dom"; // Импортируем Link
import { useTelegram } from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";

export const products = [
    { id: 1, title: 'Худи Deep-blue', price: 3500, description: 'Плотное оверсайз худи', img: "" },
    { id: 2, title: 'Худи Space', price: 3500, description: 'Плотное оверсайз худи', img: "" },
    { id: 3, title: 'Футболка milk', price: 1500, description: 'Плотная оверсайз футболка', img: "" },
    { id: 4, title: 'Футболка Space', price: 1500, description: 'Плотная оверсайз футболка', img: "" },
    { id: 5, title: 'Футболка KBN', price: 1500, description: 'Плотная оверсайз футболка', img: "" },
    { id: 6, title: 'Худи Stone', price: 2500, description: 'Плотное оверсайз худи', img: "" },
];

export const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + item.product.price * item.count, 0);
}

const ProductList = () => {
    const { tg } = useTelegram();
    const navigate = useNavigate();

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

    return (
        <div className="list">
            {products.map(item => (
                <Link to={`/ProductPage/${item.id}`} key={item.id} className="item">
                    {item.img && <img src={item.img} alt={item.title} />}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p className="price">Цена: ₽{item.price}</p>
                </Link>
            ))}
        </div>
    );
};

export default ProductList;