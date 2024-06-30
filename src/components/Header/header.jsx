import React from "react";
import button from "../Button/button";
import { useTelegram } from "../../hooks/useTelegram";

const Header = () => {
    const { onClose, tg } = useTelegram();
    return (
        <div className="header">
            <button onClick={onClose}>Закрыть</button>
            <span className="username">
                {tg?.initDataUnsafe?.user?.username}
            </span>
        </div>
    );
};

export default Header;