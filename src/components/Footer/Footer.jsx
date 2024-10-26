import React, { useEffect } from 'react';
import { useTheme } from "../ThemeProvider/ThemeContext";
import './Footer.css'; // Убедитесь, что у вас есть файл стилей для футера
import minitg from '../../assets/minitg.svg'
import miniig from '../../assets/miniig.svg'
import miniemail from '../../assets/miniemail.svg'
import {useNavigate} from "react-router-dom";

const Footer = () => {
    const { theme } = useTheme();
    const copyToClipboard = () => {
        navigator.clipboard.writeText('info@kbn.ru')
            .then(() => {
                alert('Почта скопирована в буфер обмена!');
            })
            .catch(err => {
                console.error('Ошибка при копировании текста: ', err);
            });
    };

    const redirectToTg = () => {
        window.location.href = 'https://t.me/kbnwear'}

    const redirectToIg = () => {
        window.location.href = "https://www.instagram.com/kbnwear"
    }
    const redirectToMg = () => {
        window.location.href = 'https://t.me/kbn_mg';
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <div className={`footer ${theme}`} style={{
            backgroundColor: theme === 'dark' ? '#F2EDEA' : '#071E57',
            color: theme === 'dark' ? '#071E57' : '#F2EDEA'
        }}>
            <div className={'for-contact'}>
                <div className={'for-contact-text'}>
                    для связи
                </div>
                <div onClick={redirectToMg} className={'kbn_mg'}>
                    @kbn_mg
                </div>
                <div className={'info'} onClick={copyToClipboard}><img src={miniemail} className={'miniemail'}/> info@kbn.ru</div>
                <div className={'tg'} onClick={redirectToTg}><img src={minitg} className={'miniemail'}/>  @kbnwear</div>
                <div className={'ig'} onClick={redirectToIg}><img src={miniig} className={'miniemail'}/>  @kbnwear</div>
            </div>
        </div>
    );
};

export default Footer;