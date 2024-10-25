import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from "../FormProvider/FormContext";
import { useTelegram } from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const API_KEY = 'YOUR_API_KEY'; // Укажите ваш API-ключ Яндекс Карт

const Form = () => {
    const { setFormData } = useFormContext();
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('Самовывоз');
    const [comment, setComment] = useState('');
    const [office, setOffice] = useState('');
    const [suggestions, setSuggestions] = useState([]); // Состояние для хранения предложений
    const { tg } = useTelegram();
    const navigate = useNavigate();

    const formatPhoneNumber = (value) => {
        const cleaned = ('' + value).replace(/\D/g, '');
        if (cleaned.length < 1) return '+7 ';
        const match = cleaned.slice(1).match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        if (match) {
            const formatted = [];
            formatted.push('+7 ');
            if (match[1]) formatted.push(`(${match[1]})`);
            if (match[2]) formatted.push(`${match[2]}`);
            if (match[3]) formatted.push(`-${match[3]}`);
            if (match[4]) formatted.push(`-${match[4]}`);
            return formatted.join('').trim();
        }
        return '+7 ';
    };

    const onChangePhone = (e) => {
        const formattedPhone = formatPhoneNumber(e.target.value);
        setPhone(formattedPhone);
    };

    const onKeyPressPhone = (e) => {
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    };

    const onSendData = useCallback(() => {
        try {
            const data = { name, city, address, phone, email, subject, comment, office };
            setFormData(data);
            navigate('/Confirm');
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        }
    }, [name, city, address, email, phone, subject, comment, setFormData, office, navigate]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData, tg]);

    useEffect(() => {
        tg.MainButton.setParams({ text: ' Оформить заказ' });
    }, [tg]);

    useEffect(() => {
        const isCourierValid = subject === 'Курьером' &&
            name && city && phone && email && address && office;

        const isPickupValid = subject === 'Самовывоз' &&
            name && city && phone && email;

        if (isCourierValid || isPickupValid) {
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    }, [name, city, address, phone, email, office, subject, tg]);

    // Функция для получения предложений по адресу
    const fetchSuggestions = async (query) => {
        if (query.length < 3) return; // Ограничение на минимальное количество символов
        try {
            const response = await fetch(
                `https://suggest-maps.yandex.ru/v1/suggest?apikey=${API_KEY}&text=${query}&print_address=1&attrs=uri`
            );
            const data = await response.json();
            setSuggestions(data.results || []);
        } catch (error) {
            console.error('Ошибка при получении данных от Яндекс Карт:', error);
        }
    };

    const handleAddressChange = (e) => {
        const value = e.target.value;
        setAddress(value);
        fetchSuggestions(value); // Вызов функции получения предложений
    };

    const selectSuggestion = (suggestion) => {
        setAddress(suggestion.title.text); // Устанавливаем выбранный адрес
        setSuggestions([]); // Очищаем предложения после выбора
    };

    const goBack = () => {
        navigate('/order');
    };

    return (
        <div className="form">
            <div className="back-container">
                <button className="back" onClick={goBack}>&lt; вернуться к заказу</button>
            </div>

            <div className="title-div-order">
                <div className="title">Оформление<br /> заказа</div>
            </div>

            <input
                className="input-info"
                type="text"
                placeholder="ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="input-info"
                type="text"
                placeholder="телефон"
                value={phone}
                onChange={onChangePhone}
                onKeyPress={onKeyPressPhone}
            />
            <input
                className="input-info"
                type="email"
                placeholder="Эл. почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="input-info"
                type="text"
                placeholder="населенный пункт"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />

            <div className="delivery">
                <div className="delivery-title">
                    <span>способ доставки</span>
                </div>
                <div className="delivery-options">
                    <label>
                        <input
                            type="radio"
                            value="Курьером"
                            checked={subject === 'Курьером'}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        Курьером
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="Самовывоз"
                            checked={subject === 'Самовывоз'}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        Самовывоз
                    </label>
                </div>
            </div>

            {subject === 'Курьером' && (
                <div>
                    <input
                        className="input-info"
                        type="text"
                        placeholder="адрес"
                        value={address}
                        onChange={handleAddressChange}
                    />
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => selectSuggestion(suggestion)}
                            >
                                {suggestion.title.text} - {suggestion.subtitle.text}
                            </li>
                        ))}
                    </ul>
                    <input
                        className="input-info"
                        type="text"
                        placeholder="квартира/офис"
                        value={office}
                        onChange={(e) => setOffice(e.target.value)}
                    />
                </div>
            )}

            <input
                className="input-info"
                type="text"
                placeholder="комментарий"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
        </div>
    );
};

export default Form;
