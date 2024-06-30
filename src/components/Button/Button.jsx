import React from 'react';
import './button.css'

const Button = (props) => {
    return (
        <div>
            <button {...props} className={"button" + props.className}></button>
        </div>
    );
};

export default Button;