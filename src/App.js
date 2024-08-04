import { useEffect } from 'react';
import './App.css';
import { useTelegram } from "./hooks/useTelegram";
import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList/ProductList";
// import Order from "./components/Order/Order";
// import Form from "./components/Form/Form";
import StartPage from "./components/Start/StartPage"; // Импортируйте новый компонент
import ProductPage  from "./components/ProductPage/ProductPage";

function App() {
  const { tg } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, [tg]);

  return (
      <div className="App">
        <Header />
        <Routes>
          <Route index element={<StartPage />} /> {/* Стартовая страница */}
          <Route path={"products"} element={<ProductList />} /> {/* Измените путь на "products" */}
          {/*<Route path={"form"} element={<Form />} />*/}
          {/*<Route path={"order"} element={<Order />} />*/}
            <Route path={"ProductPage/:id"} element={<ProductPage />} />
        </Routes>
      </div>
  );
}

export default App;