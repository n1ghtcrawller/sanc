import React, {useCallback, useEffect} from 'react';
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
    const [addedItems, setAddedItems] = React.useState([]);
    const { tg, queryId } = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://77.222.42.151:8000/web-data', {
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
    }, [onSendData]);

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.product.id === product.id);
        let newItems;

        if (alreadyAdded) {
            // Если товар уже добавлен, увеличиваем его количество
            newItems = addedItems.map(item => {
                if (item.product.id === product.id) {
                    return { ...item, count: item.count + 1 }; // Увеличиваем количество
                }
                return item;
            });
        } else {
            // Если товар не добавлен, добавляем его с количеством 1
            newItems = [...addedItems, { product, count: 1 }];
        }

        setAddedItems(newItems);
        updateMainButton(newItems);
    };

    const onRemove = (product) => {
        const alreadyAdded = addedItems.find(item => item.product.id === product.id);

        if (alreadyAdded) {
            const newItems = addedItems.map(item => {
                if (item.product.id === product.id) {

                    return { ...item, count: item.count - 1 }; // Уменьшаем количество

                }
                return item;
            }).filter(item => item.count > 0); // Удаляем товары с количеством 0

            setAddedItems(newItems);
            updateMainButton(newItems);
        }
    };

    const updateMainButton = (items) => {
        if (items.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
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
                    onAdd={onAdd}
                    onRemove={onRemove}
                    className={'item'}
                />

            ))}
            {products.map(item => (
                <ProductItem
                    key={item.id}
                    product={item}
                    onAdd={onAdd}
                    onRemove={onRemove} // Передаем функцию удаления
                    className={'item'}
                />

            ))}

        </div>
    );
};

export default ProductList;