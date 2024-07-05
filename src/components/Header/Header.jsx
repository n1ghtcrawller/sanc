import React from "react";
import { useTelegram } from "../../hooks/useTelegram";
import './Header.css'

const Header = () => {
    const { onClose, tg } = useTelegram();
    return (
        <div className="header">

        </div>
    );
};

export default Header;