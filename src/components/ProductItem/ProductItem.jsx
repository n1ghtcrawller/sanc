import React, { useState } from 'react';
import './ProductItem.css';
import Button from "../Button/Button"; // Если он вам нужен, иначе можно удалить

const ProductItem = ({ product, className, onAdd, onRemove }) => {
    const [count, setCount] = useState(0);

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

    return (
        <div className={`product ${className}`}>
            <img className={"img"} src={product.img} alt={product.title} />
            <div className={"title"}>{product.title}</div>
            <div className={"price"}>
                <span>₽<b>{product.price}</b></span>
            </div>
            <div className="counter">
                <button className={'minus-btn'} onClick={handleRemove}>-</button>
                <span className="count">{count}</span>
                <button className={'add-btn'} onClick={handleAdd}>+</button>
            </div>
        </div>
    );
};

export default ProductItem;