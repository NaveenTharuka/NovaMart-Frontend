import { BASE_URL } from "./axios";

const USER_API = `${BASE_URL}/api/user`;

export const getAllUsers = async () => {
    try {
        const res = await fetch(`${USER_API}/all`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load users");
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateUserRole = async (userId, newRole) => {
    try {
        const res = await fetch(`${USER_API}/role`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userId, role: newRole }),
        });
        if (!res.ok) throw new Error(res?.message || "Failed to update user role");
        return res.ok;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
