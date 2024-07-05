import React, {useEffect} from 'react';
import "./Form.css"
import {useTelegram} from "../../hooks/useTelegram";


const Form = () => {
    const [country, setCountry] = React.useState([]);
    const [city, setCity] = React.useState([]);
    const [street, setStreet] = React.useState([]);
    const [house, setHouse] = React.useState([]);
    const [flat, setFlat] = React.useState([]);
    const [phone, setPhone] = React.useState([]);

    const [subject, setSubject] = React.useState([]);

    const {tg} = useTelegram();

    useEffect(() => {
        tg.MainButton.setParams({
            'text': 'Отправить данные'
        });
    }, [])


    useEffect(() => {
        if(!country || !city || !street || !house || !flat || !phone ){
            tg.MainButton.hide();
        }else {
            tg.MainButton.show();
        }

    }, [country, city, street, house, phone]);


    const onChangeCountry = (e) => {
        setCountry(e.target.value);
    }

    const onChangeCity = (e) => {
        setCity(e.target.value);
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value);
    }

    const onChangeHouse = (e) => {
        setHouse(e.target.value);
    }

    const onChangeFlat = (e) => {
        setFlat(e.target.value);
    }

    const onChangePhone = (e) => {
        setPhone(e.target.value);
    }

    const onChangeSubject = (e) => {
        setSubject(e.target.value);
    }

    return (
        <div className={"form"}>
            <h3>Введите ваши данные</h3>
            <input className={"input"}
                   type={"text"}
                   placeholder={"Страна"}
                   value={country}
                   onChange={onChangeCountry}
            />
            <input className={"input"}
                   type={"text"}
                   placeholder={"Город"}
                   value={city}
                   onChange={onChangeCity}
            />
            <input className={"input"}
                   type={"text"}
                   placeholder={"Улица"}
                   value={street}
                   onChange={onChangeStreet}
            />
            <input className={"input"}
                   type={"text"}
                   placeholder={"Дом"}
                   value={house}
                   onChange={onChangeHouse}
            />
            <input className={"input"}
                   type={"text"}
                   placeholder={"Квартира"}
                   value={flat}
                   onChange={onChangeFlat}
            />
            <input className={"input"}
                   type={"text"}
                   placeholder={"Телефон"}
                   value={phone}
                   onChange={onChangePhone}
            />

            <select value={subject} onChange={onChangeSubject} className={"select"}>
                <option value={"physical"}>Физ. Лицо</option>
                <option value={"legal"}>Юр. Лицо</option>

            </select>
        </div>
    );
};

export default Form;