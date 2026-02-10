import { BASE_URL } from "./axios"

const PRODUCT_API = `${BASE_URL}/api/products`

export const getAllProducts = async () => {
    try {
        const res = await fetch(PRODUCT_API)
        const data = await res.json()

        return { success: true, data };
    }
    catch (err) {
        console.log(err)
        return { success: false, error: err.response?.data?.message || err.message };
    }
}

export const fetchProductByOrderItemId = async (orderItemId) => {
    try {
        const res = await fetch(`${PRODUCT_API}/order/${orderItemId}`);
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { success: false, error: error.response?.data?.message || error.message };
    }
}

export const fetchProductById = async (id) => {
    try {
        const response = await fetch(`${PRODUCT_API}/id/${id}`);
        if (!response.ok) {
            throw new Error(`Product not found (Status: ${response.status})`);
        }
        const data = await response.json();

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            price: parseFloat(data.price),
            imageUrl: data.imageUrl,
            category: data.category || '',
            quantity: data.quantity,
            rating: data.rating || 0,
            reviews: data.reviews || [],
        };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.response?.data?.message || error.message };
    }
};

export const addProduct = async (product) => {
    try {
        const res = await fetch(PRODUCT_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        const data = await res.json()

        return { success: true, data };
    }
    catch (err) {
        console.log(err)
        return { success: false, error: err.response?.data?.message || err.message };
    }
}

export const updateProduct = async (product) => {
    try {
        const res = await fetch(`${PRODUCT_API}/id/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        const data = await res.json()

        return { success: true, data };
    }
    catch (err) {
        console.log(err)
        return { success: false, error: err.response?.data?.message || err.message };
    }
}

export const deleteProduct = async (id) => {
    try {
        const res = await fetch(`${PRODUCT_API}/id/${id}`, {
            method: 'DELETE'
        })
        const data = await res.json()
            .then(data => data)

        return { success: true, data };
    }
    catch (err) {
        console.log(err)
        return { success: false, error: err.response?.data?.message || err.message };
    }
}
