import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeProvider/ThemeContext';
import './StartPage.css';
import { products } from '../ProductList/ProductList';
import logo from './KBN.jpg';
import logo2 from './туту.png';
import tg from '../../assets/tg.svg';
import ig from '../../assets/ig.svg';

const StartPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [currentLogo, setCurrentLogo] = useState(logo);
    const [fadeOut, setFadeOut] = useState(false);
    const [fadeIn, setFadeIn] = useState(true);
    const [openQuestion, setOpenQuestion] = useState(null); // For tracking opened question
    const [randomImages, setRandomImages] = useState([]);

    const handleButtonClick = () => {
        navigate('/products');
    };

    const redirectToTg = () => {
        window.location.href = 'https://t.me/kbnwear';
    };

    const redirectToIg = () => {
        window.location.href = 'https://www.instagram.com/kbnwear';
    };

    const handleLogoClick = () => {
        setFadeOut(true);
        setFadeIn(false);

        setTimeout(() => {
            toggleTheme();
            setCurrentLogo((prevLogo) => (prevLogo === logo ? logo2 : logo));
            setFadeOut(false);
            setFadeIn(true);
        }, 500);
    };

    useEffect(() => {
        document.body.className = theme;

        // Select 3 random images from the products
        const getRandomImages = () => {
            const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
            const selectedProducts = shuffledProducts.slice(0, 3);
            const images = selectedProducts.map(product => product.images[0]);
            setRandomImages(images);
        };

        getRandomImages();
    }, [theme]);

    const questions = [
        {
            question: "Как заказать?",
            answer: "Чтобы сделать заказ, выберите нужный товар и добавьте его в корзину. Затем перейдите к оформлению заказа.",
        },
        {
            question: "Доставка и оплата?",
            answer: "Мы предлагаем несколько вариантов доставки. Оплатить заказ можно картой или наличными при получении.",
        },
        {
            question: "Как оформить возврат?",
            answer: "Для оформления возврата свяжитесь с нашей службой поддержки в течение 14 дней после получения товара.",
        },
    ];

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index); // Toggle question
    };

    return (
        <div className={`start-page ${theme}`}>
            <div className="subtitle">
                <div className="KeyBn">Key Basics Neutral</div>
            </div>
            <div className="subtitle">
                <span>Основа для твоего гардероба<br/><br/> Мы предлагаем базовую одежду, которая является не просто частью вашего гардероба, а его основой, идеально сочетая качество, удобство и элегантность</span>
            </div>
            <div className={"button-go-to-shop-on-the-start-page"}>
                <button onClick={handleButtonClick} className="shop-button-dark">
                    Перейти в магазин
                </button>
            </div>
            <div className="item-photos">
                {randomImages.map((img, index) => (
                    <img
                        key={index}
                        className="main-page-photo"
                        onClick={() => navigate(`/ProductPage/${index}`)}
                        src={img}
                        alt={`Product ${index + 1}`}
                    />
                ))}
            </div>

            <div className="philosophy">
                <div className={'philosophy-title'}>OUR PHILOS<br/>OPHY.</div>
                <div className={'philosophy-text'}>
                    Наша философия заключается в том, чтобы выглядеть стильно и ощущать комфорт и удобство,
                    придерживаясь простоты и удобства. Важно понимать, что истинная красота и уверенность в себе
                    проявляются сквозь нас самих, а не только через одежду.
                </div>
            </div>
            <div className={'buy-now'}>
                <div className={'buy-now-text'}>КУПИТЕ УЖЕ <br/>СЕЙЧАС.</div>
                <div className={'buy-now-button'}>
                    <button onClick={handleButtonClick} className="shop-button-light">
                        Перейти в магазин
                    </button>
                </div>
            </div>
            <div className={'qa'}>
                <div className={'qa-title'}>Q/A</div>
            </div>
            <div className={'qa-content-start-page'}>
                <ul>
                    {questions.map((item, index) => (
                        <li key={index} className={'list-item'}>
                            <div onClick={() => toggleQuestion(index)} className="question-button">
                                {item.question}
                            </div>
                            {openQuestion === index && (
                                <div className="answer">
                                    {item.answer}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={'qa'}>
                <div className={'qa-title'}>КОНТАКТЫ</div>
            </div>
            <div className={'contacts-content'}>
                <div className={'go-to-manager'}>
                    По всем возникающим вопросам вы можете написать нашему менеджеру в ТГ
                </div>
                <div className={'contacts-msg'}>
                    @kbn_mg
                </div>
            </div>
            <div className={'join-us'}>
                <div className={'qa-title'}>ПРИСОЕДИНЯЙСЯ</div>
                <div className={'buttons-join-us'}>
                    <div className={'society'}>
                        <img onClick={redirectToIg} className={'instagram'} src={ig}/>
                        <img onClick={redirectToTg} className={'telegram'} src={tg}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartPage;
