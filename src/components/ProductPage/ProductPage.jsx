import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import { fetchProducts } from '../api/api';
import { useTelegram } from '../../hooks/useTelegram';
import { useCart } from '../CartProvider/CartContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ProductPage.css';

const ProductPage = () => {
    const { tg } = useTelegram();
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [count, setCount] = useState(0);
    const [size, setSize] = useState('');
    const { addToCart, cartItems } = useCart();
    const [openQuestion, setOpenQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const questions = [
        { question: "Состав", answer: "100% Хлопок" },
        { question: "Политика возврата", answer: `Политика возврата KBN

Мы стремимся к тому, чтобы вы были довольны покупкой, но если изделие не подошло, вы можете вернуть его в течение 14 дней с момента получения.

Условия возврата:

1. Состояние товара: принимаем только новые, не ношенные вещи с сохранёнными ярлыками и упаковкой.
2. Возврат средств: деньги возвращаются тем же способом, которым был оплачен заказ, в течение 10 рабочих дней после получения возвращённого товара.
3. Процедура возврата: свяжитесь с нашей поддержкой, и мы вышлем инструкции по возврату товара. @kbn_mg

Обратите внимание: расходы на обратную доставку оплачивает покупатель, если товар не имеет брака.` },
        { question: "Как ухаживать", answer: `1. Стирка: 30°C, деликатный режим, без отбеливателя и кондиционеров для белья.
2. Сушка: без машинной сушки, расправьте на горизонтальной поверхности.
3. Глажка: редко требуется, но если нужно — с изнанки на низкой температуре.
4. Хранение: в сложенном виде или на плечиках, вдали от прямого света.

Следуйте этим советам, чтобы сохранить цвет и форму толстовок надолго!` }
    ];
    const redirectToMg = () => {
        window.location.href = 'https://t.me/kbn_mg';
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const handleSizeSelect = (selectedSize) => {
        setSize(selectedSize);
        setIsDropdownOpen(false);
    };
    const isButtonDisabled = !size;

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            const products = await fetchProducts();
            const foundProduct = products.find(p => p.id === parseInt(id));
            setProduct(foundProduct);
            setLoading(false);
        };
        loadProduct();
    }, [id]);

    useEffect(() => {
        tg.MainButton.show();
        const totalCount = cartItems.reduce((acc, item) => acc + item.count, 0);
        tg.MainButton.setParams({ text: `Перейти в корзину (${totalCount})` });

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

    const handleAddToCartButton = () => {
        if (size) {
            const newCount = count + 1;
            setCount(newCount);
            addToCart(product, newCount, size, product.price);
            alert('Товар добавлен в корзину!');
            navigate('/');
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

    // Определяем доступные размеры на основе категории продукта
    const availableSizes = product?.category === "Худи"
        ? ["S", "M", "L", "XL", "XXL"]
        : product?.category === "Футболки"
            ? ["XS", "S", "M", "L", "XL"]
            : [];

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!product) {
        return <div>Товар не найден</div>;
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
                <div className="price-container">
                    {product.old_price && <div className="old-price">₽{product.old_price}</div>}
                    <div className="price">₽{product.price}</div>
                </div>

                <div className="buttons">
                    <div className="dropdown">
                        <div className="dropdown-toggle" onClick={toggleDropdown}>
                            {size || "Выберите размер"}
                        </div>
                        {isDropdownOpen && (
                            <ul className="dropdown-menu">
                                {availableSizes.map((sizeOption) => (
                                    <li
                                        key={sizeOption}
                                        className="dropdown-item"
                                        onClick={() => handleSizeSelect(sizeOption)}
                                    >
                                        {sizeOption}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
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
                                    {openQuestion === index && <div className="answer">{item.answer}</div>}
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
