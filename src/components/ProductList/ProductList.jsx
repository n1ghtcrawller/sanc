import React from 'react';
import './ProductList.css'
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";


const products = [
    {id: 1, title: 'Худи темно-серое', price: "3500",description: 'Плотное оверсайз худи'},
    {id: 2, title: 'Худи чёрное', price: "3500",description: 'Плотное оверсайз худи'},
    {id: 3, title: 'Футболка светло серая', price: "1500",description: 'Плотная оверсайз футболка'},
    {id: 4, title: 'Чёрная футболка', price: "1500",description: 'Плотная оверсайз футболка'},
    {id: 5, title: 'Белая футболка', price: "1500",description: 'Плотная оверсайз футболка'},
    {id: 6, title: 'Темно серые брюки', price: "2500",description: 'Лайфстайл брюки'},
    {id: 7, title: 'Черные брюки', price: "2500",description: 'Лайфстайл брюки'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price;
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = React.useState([])
    const {tg} = useTelegram();
    const onAdd = (product) => {
        const alreadyAdded = addedItems.filter(item => item.id !== product.id)
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id)
        }
        else {
            newItems = [...addedItems, product]
        }

        setAddedItems(newItems)

        if(newItems.length === 0){
            tg.MainButton.hide()
        }else {
            tg.MainButton.show()
            tg.MainButton.setParams({
                text: `Перейти к оплате ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className="list">
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