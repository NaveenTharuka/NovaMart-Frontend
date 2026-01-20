import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../auth/UseAuth";

// --- Exported functions ---
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

        if (!response.ok) {
            console.error(`Failed to delete product: ${response.status}`);
        }

        alert("Product deleted successfully");
        navigate("/products");
    } catch (e) {
        console.error("Error deleting product:", e);
    }
};

// --- Main Component ---
function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();

    useEffect(() => {
        fetch(`http://localhost:8080/api/products/id/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-500">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-500 hover:text-blue-700 mb-6"
                >
                    ← Back
                </button>

                <div className="grid md:grid-cols-2 gap-12 bg-white rounded-xl shadow-lg p-8 relative">

                    {/* Admin Actions */}
                    {user?.role === "ADMIN" && (
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                className="bg-emerald-100 px-4 py-2 rounded-lg shadow hover:bg-emerald-200 transition"
                                onClick={() => navigate(`/updateProduct/${id}`)}
                            >
                                Edit ✏️
                            </button>
                            <button
                                className="bg-red-200 px-4 py-2 rounded-lg shadow hover:bg-red-300 transition"
                                onClick={() => deleteProduct(id, navigate)}
                            >
                                Delete ❌
                            </button>
                        </div>
                    )}

                    {/* Product Image */}
                    <div className="flex items-center justify-center">
                        <img
                            src={product.imageUrl || "https://picsum.photos/800"}
                            alt={product.name}
                            className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <div className="flex items-center mb-4 gap-4">
                                <span className="text-2xl font-bold text-blue-600">
                                    ${product.price?.toFixed(2)}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-gray-400 line-through">
                                        ${product.originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-6">{product.description || "No description available."}</p>
                            <p className="mb-4">
                                <span className="font-medium">Category:</span>
                                <span className="ml-2 text-blue-500">{product.category || "Uncategorized"}</span>
                            </p>
                        </div>

                        {/* Quantity & Buttons */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center max-w-xs">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 border border-gray-300 rounded-l-lg hover:bg-gray-100 transition"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center border-t border-b border-gray-300 py-2">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 border border-gray-300 rounded-r-lg hover:bg-gray-100 transition"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={user
                                    ? () => addToCart(user, id, quantity, navigate)
                                    : () => navigate('/login')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
                            >
                                Add to Cart 🛒
                            </button>


                            <button
                                onClick={user ? () => addToCart(user, id, quantity, navigate) : () => navigate('/login')}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
                            >
                                Buy Now
                            </button>

                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p><span className="font-medium">Brand:</span> {product.brand || "N/A"}</p>
                            <p><span className="font-medium">SKU:</span> {product.sku || "N/A"}</p>
                        </div>
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium">Availability:</span>
                                <span className={`ml-2 ${product.quantity !== 0 ? "text-green-600" : "text-red-600"}`}>
                                    {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                                </span>
                            </p>
                            <p><span className="font-medium">Rating:</span> {product.rating || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
