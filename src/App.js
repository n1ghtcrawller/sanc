import { useEffect } from 'react';
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
import Confirm from "./components/Confirm/Confirm";
import { FormProvider } from "./components/FormProvider/FormContext";

function App() {
    const { tg } = useTelegram();
    useEffect(() => {
        tg.ready();
    }, [tg]);

    return (
        <div className="App">
            <Header />
            <CartProvider>
                <FormProvider>
                <Routes>
                    <Route index element={<StartPage />} />
                    <Route path={"products"} element={<ProductList />} />
                    <Route path={"order"} element={<Order />} />
                    <Route path={"ProductPage/:id"} element={<ProductPage />} />
                    <Route path={"form"} element={<Form />} />
                    <Route path={"confirm"} element={<Confirm />} />
                </Routes>
            </FormProvider>
            </CartProvider>
        </div>
    );
}

export default App;