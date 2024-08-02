import React, {useCallback, useEffect, useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import ProductPage from "../ProductPage/ProductPage";
import { useTelegram } from "../../hooks/useTelegram";

const products = [
    { id: 1, title: 'Худи темно-синее', price: 3500, description: 'Плотное оверсайз худи', img: "" },
    { id: 2, title: 'Худи чёрное', price: 3500, description: 'Плотное оверсайз худи', img: "" },
    { id: 3, title: 'Футболка молочного цвета', price: 1500, description: 'Плотная оверсайз футболка', img: "" },
    { id: 4, title: 'Чёрная футболка', price: 1500, description: 'Плотная оверсайз футболка', img: "" },
    { id: 5, title: 'Синяя футболка', price: 1500, description: 'Плотная оверсайз футболка', img: "" },
    { id: 6, title: 'Худи серое', price: 2500, description: 'Плотное оверсайз худи', img: "" },
];

export const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc + item.product.price * item.count; // Учитываем количество товара
    }, 0);
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://77.222.42.151:9000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;