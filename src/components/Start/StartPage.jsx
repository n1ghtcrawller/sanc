import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartPage.css'; // Добавьте стили по необходимости
import logo from './KBN.jpg'; // Импортируйте изображение

const StartPage = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/products'); // Переход к списку продуктов
    };

    return (
        <div className="start-page">
            <img src={logo} alt="Логотип" className="logo"/>
            <button onClick={handleButtonClick} className="shop-button">
                В магазин
            </button>
        </div>
    );
};

export default StartPage;