import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../ProductList/ProductList';
import "./ProductPage.css";

const ProductPage = ({ onAdd, onRemove }) => {
    const { id } = useParams();
    const product = products.find(item => item.id === parseInt(id));
    const [count, setCount] = useState(0);

    if (!product) {
        return <h2>Товар не найден</h2>;
    }

    const handleAdd = () => {
        setCount(count + 1);
        if (typeof onAdd === 'function') {
            onAdd(product);
        } else {
            console.error('onAdd is not a function');
        }
    };

    const handleRemove = () => {
        if (count > 0) {
            setCount(count - 1);
            if (typeof onRemove === 'function') {
                onRemove(product);
            } else {
                console.error('onRemove is not a function');
            }
        }
    };

    return (
        <div>
            <h1>{product.title}</h1>
            <img src={product.image} alt={product.title} />
            <p>{product.description}</p>
            <p>Цена: {product.price}₽</p>
            <div className="counter">
                {count === 0 ? (
                    <button className={'add-to-cart-btn'} onClick={handleAdd}>В корзину</button>
                ) : (
                    <>
                        <button className={'minus-btn'} onClick={handleRemove}>-</button>
                        <span className="count">{count}</span>
                        <button className={'add-btn'} onClick={handleAdd}>+</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductPage;