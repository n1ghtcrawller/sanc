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
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('Самовывоз');
    const [comment, setComment] = useState('');
    const [office, setOffice] = useState('');
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
            const data = { name, city, street, house, phone, email, subject, comment, office };
            console.log('Sending data:', data);
            if (!city || !name || !phone || !email || !subject || (subject === 'Самовывоз' ? !office : !street || !house || !office)) {
                alert('Пожалуйста, заполните все поля!');
                return;
            }
            setFormData(data);
            navigate('/Confirm');
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        }
    }, [name, city, street, house, email, phone, subject, comment, setFormData, office, navigate]);

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
        if (!name || !city || !phone || !email || (subject === 'Самовывоз' && !office) || (subject === 'Курьером' && (!street || !house || !office))) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [name, city, street, house, phone, email, comment, office, subject, tg]);

    const goBack = () => {
        navigate('/order');
    };

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
            <input className={"input-info"} type={"text"} placeholder={"населенный пункт"} value={city}
                   onChange={(e) => setCity(e.target.value)} />
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

            {subject === 'Курьером' && (
                <>
                    <input className={"input-info"} type={"text"} placeholder={"улица"} value={street}
                        onChange={(e) => setStreet(e.target.value)} />
                    <input className={"input-info"} type={"text"} placeholder={"дом"} value={house}
                        onChange={(e) => setHouse(e.target.value)} />
                    <input className={"input-info"} type={"text"} placeholder={"квартира/офис"} value={office}
                        onChange={(e) => setOffice(e.target.value)} />
                </>
            )}

            {subject === 'Самовывоз' && (
                <input className={"input-info"} type={"text"} placeholder={"квартира/офис"} value={office}
                    onChange={(e) => setOffice(e.target.value)} />
            )}

            <input className={"input-info"} type={"text"} placeholder={"комментарий"} value={comment}
                   onChange={(e) => setComment(e.target.value)} />
        </div>
    );
};

export default Form;
