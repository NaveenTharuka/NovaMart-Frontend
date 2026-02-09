import { BASE_URL } from "@/api/axios";

export const USER_API = `${BASE_URL}/api/user`;

const handleResponse = async (res) => {
    if (res.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        throw new Error("Unauthorized");
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Request failed");

    return data;
};

export const login = async ({ email, password }) => {
    try {
        const res = await fetch(`${USER_API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await handleResponse(res);
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const register = async ({ email, password, userName, address, phoneNumber, role }) => {
    try {
        const res = await fetch(`${USER_API}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                userName,
                address,
                phoneNumber,
                role,
            }),
        });

        const data = await handleResponse(res);
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const verifyToken = async (token) => {
    try {
        const res = await fetch(`${USER_API}/isTokenExpired`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        const data = await handleResponse(res); // backend returns boolean
        return { success: !data };
    } catch {
        return { success: false };
    }
};
