import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from "../FormProvider/FormContext";
import { useTelegram } from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const Form = () => {
    const { setFormData } = useFormContext();
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [house, setHouse] = useState('');
    const [suggestions, setSuggestions] = useState([]); // Новое состояние для подсказок
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('Самовывоз');
    const [comment, setComment] = useState('');
    const [office, setOffice] = useState('');
    const { tg } = useTelegram();
    const navigate = useNavigate();

    // Функция для получения подсказок из API
    const getGeoSuggestions = async (query) => {
        const apiKey = 'c325d89c-7fb1-44a9-af43-2d3bb7bd7411'; // Замените на ваш API ключ
        const url = `https://suggest-maps.yandex.ru/v1/suggest?apikey=${apiKey}&text=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setSuggestions(data.results.map((item) => item.text));
        } catch (error) {
            console.error('Ошибка при получении подсказок:', error);
        }
    };

    // Обработчик ввода для поля города
    const handleCityChange = (e) => {
        setCity(e.target.value);
        if (e.target.value.length > 2) { // Запрашивать только если текст > 2 символов
            getGeoSuggestions(e.target.value);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setCity(suggestion);
        setSuggestions([]); // Очистить список предложений после выбора
    };

    // Остальные функции остаются неизменными, например, formatPhoneNumber, onSendData и т.д.

    return (
        <div className={"form"}>
            <div className="back-container">
                <button className="back" onClick={goBack}>&lt; вернуться к заказу</button>
            </div>

            <div className={"title-div-order"}>
                <div className={"title"}>Оформление<br /> заказа</div>
            </div>
            <input className={"input-info"} type={"text"} placeholder={"ваше имя"} value={name}
                   onChange={(e) => setName(e.target.value)} />
            <input
                className={"input-info"}
                type={"text"}
                placeholder={"телефон"}
                value={phone}
                onChange={onChangePhone}
                onKeyPress={onKeyPressPhone}
            />
            <input className={"input-info"} type={"email"} placeholder={"Эл. почта"} value={email}
                   onChange={(e) => setEmail(e.target.value)} />
            <input
                className={"input-info"}
                type={"text"}
                placeholder={"населенный пункт"}
                value={city}
                onChange={handleCityChange} // Изменение обработчика для автозаполнения
            />
            {suggestions.length > 0 && (
                <ul className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}

            {/* Остальная часть формы */}

        </div>
    );
};

export default Form;
