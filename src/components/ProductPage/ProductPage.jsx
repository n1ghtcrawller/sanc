import React, {useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import {getTotalPrice, products} from '../ProductList/ProductList';
import "./ProductPage.css";
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";



const ProductPage = ({ onAdd, onRemove }) => {

    const { tg, queryId, user } = useTelegram();



    const updateMainButton = (items) => {
        if (items.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams


            ({
                text: `Перейти к оплате ${getTotalPrice(items)} ₽`
            });
        }
    };
    const [addedItems, setAddedItems] = React.useState([]);
    const updatedItems = (product, delta) => {
        const alreadyAdded = addedItems.find(item => item.product.id === product.id);
        let newItems;

        if (alreadyAdded) {
            newItems = addedItems.map(item => {
                if (item.product.id === product.id) {
                    const newCount = item.count + delta;
                    return { ...item, count: Math.max(newCount, 0) };
                }
                return item;
            }).filter(item => item.count > 0);
        } else if (delta > 0) {
            newItems = [...addedItems, { product, count: 1 }];
        } else {
            newItems = addedItems;
        }

        setAddedItems(newItems);
        updateMainButton(newItems);
    };

    const onAddItem = (product) => updatedItems(product, 1);
    const onRemoveItem = (product) => updatedItems(product, -1);
    const [count, setCount] = useState(0);
    const { id } = useParams();
    const product = products.find(item => item.id === parseInt(id));


    if (!product) {
        return <h2>Товар не найден</h2>;
    }

    const handleAddItem = () => {
        setCount(count + 1);
        onAddItem(product);
    };

    const handleRemoveItem = () => {
        if (count > 0) {
            setCount(count - 1);
            onRemoveItem(product); // Вызываем функцию удаления
        }
    };

    return (
        <div>
            <Link to="/products" className="back-button">Назад</Link>

                <img className={"img"} src={product.img} alt={product.title}/>
                <div className={"title"}>{product.title}</div>
                <div className={"price"}>
                    <span>₽<b>{product.price}</b></span>
                </div>
                <div className="counter">
                    {count === 0 ? (
                        <button className={'add-to-cart-btn'} onClick={handleAddItem}>В корзину</button>
                    ) : (
                        <>
                            <button className={'minus-btn'} onClick={handleRemoveItem}>-</button>
                            <span className="count">{count}</span>
                            <button className={'add-btn'} onClick={handleAddItem}>+</button>
                        </>
                    )}
                </div>
        </div>
    );
};

export default ProductPage;