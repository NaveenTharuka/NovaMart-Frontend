import axios from "axios";

const API_BASE = "http://localhost:8080/api/user";

const api = axios.create({
    baseURL: API_BASE,
});

// 🔥 Auto logout on 401 anywhere
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export const login = async ({ email, password }) => {
    try {
        const res = await api.post("/login", { email, password });
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const register = async ({ email, password, userName, address, phoneNumber, role }) => {
    try {
        const res = await api.post("/register", {
            email,
            password,
            userName,
            address,
            phoneNumber,
            role,
        });
        return { success: true, data: res.data };

    } catch (err) {

        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const verifyToken = async (token) => {
    try {
        const res = await api.post("/isTokenExpired", { token });
        const expired = res.data; // Boolean returned by backend

        // If token is expired, success = false
        return { success: !expired };
    } catch {
        return { success: false };
    }
};


export default api;
