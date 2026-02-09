import { BASE_URL } from "./axios";

const CATEGORY_API = `${BASE_URL}/api/categories`;

export const fetchCategories = async () => {
    try {
        const res = await fetch(CATEGORY_API);
        const data = await res.json();

        return { success: true, data };
    } catch (err) {
        alert("Fetching error: Categories");
        return { success: false, err };
    }
};
