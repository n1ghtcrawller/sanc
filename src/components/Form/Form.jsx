
import React, { useCallback, useEffect } from 'react';
import { useTelegram } from "../../hooks/useTelegram";
import { useFormContext } from "../FormProvider/FormContext"; // Импортируйте контекст
import { useNavigate } from "react-router-dom";

const Form = () => {
    const { setFormData } = useFormContext();
    const [country, setCountry] = React.useState('');
    const [city, setCity] = React.useState('');
    const [street, setStreet] = React.useState('');
    const [house, setHouse] = React.useState('');
    const [flat, setFlat] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [subject, setSubject] = React.useState('Выберите способ доставки');

    const { tg } = useTelegram();
    const navigate = useNavigate();

    const onSendData = useCallback(() => {
        const data = {
            country,
            city,
            street,
            house,
            flat,
            phone,
            email,
            subject
        };
        setFormData(data); // Устанавливаем данные в контексте
        tg.sendData(JSON.stringify(data)); // Отправляем данные в Telegram

        // Перенаправляем на страницу Confirm
        navigate('/Confirm');
    }, [country, city, street, house, flat, email, phone, subject, setFormData, navigate]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData, tg]);

    useEffect(() => {
        tg.MainButton.setParams({
            'text': 'Отправить данные'
        });
    }, [tg]);

    useEffect(() => {
        if (!country && !city && !street && !house && !flat || !phone) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [country, city, street, house, flat, phone, tg]);

    const onChangeCountry = (e) => setCountry(e.target.value);
    const onChangeCity = (e) => setCity(e.target.value);
    const onChangeStreet = (e) => setStreet(e.target.value);
    const onChangeHouse = (e) => setHouse(e.target.value);
    const onChangeFlat = (e) => setFlat(e.target.value);
    const onChangeEmail = (e) => setEmail(e.target.value);
    const onChangePhone = (e) => setPhone(e.target.value);

    const onChangeSubject = (e) => setSubject(e.target.value);

    const goBack = () => {
        navigate('/order');
    };

    return (
        <div className={"form"}>
            <button className="back-button" onClick={goBack}>Назад</button>
            <h3>Введите ваши данные</h3>
            <input className={"input"} type={"text"} placeholder={"Страна"} value={country} onChange={onChangeCountry} />
            <input className={"input"} type={"text"} placeholder={"Город"} value={city} onChange={onChangeCity} />
            <input className={"input"} type={"text"} placeholder={"Улица"} value={street} onChange={onChangeStreet} />
            <input className={"input"} type={"text"} placeholder={"Дом"} value={house} onChange={onChangeHouse} />
            <input className={"input"} type={"text"} placeholder={"Квартира"} value={flat} onChange={onChangeFlat} />
            <input className={"input"} type={"text"} placeholder={"Эл. почта"} value={email} onChange={onChangeEmail} />
            <input className={"input"} type={"text"} placeholder={"Телефон"} value={phone} onChange={onChangePhone} />

            <select value={subject} onChange={onChangeSubject} className={"select-delivery"}>
                <option value={"Выберите способ доставки"}>Выберите способ


                    доставки</option>
                <option value={"sdek"}>СДЕК</option>
                <option value={"boxberry"}>BoxBerry</option>
            </select>
        </div>
    );
};

export default Form;
