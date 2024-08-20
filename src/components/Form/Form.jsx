
import React, { useCallback, useEffect } from 'react';
import { useTelegram } from "../../hooks/useTelegram";
import { useFormContext } from "../FormProvider/FormContext"; // Импортируйте контекст
import { useNavigate } from "react-router-dom";
import "./Form.css"
const Form = () => {
    const { setFormData } = useFormContext();
    // const [country, setCountry] = React.useState('');
    const [city, setCity] = React.useState('');
    const [street, setStreet] = React.useState('');
    const [house, setHouse] = React.useState('');
    // const [flat, setFlat] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [subject, setSubject] = React.useState('Выберите способ доставки');

    const { tg } = useTelegram();
    const navigate = useNavigate();

    const onSendData = useCallback(() => {
        try {
            const data = {
                city,
                street,
                house,
                phone,
                email,
                subject
            };

            // Проверка на пустые поля (можете изменить логику валидации по необходимости)
            if ( !city || !street || !house  || !phone || !email || subject === 'Выберите способ доставки') {
                alert('Пожалуйста, заполните все поля!');
                return;
            }
            setFormData(data); // Устанавливаем данные в контексте
            navigate('/Confirm'); // Перенаправляем на страницу Confirm
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        }
    }, [ city, street, house, email, phone, subject, setFormData, navigate]);
    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData, tg]);

    useEffect(() => {
        tg.MainButton.setParams({
            'text': 'Подтвердить данные'
        });
    }, [tg]);

    useEffect(() => {
        if ( !city || !street || !house || !phone || !email ) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [ city, street, house, phone, email, tg]);

    // const onChangeCountry = (e) => setCountry(e.target.value);
    const onChangeCity = (e) => setCity(e.target.value);
    const onChangeStreet = (e) => setStreet(e.target.value);
    const onChangeHouse = (e) => setHouse(e.target.value);
    // const onChangeFlat = (e) => setFlat(e.target.value);
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
            {/*<input className={"input-info"} type={"text"} placeholder={"Страна"} value={country} onChange={onChangeCountry} />*/}
            <input className={"input-info"} type={"text"} placeholder={"Город"} value={city} onChange={onChangeCity} />
            <input className={"input-info"} type={"text"} placeholder={"Улица"} value={street} onChange={onChangeStreet} />
            <input className={"input-info"} type={"text"} placeholder={"Дом"} value={house} onChange={onChangeHouse} />
            {/*<input className={"input-info"} type={"text"} placeholder={"Квартира"} value={flat} onChange={onChangeFlat} />*/}
            <input className={"input-info"} type={"text"} placeholder={"Эл. почта"} value={email} onChange={onChangeEmail} />
            <input className={"input-info"} type={"text"} placeholder={"Телефон"} value={phone} onChange={onChangePhone} />
            <select className={"select-delivery"} value={subject} onChange={onChangeSubject}>
                <option value={"Выберите способ доставки"}>Выберите способ доставки</option>
                <option value={"СДЭК"}>СДЭК</option>
                <option value={"BoxBerry"}>BoxBerry</option>
                <option value={"Yandex"}>Яндекс</option>
            </select>
            {/*<button onClick={onSendData}>Отправить</button>*/}
        </div>
    );
};

export default Form;
