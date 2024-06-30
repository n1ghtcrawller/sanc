import React from 'react';
import Button from "../Button/button";
import {useTelegram} from "../../hooks/useTelegram";

const Header = () => {
    const {} = useTelegram()
    return (
        <div className={'header'}>
            <Button onClick={onClose}>Закрыть</Button>
            <span className={'username'}>
                {tg.initDataUnsafe?.user?.username}
            </span>
            
        </div>
    );
};

export default Header;