import React from 'react';
import './ProductItem.css'
import Button from "../Button/Button";

const ProductItem = ({product, className, onAdd}) => {
    const onAddHandler = () =>  {
        onAdd(product);
    }
    return (
        <div className={"product"}>
            <img className={"img"} src={product.img} alt={product.title} />
            <div className={"title"}>{product.title}</div>
            <div className={"description"}>{product.description}</div>
            <div className={"price"}></div>
                <span>Цена: <b>{product.price}</b></span>
            <button className={'add-btn'} onClick={onAddHandler}>
                Добавить в корзину
            </button>
        </div>

    );
};

export default ProductItem;