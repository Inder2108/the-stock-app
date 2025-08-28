import React, { createContext, useState } from 'react';

export const AppContext = createContext(1);

export const AppContextProvider = ({ children }) => {
    const [rows, setRows] = useState([]);
    const [form, setForm] = useState({ ticker: '', qty: '', avgPrice: '' });
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <AppContext.Provider value={{ rows, form, loading, isOpen, setRows, setForm, setLoading, setIsOpen }}>
            {children}
        </AppContext.Provider>
    );
}