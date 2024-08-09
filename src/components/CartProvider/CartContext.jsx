// import React, { createContext, useContext, useState, useCallback } from 'react';
//
// const CartContext = createContext();
//
// export const CartProvider = ({ children }) => {
//     const [addedItems, setAddedItems] = useState([]);
//
//     const getTotalPrice = (items = []) => {
//         return items.reduce((acc, item) => acc + item.product.price * item.count, 0);
//     };
//
//     const updateItems = (product, delta) => {
//         const alreadyAdded = addedItems.find(item => item.product.id === product.id);
//         let newItems;
//
//         if (alreadyAdded) {
//             newItems = addedItems.map(item => {
//                 if (item.product.id === product.id) {
//                     const newCount = item.count + delta;
//                     return { ...item, count: Math.max(newCount, 0) };
//                 }
//                 return item;
//             }).filter(item => item.count > 0);
//         } else if (delta > 0) {
//             newItems = [...addedItems, { product, count: 1 }];
//         } else {
//             newItems = addedItems;
//         }
//
//         setAddedItems(newItems);
//     };
//
//     const onAdd = (product) => updateItems(product, 1);
//     const onRemove = (product) => updateItems(product, -1);
//
//     return (
//         <CartContext.Provider value={{ addedItems, onAdd, onRemove, getTotalPrice }}>
//             {children}
//         </CartContext.Provider>
//     );
// };
//
// export const useCart = () => {
//     return useContext(CartContext);
// };
