import React, { createContext, useEffect, useState, useMemo } from "react";
import * as authAPI from "@/api/auth.api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(true);

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
        const res = await authAPI.register({ email, password, userName, address, phoneNumber, role });
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
            setLoading(false); // ✅ just finish loading, don't logout immediately
            return;
        }

        try {
            const res = await authAPI.verifyToken(token);
            if (!res.success) {
                setUser(null); // only null if token is actually invalid
            }
        } catch (error) {
            console.warn("Server unreachable. Keeping user logged in.");
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Run ONCE on app load
    useEffect(() => {
        validateToken();
    }, []);

    // ✅ Memoize context to prevent unnecessary re-renders
    const value = useMemo(() => ({ user, loading, login, logout, register }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
