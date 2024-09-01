import React, {useCallback, useEffect, useState} from 'react';
import { useFormContext } from "../FormProvider/FormContext";
import { useTelegram } from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const Form = () => {
    const { setFormData } = useFormContext();
    const [name, setName] = useState('');
    const [city, setCity] = React.useState('');
    const [street, setStreet] = React.useState('');
    const [house, setHouse] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [subject, setSubject] = React.useState('Выберите способ доставки');
    const [comment, setComment] = React.useState('');
    const [flat, setFlat] = React.useState('');
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
            const data = { name, city, street, house, phone, email, subject };
            if (!city || !name || !street || !house || !phone || !email || !subject || !flat) {
                alert('Пожалуйста, заполните все поля!');
                return;
            }
            setFormData(data);
            navigate('/Confirm');
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        }
    }, [name, city, street, house, email, phone, subject, comment, setFormData, flat, navigate]);

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
        if ( !name || !city || !street || !house || !phone || !email || !flat) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [name, city, street, house, phone, email,comment, flat, tg]);

    const goBack = () => {
        navigate('/order');
    };

    return (
        <div className={"form"}>
            <div className="back-container">
                <button className="back" onClick={goBack}>&lt; вернуться к заказу</button>
            </div>

            <div className={"title-div-order"}>
                <div className={"title"}>Оформление<br/> заказа</div>
            </div>
            <input className={"input-info"} type={"text"} placeholder={"ваше имя"} value={name}
                   onChange={(e) => setName(e.target.value)}/>
            <input
                className={"input-info"}
                type={"text"}
                placeholder={"телефон"}
                value={phone}
                onChange={onChangePhone}
                onKeyPress={onKeyPressPhone}
            />
            <input className={"input-info"} type={"email"} placeholder={"Эл. почта"} value={email}
                   onChange={(e) => setEmail(e.target.value)}/>
            <input className={"input-info"} type={"text"} placeholder={"населенный пункт"} value={city}
                   onChange={(e) => setCity(e.target.value)}/>
            <div className={"delivery"}>
                <div className={"delivery-title"}>
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

            <input className={"input-info"} type={"text"} placeholder={"улица"} value={street}
                   onChange={(e) => setStreet(e.target.value)}/>
            <input className={"input-info"} type={"text"} placeholder={"дом"} value={house}
                   onChange={(e) => setHouse(e.target.value)}/>
            <input className={"input-info"} type={"text"} placeholder={"квартира/офис"} value={flat}
                   onChange={(e) => setFlat(e.target.value)}/>
            <input className={"input-info"} type={"text"} placeholder={"комментарий"} value={comment}
                   onChange={(e) => setComment(e.target.value)}/>
            {/*<button className={"back-button"} onClick={onSendData}> Отправить данные </button>*/}
        </div>
    );
};

export default Form;