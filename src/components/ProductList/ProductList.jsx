import React from 'react';
import './ProductList.css'
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";

const products = [
    {id: 1, title: 'Худи темно-серое', price: 3500, description: 'Плотное оверсайз худи', img: "/assets/gray-hoodie.png"},
    {id: 2, title: 'Худи чёрное', price: 3500, description: 'Плотное оверсайз худи', img: "/assets/black-hoodie-100.png"},
    {id: 3, title: 'Футболка светло серая', price: 1500, description: 'Плотная оверсайз футболка', img: "/assets/gray-t-shirt.png"},
    {id: 4, title: 'Чёрная футболка', price: 1500, description: 'Плотная оверсайз футболка', img: "/assets/black-t-shirt.png"},
    {id: 5, title: 'Белая футболка', price: 1500, description: 'Плотная оверсайз футболка', img: "/assets/white-t-shirt-100.png"},
    {id: 6, title: 'Темно серые брюки', price: 2500, description: 'Лайфстайл брюки', img: "/assets/gray-trousers-100.png"},
    {id: 7, title: 'Черные брюки', price: 2500, description: 'Лайфстайл брюки', img: "/assets/black-trousers-100.png"},
];

export const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.product.price * item.count; // Учитываем количество товара
    }, 0);
}

const ProductList = () => {
    const [addedItems, setAddedItems] = React.useState([]);
    const {tg} = useTelegram();

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.product.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            // Если товар уже добавлен, увеличиваем его количество
            newItems = addedItems.map(item => {
                if (item.product.id === product.id) {
                    return {...item, count: item.count + 1}; // Увеличиваем количество
                }
                return item;
            });
        } else {
            // Если товар не добавлен, добавляем его с количеством 1
            newItems = [...addedItems, {product, count: 1}];
        }

        setAddedItems(newItems);

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Перейти к оплате ${getTotalPrice(newItems)} ₽`
            });
        }
    };

    const onRemove = (product) => {
        const alreadyAdded = addedItems.find(item => item.product.id === product.id);
        
        if (alreadyAdded) {
            const newItems = addedItems.map(item => {
                if (item.product.id === product.id) {
                    if (item.count > 1) {
                        return {...item, count: item.count - 1}; // Уменьшаем количество
                    }
                }
                return item;
            }).filter(item => item.count > 0); // Удаляем товары с количеством 0

            setAddedItems(newItems);

            if (newItems.length === 0) {
                tg.MainButton.hide();
            } else {
                tg.MainButton.show();
                tg.MainButton.setParams({
                    text: `Перейти к оплате ${getTotalPrice(newItems)} ₽`
                });
            }
        }
    };


return (
        <div className="list">
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


