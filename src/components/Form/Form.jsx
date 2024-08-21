import React, { useCallback, useEffect } from 'react';
import { useFormContext } from "../FormProvider/FormContext";
import { useTelegram } from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const Form = () => {
    const { setFormData } = useFormContext();
    const [city, setCity] = React.useState('');
    const [street, setStreet] = React.useState('');
    const [house, setHouse] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [subject, setSubject] = React.useState('Выберите способ доставки');
    const { tg } = useTelegram();
    const navigate = useNavigate();

    const formatPhoneNumber = (value) => {
        // Удаляем все нецифровые символы, кроме первой семерки
        const cleaned = ('' + value).replace(/\D/g, '');

        // Если длина очищенной строки меньше 1, возвращаем пустую строку
        if (cleaned.length < 1) return '+7 ';

        // Ограничиваем длину до 10 цифр (после семерки)
        const match = cleaned.slice(1).match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);

        if (match) {
            const formatted = [];
            formatted.push('+7 '); // Добавляем фиксированную семерку
            if (match[1]) formatted.push(`(${match[1]})`); // Код города
            if (match[2]) formatted.push(`${match[2]}`); // Первая часть номера
            if (match[3]) formatted.push(`-${match[3]}`); // Вторая часть номера
            if (match[4]) formatted.push(`-${match[4]}`); // Третья часть номера

            return formatted.join('').trim(); // Объединяем все части
        }

        return '+7 '; // Возвращаем только семерку, если нет совпадений
    };

// Пример использования:
    console.log(formatPhoneNumber('1234567890')); // +7 (123) 456-78-90
    console.log(formatPhoneNumber('')); // +7
    console.log(formatPhoneNumber('7')); // +7
    const onChangePhone = (e) => {
        const formattedPhone = formatPhoneNumber(e.target.value);
        setPhone(formattedPhone);
    };

    const onKeyPressPhone = (e) => {
        // Проверяем, что вводится только цифра или управляющий символ (например, Backspace)
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    };

    const onSendData = useCallback(() => {
        try {
            const data = { city, street, house, phone, email, subject };
            if (!city || !street || !house || !phone || !email || subject === 'Выберите способ доставки') {
                alert('Пожалуйста, заполните все поля!');
                return;
            }
            setFormData(data);
            navigate('/Confirm');
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        }
    }, [city, street, house, email, phone, subject, setFormData, navigate]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData, tg]);

    useEffect(() => {
        tg.MainButton.setParams({ text: 'Подтвердить данные' });
    }, [tg]);

    useEffect(() => {
        if (!city || !street || !house || !phone || !email) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [city, street, house, phone, email, tg]);

    const goBack = () => {
        navigate('/order');
    };

    return (
        <div className={"form"}>
            <button className="back-button" onClick={goBack}>Назад</button>
            <h3>Введите ваши данные</h3>
            <input className={"input-info"} type={"text"} placeholder={"Город"} value={city} onChange={(e) => setCity(e.target.value)} />
            <input className={"input-info"} type={"text"} placeholder={"Улица"} value={street} onChange={(e) => setStreet(e.target.value)} />
            <input className={"input-info"} type={"text"} placeholder={"Дом"} value={house} onChange={(e) => setHouse(e.target.value)} />
            <input className={"input-info"} type={"email"} placeholder={"Эл. почта"} value={email} onChange={(e) => setEmail(e.target.value)} />
            <input
                className={"input-info"}
                type={"text"}
                placeholder={"+7(___)__-__-__"}
                value={phone}
                onChange={onChangePhone}
                onKeyPress={onKeyPressPhone} // Добавляем обработчик нажатия клавиш
            />
            <select className={"select-delivery"} value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value={"Выберите способ доставки"}>Выберите способ доставки</option>
                <option value={"СДЭК"}>СДЭК</option>
                <option value={"BoxBerry"}>BoxBerry</option>
                <option value={"Yandex"}>Яндекс</option>
            </select>
        </div>
    );
};

export default Form;