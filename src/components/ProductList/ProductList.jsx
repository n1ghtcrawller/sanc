import React, { useCallback, useEffect } from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import { useTelegram } from "../../hooks/useTelegram";

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
    const [addedItems, setAddedItems] = React.useState([]);
    const { tg, queryId, user } = useTelegram();

    const onSendData = useCallback(() => {
        // Формируем массив с продуктами
        const productsToSend = addedItems.map(item => ({
            id: item.product.id,
            title: item.product.title,
            count: item.count,
            price: item.product.price
        }));

        const data = {
            products: productsToSend,
            totalPrice: getTotalPrice(addedItems),
            queryId,
            chatId: user.id // Добавляем chatId в данные
        };

        fetch('https://keybasicsneutral.ru/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(`HTTP error! status: ${response.status}, message: ${text}`); });
                }
                return response.json();
            })
            .then(data => console.log(data))
            .catch(error => console.error('There was a problem with the fetch operation:', error));

        tg.sendData(JSON.stringify(data));
    }, [addedItems]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        }
    }, [onSendData]);

    const updateItems = (product, delta) => {
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

    const onAdd = (product) => updateItems(product, 1);
    const onRemove = (product) => updateItems(product, -1);

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

    return (
        <div className="list">
            {products.map(item => (
                <ProductItem
                    key={item.id}
                    product={item}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
