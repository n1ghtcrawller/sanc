import React, { createContext, useContext, useState } from 'react';


export const FormContext = createContext();

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState([]);
    return (
        <FormContext.Provider value={{ formData, setFormData }}>
            {children}
        </FormContext.Provider>
    );
};
export const useFormContext = () => {
    return useContext(FormContext);
};