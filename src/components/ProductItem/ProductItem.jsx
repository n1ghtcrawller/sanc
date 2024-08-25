import React, { useState } from 'react';
import './ProductItem.css';
import { useNavigate } from "react-router-dom";
import ProductList from "../ProductList/ProductList";


export const ProductItem = ({ product, onAdd, onRemove }) => {
    const [count, setCount] = useState(0);
    const navigate = useNavigate(); // Используем useNavigate
    const handleAdd = () => {
        setCount(count + 1);
        onAdd(product);
    };


    const handleRemove = () => {
        if (count > 0) {
            setCount(count - 1);
            onRemove(product); // Вызываем функцию удаления
        }
    };

    const handleProductClick = () => {
        navigate(`/ProductPage/${product.id}`); // Переход к странице товара
    };

    return (
        <div className={"product"} onClick={handleProductClick}> {/* Добавляем обработчик клика на весь компонент */}
            <img className={"img"} src={product.img} alt={product.title} />
            <div className={"title"}>{product.title}</div>
            <div className={"price"}>
                <span>₽<b>{product.price}</b></span>
            </div>
        </div>
    );
};

export default ProductItem;