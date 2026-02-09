import { BASE_URL } from "./axios";

const ORDER_API = `${BASE_URL}/api/order`

export const getAllOrders = async () => {

    try {
        const res = await fetch(`${ORDER_API}/all`);
        const data = await res.json();

        if (!res.ok) (
            alert("fetch orders fail")
        )

        return data;

    } catch (err) {
        alert("Error")
        console.log("Error encountered while fetching Orders")
        return null
    }
}

export const getOrderFromUserId = async (userId) => {
    try {
        const res = await fetch(`${ORDER_API}/user/${userId}`);

        if (!res.ok) {
            throw new Error("Failed to fetch user orders");
        }

        const data = await res.json();
        return { success: true, data };
    } catch (err) {
        console.error("Error loading user orders:", err);
        return { success: false, error: err };
    }
};


export const getOrderDetails = async (orderId) => {
    try {
        const res = await fetch(`${ORDER_API}/${orderId}`)
        const data = await res.json();

        localStorage.removeItem("orderId")

        return { success: true, data }
    } catch (err) {
        console.log("faild to fetch order : " + orderId)
        return { success: false, err }
    }
}

export const placeOrder = async (orderData) => {
    try {
        const response = await fetch(ORDER_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Order failed (Status: ${response.status})`);
        }
        return await response.json();
    } catch (error) {
        console.error('Order API Error:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        console.log('Updating order status:', {
            orderId,
            status,
            url: ORDER_API
        });

        // Backend UpdateOrderStatusDto expects orderId and status in body
        const requestBody = {
            orderId: orderId,
            status: status
        };

        const response = await fetch(ORDER_API, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Update response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update error response:', errorText);
            throw new Error(`Failed to update status: ${response.status} - ${errorText}`);
        }

        // Your backend returns empty body (204 No Content), so we don't parse JSON
        return { success: true };

    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const cancelOrder = async (orderId, reason = '') => {
    try {
        console.log('Cancelling order:', orderId);

        const requestBody = {
            orderId: orderId,
            status: 'CANCELED'
        };

        const response = await fetch(ORDER_API, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Cancel response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Cancel error response:', errorText);
            throw new Error(`Failed to cancel order: ${response.status} - ${errorText}`);
        }

        return { success: true };

    } catch (error) {
        console.error('Error in cancelOrder:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
