import React, { useEffect, useState } from "react";
import './Header.css';
import close from '../../assets/close.svg';
import burger from '../../assets/burger.svg';
import logotype from '../../assets/logotype.svg';
import { useNavigate } from "react-router-dom";
import { useTheme } from '../ThemeProvider/ThemeContext';
import dark_logo from '../../assets/header_logo_dark.svg';
import dark_burger from '../../assets/dark_burger.svg';
import '../Start/StartPage.css'

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const scrollToBottom = () => {
        navigate('/');
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 0);
        setMenuOpen(false);
    };
    const scrollToQA= () => {
        navigate('/');
        setTimeout(() => {
            window.scrollTo(0,1000, document.body.scrollHeight);
        }, 0);
        setMenuOpen(false);
    };



    const redirectToProductList = () => {
        navigate('/');
        setMenuOpen(false)
    };
    const redirectToStartPage = () => {
        navigate('/');
        setMenuOpen(false)
    };
    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };


    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const logoSrc = theme === 'dark' ? dark_logo : logotype;
    const menuIconSrc = theme === 'dark' ? dark_burger : burger;

    return (
        <div className={`header ${theme}`}>
            <img src={logoSrc} alt="Logo" className="logotype" onClick={redirectToStartPage} />
            <img
                src={menuOpen ? close : menuIconSrc}
                alt="Menu Toggle"
                className="menu-icon"
                onClick={toggleMenu}
            />
            {menuOpen && (
                <div className={`menu ${menuOpen ? 'open' : ''}`}>
                    <img src={logoSrc} alt="Logo" className="logotype-in-menu" onClick={redirectToStartPage} />
                    <ul>
                        {/*<li>Футболки</li>*/}
                        {/*<li>Худи</li>*/}
                        {/*<li onClick={scrollToQA}>Часто задаваемые вопросы</li>*/}
                        <li onClick={scrollToBottom}>Контакты</li>
                        <li onClick={scrollToBottom}>Соц сети</li>
                        <li>
                            <button className={'shop-button-light'} onClick={redirectToProductList}>Перейти в магазин</button>
                        </li>
                    </ul>
                    <img src={close} alt="Close Menu" className="close-icon" onClick={toggleMenu} />
                </div>
            )}
        </div>
    );
};

export default Header;