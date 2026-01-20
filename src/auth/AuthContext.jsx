// src/auth/AuthContext.jsx
import React, { createContext, useState } from "react";
import * as authAPI from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        if (res.success) {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
        }
        return res;
    };

    const register = async (email, password, userName, address, phoneNumber, role) => {
        const res = await authAPI.register(
            {
                email,
                password,
                userName,
                address,
                phoneNumber,
                role
            }
        );
        if (res.success) {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
        }
        return res;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
