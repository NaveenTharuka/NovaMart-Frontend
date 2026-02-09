import { BASE_URL } from "./axios";

const REVIEW_API = `${BASE_URL}/api/review`

export const getAllReviews = async () => {
    try {
        const res = await fetch(REVIEW_API);
        const data = res.data;
        return data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
}


export const addReview = async (userId, productId, rating, comment) => {
    try {
        const res = await fetch(REVIEW_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId, rating, comment }),
        });

        if (!res.ok) {
            throw new Error("Failed to add review");
        }

        // Safely handle empty body
        const text = await res.text();
        return text ? JSON.parse(text) : { success: true };
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};

