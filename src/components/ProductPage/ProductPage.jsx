import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../ProductList/ProductList';
import "./ProductPage.css"
import ProductItem from "../ProductItem/ProductItem";

const ProductPage = () => {
    const { id } = useParams();
    const product = products.find(item => item.id === parseInt(id));

    if (!product) {
        return <h2>Товар не найден</h2>;
    }



    return (
        <div>
            <h1>{product.title}</h1>
            <img src={product.image} alt={product.title} />
            <p>{product.description}</p>
            <p>Цена: {product.price}₽</p>
            <button>Купить</button>
        </div>
    );
};

export default ProductPage;