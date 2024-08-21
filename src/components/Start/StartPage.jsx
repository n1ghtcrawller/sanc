import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeProvider/ThemeContext';
import './StartPage.css';
import logo from './KBN.jpg';
import logo2 from './туту.png';

const StartPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [currentLogo, setCurrentLogo] = useState(logo);
    const [fadeOut, setFadeOut] = useState(false);
    const [fadeIn, setFadeIn] = useState(true);

    const handleButtonClick = () => {
        navigate('/products');
    };

    const handleLogoClick = () => {
        setFadeOut(true);
        setFadeIn(false);

        setTimeout(() => {
            toggleTheme();
            setCurrentLogo(prevLogo => (prevLogo === logo ? logo2 : logo));
            setFadeOut(false);
            setFadeIn(true);
        }, 500);
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <div className={`start-page ${theme}`}>
            <span className="information">
                Сервис находится в режиме опытной эксплуатации. По всем вопросам, просьба обращаться к менеджеру
            </span>
            <img
                src={currentLogo}
                alt="Логотип"
                className={`logo ${fadeOut ? 'fade-out' : ''} ${fadeIn ? 'fade-in' : ''}`}
                onClick={handleLogoClick} // Добавлен обработчик клика на логотип
            />
            <span className="information">
                Нажмите на логотип для переключения темы
            </span>
            <button onClick={handleButtonClick} className="shop-button">
                В магазин
            </button>
        </div>
    );
};

export default StartPage;