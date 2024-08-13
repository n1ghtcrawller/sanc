import { useEffect } from 'react';
import { useState } from "react";
import './App.css';
import { useTelegram } from "./hooks/useTelegram";
import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList/ProductList";
import Order from "./components/Order/Order";
import StartPage from "./components/Start/StartPage";
import ProductPage from "./components/ProductPage/ProductPage";
import { CartProvider } from "./components/CartProvider/CartContext";
import Form from "./components/Form/Form";

function App() {
    const { tg } = useTelegram();
    const [cartItems, setCartItems] = useState([]);

    const addItemToCart = (item) => {
        setCartItems((prevItems) => {
            const alreadyAdded = prevItems.find(i => i.product.id === item.product.id);
            if (alreadyAdded) {
                return prevItems.map(i =>
                    i.product.id === item.product.id
                        ? { ...i, count: i.count + item.count }
                        : i
                );
            } else {
                return [...prevItems, item];
            }
        });
    };

    useEffect(() => {
        tg.ready();
    }, [tg]);

    return (
        <div className="App">
            <Header />
            <CartProvider>
                <Routes>
                    <Route index element={<StartPage />} /> {/* Стартовая страница */}
                    <Route path={"products"} element={<ProductList />} /> {/* Измените путь на "products" */}
                    <Route path={"form"} element={<Form />} />
                    <Route path={"order"} element={<Order />} />
                    <Route path={"ProductPage/:id"} element={<ProductPage />} />
                </Routes>
            </CartProvider>
        </div>
    );
}

export default App;