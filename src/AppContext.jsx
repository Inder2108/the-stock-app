import React, { createContext, useState } from 'react';

export const AppContext = createContext(1);

export const AppContextProvider = ({ children }) => {
    const [rows, setRows] = useState([]);
    const [form, setForm] = useState({ ticker: '', qty: '', avgPrice: '' });
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [sortBy, setSortBy] = useState("weightage");
    const [sortDirection, setSortDirection] = useState("ASC");

    return (
        <AppContext.Provider value={{ rows, form, loading, isOpen, isEdit, sortBy, sortDirection, setRows, setForm, setLoading, setIsOpen, setIsEdit, setSortBy, setSortDirection }}>
            {children}
        </AppContext.Provider>
    );
}