import React, { useState } from 'react';
import './ProductItem.css';
import { useNavigate } from "react-router-dom";

export const ProductItem = ({ product }) => {

    const navigate = useNavigate(); // Используем useNavigate
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