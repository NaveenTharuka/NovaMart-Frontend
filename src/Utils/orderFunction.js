import axios from "axios"

// orderFunction.js - Update placeOrder function if needed
export const placeOrder = async (userId, productId, quantity, comment) => {
    try {
        const res = await axios.post(`http://localhost:8080/api/orders`, {
            userId,
            productId,
            quantity,
            comment
        });

        if (res.status === 200) {
            alert("✅ Order placed successfully");
        }

        return res.data;

    } catch (err) {
        console.error("Place order error:", err);
        alert("❌ Failed to place order");
        throw err;
    }
};

export const getOrderByOrderId = async (userId) => {
    try {
        const res = await axios.get(`http://localhost:8080/api/orders/user/${userId}`);
        if (res.status == 200) {
            return res.data;
        }
    } catch (err) {
        console.error("Get orders error:", err)
        throw err
    }
}