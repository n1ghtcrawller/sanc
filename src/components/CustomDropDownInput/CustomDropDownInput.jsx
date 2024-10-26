import React, { useState } from 'react';
import './customDropDownInput.css';

const CustomDropDownInput = ({ options, value, onChange, placeholder, isDisabled = false }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (e) => {
        const input = e.target.value;
        setInputValue(input);
        setIsOpen(true);

        setFilteredOptions(
            options.filter((option) =>
                option.title && typeof option.title === 'string' && // Проверка наличия title и его типа
                option.title.toLowerCase().includes(input.toLowerCase())
            )
        );

        onChange(input); // Обновление значения в основном компоненте
    };

    const handleOptionClick = (option) => {
        setInputValue(option.title); // Устанавливаем выбранное значение заголовка
        onChange(option.title); // Устанавливаем выбранное значение
        setIsOpen(false); // Закрываем список
    };

    return (
        <span className="dropdown-container">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                onClick={() => !isDisabled && setIsOpen(!isOpen)}
                className="dropdown-input"
                disabled={isDisabled}
            />
            {isOpen && filteredOptions.length > 0 && !isDisabled && (
                <ul className="dropdown-list">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="dropdown-item"
                        >
                            {option.title} {/* Отображаем только текст заголовка */}
                        </li>
                    ))}
                </ul>
            )}
        </span>
    );
};

export default CustomDropDownInput;