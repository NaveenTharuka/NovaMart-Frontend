import api from "./axios";

export const getAllProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/id/${id}`);
export const addProduct = (product) => api.post("/products", product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
