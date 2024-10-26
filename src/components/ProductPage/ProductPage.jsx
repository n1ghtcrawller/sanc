import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import { fetchProducts } from '../api/api'; // Import the function to fetch products
import { useTelegram } from '../../hooks/useTelegram';
import { useCart } from '../CartProvider/CartContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ProductPage.css';

const ProductPage = () => {
    const { tg } = useTelegram();
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null); // State for the current product
    const [count, setCount] = useState(0);
    const [size, setSize] = useState('');
    const { addToCart, cartItems } = useCart();
    const [openQuestion, setOpenQuestion] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const questions = [
        {
            question: "Состав",
            answer: "100% Хлопок"
        },
        {
            question: "Политика возврата",
            answer: "Если вы получили товар ненадлежащего качества, вы можете вернуть его в течение 14 дней с момента получения. Пожалуйста, свяжитесь с нашей службой поддержки для получения инструкций. Мы обработаем ваш возврат и вернем средства тем же способом, которым была осуществлена оплата, в течение 7-10 рабочих дней. Товары, поврежденные или использованные не по назначению, не подлежат возврату."
        },
        {
            question: "Как ухаживать",
            answer: "Стирать на 30 градусах без сушки и без отжима, сушить на горизонтальной поверхности"
        }
    ];
    const redirectToMg = () => {
        window.location.href = 'https://t.me/kbn_mg';
    };

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true); // Start loading
            const products = await fetchProducts();
            const foundProduct = products.find(p => p.id === parseInt(id));
            setProduct(foundProduct);
            setLoading(false); // End loading
        };
        loadProduct();
    }, [id]);

    useEffect(() => {
        tg.MainButton.show();
        const totalCount = cartItems.reduce((acc, item) => acc + item.count, 0);

        tg.MainButton.setParams({
            text: `Перейти в корзину (${totalCount})`
        });

        const onMainButtonClick = () => {
            navigate('/order');
        };
        tg.onEvent('mainButtonClicked', onMainButtonClick);

        return () => {
            tg.offEvent('mainButtonClicked', onMainButtonClick);
        };
    }, [tg, cartItems]);

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    const isButtonDisabled = !size;


    const handleAddToCartButton = () => {
        if (size) {
            const newCount = count + 1;
            setCount(newCount);
            addToCart(product, newCount, size, product.price);
            alert('Товар добавлен в корзину!');
            navigate('/order');
        } else {
            alert('Пожалуйста, выберите размер!');
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 200,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    if (loading) {
        return <div>Загрузка...</div>; // While loading
    }

    if (!product) {
        return <div>Товар не найден</div>; // If product not found
    }

    return (
        <div className="product-page">
            <div className="item-container">

                <Slider {...settings}>
                    {product.images.map((image, index) => (
                        <div key={index}>
                            <img className="photo" src={image} alt={`Product image ${index + 1}`} />
                        </div>
                    ))}
                </Slider>

                <div className="title">{product.title}</div>
                <div className={'product-description'}>
                    B - Basics: Базовые вещи. Слово указывает на то, что одежда предназначена для повседневного использования
                </div>
                <div className="price-container">
                    {product.old_price && (
                        <div className="old-price">₽{product.old_price}</div>
                    )}
                    <div className="price">₽{product.price}</div>
                </div>
                {/* Display product quantity */}
                {/*<div className="quantity">Осталось: {product.count}</div> /!* Assuming product.quantity exists *!/*/}

                <div className="buttons">
                    <select className="changeSize" onChange={(e) => setSize(e.target.value)} value={size}>
                        <option value="">Выберите размер</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                    <button disabled={isButtonDisabled} className="add-to-cart-btn" onClick={handleAddToCartButton}>
                        Добавить в корзину
                    </button>
                </div>
                <div className="product-container">
                    <div className={'qa-content'}>
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
                </div>
                <div className={'subtitle-ctcs'}>
                    <div className="contacts-subtitle">КОНТАКТЫ</div>
                </div>
                <div className={'contacts-div'}>
                    <div className={'contacts-message'}>
                        По всем возникающим вопросам вы можете написать нашему менеджеру в ТГ
                    </div>
                    <div onClick={redirectToMg} className={'contacts-link'}>
                        @kbn_mg
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
