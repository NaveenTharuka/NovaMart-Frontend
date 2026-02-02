import axios from "axios";

const API_PRODUCT = 'http://localhost:8080/api/products'

export const getAllProducts = async () => {
    try {
        const res = await fetch(API_PRODUCT)
        const data = await res.json()

        return { success: true, data };
    }
    catch (err) {
        console.log(err)
        return { success: false, error: err.response?.data?.message || err.message };
    }
}


export const getProductById = async (id) => {
    try {
        const res = await fetch(`${API_PRODUCT}/id/${id}`)
        const data = await res.json()

        return { success: true, data };
    }
    catch (err) {
        console.log(err)
        return { success: false, error: err.response?.data?.message || err.message };
    }
}

export const addProduct = async (product) => {
    try {
        const res = await fetch(API_PRODUCT, {
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
        const res = await fetch(`${API_PRODUCT}/${product.id}`, {
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
        const res = await fetch(`${API_PRODUCT}/${id}`, {
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
