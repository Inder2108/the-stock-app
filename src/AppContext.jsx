import React, { createContext, useState } from 'react';

export const AppContext = createContext(1);

export const AppContextProvider = ({ children }) => {
    const [rows, setRows] = useState([]);
    const [form, setForm] = useState({ ticker: '', qty: '', avgPrice: '' });
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    return (
        <AppContext.Provider value={{ rows, form, loading, isOpen, isEdit, setRows, setForm, setLoading, setIsOpen, setIsEdit }}>
            {children}
        </AppContext.Provider>
    );
}