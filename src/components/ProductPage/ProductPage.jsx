import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../ProductList/ProductList';
import "./ProductPage.css";
import ProductItem from "../ProductItem/ProductItem";

const ProductPage = () => {
    const { id } = useParams();
    const product = products.find(item => item.id === parseInt(id));

    if (!product) {
        return <h2>Товар не найден</h2>;
    }

    const handleAddToCart = (product) => {
        console.log(`Добавлено в корзину: ${product.title}`);
    };

    const handleRemoveFromCart = (product) => {
        console.log(`Удалено из корзины: ${product.title}`);
    };

    return (
        <div>
            <Link to="/products" className="back-button">Назад</Link>
            <h1>{product.title}</h1>
            <img src={product.image} alt={product.title} />
            <p>{product.description}</p>
            <p>Цена: {product.price}₽</p>
            <button>Купить</button>

            {/* Используем ProductItem для отображения товара */}
            <ProductItem
                product={product}
                onAdd={handleAddToCart}
                onRemove={handleRemoveFromCart}
            />
        </div>
    );
};

export default ProductPage;