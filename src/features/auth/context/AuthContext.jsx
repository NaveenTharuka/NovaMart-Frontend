// src/auth/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import * as authAPI from "@/api/auth.api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        if (res.success) {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            localStorage.setItem("token", res.data.token);
        }
        return res;
    };

    const logout = (redirect = true) => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        if (redirect) navigate("/login", { replace: true });
    };

    const register = async (email, password, userName, address, phoneNumber, role) => {
        const res = await authAPI.register({
            email,
            password,
            userName,
            address,
            phoneNumber,
            role,
        });
        if (res.success) {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            localStorage.setItem("token", res.data.token);
        }
        return res;
    };

    const validateToken = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            logout(false);
            return;
        }

        try {
            const res = await authAPI.verifyToken(token);

            if (!res.success) {
                logout(false);
                alert("Session expired. Please log in again.");
            }

        } catch (error) {
            if (!error.response) {
                console.warn("Server unreachable. Keeping user logged in.");
                return;
            }
            logout(false);
            alert("Something went wrong. Please log in again.");
        }
    };


    // 🔥 Run ONCE on app load
    useEffect(() => {
        validateToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
