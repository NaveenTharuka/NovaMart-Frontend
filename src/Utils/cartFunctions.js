// src/utils/cartFunctions.js
export const addToCart = async (user, productId, quantity, navigate) => {
    try {
        const response = await fetch(`http://localhost:8080/api/cart/${user.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ productId, quantity }),
        });

        if (response.ok) {
            alert("Product added to cart!");
            navigate("/cart");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
};

export const deleteProduct = async (id, navigate) => {
    try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            alert("Product deleted successfully");
            navigate("/products");
        } else {
            console.error(`Failed to delete product: ${response.status}`);
        }
    } catch (e) {
        console.error("Error deleting product:", e);
    }
};
