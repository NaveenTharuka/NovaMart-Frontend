import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../auth/UseAuth";
import "./ProductDetail.css";
import { addToCart, deleteProduct } from "../Utils/cartFunctions.js";



// --- Main Component ---
function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [imgLoaded, setImgLoaded] = useState(false);

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
            <div className="pd-loading">
                <div className="spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pd-loading">
                <h2>Product not found</h2>
                <button onClick={() => navigate("/products")} className="pd-btn">
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div className="pd-container">
            <div className="pd-content">
                {/* Admin Buttons */}
                {user?.role === "ADMIN" && (
                    <div className="pd-admin-actions">
                        <button
                            onClick={() => navigate(`/updateProduct/${id}`)}
                            className="pd-edit-btn"
                        >
                            Edit ✏️
                        </button>
                        <button onClick={() => deleteProduct(user, id, navigate)} className="pd-delete-btn">
                            Delete ❌
                        </button>
                    </div>
                )}

                {/* Product Image */}
                <div className="pd-image-wrap">
                    <img
                        src={product.imageUrl || "https://picsum.photos/800"}
                        alt={product.name}
                        className={`pd-image ${imgLoaded ? "loaded" : ""}`}
                        onLoad={() => setImgLoaded(true)}
                    />
                </div>

                {/* Product Details */}
                <div className="pd-details">
                    <h1 className="pd-name">{product.name}</h1>
                    <div className="pd-price-wrap">
                        <span className="pd-price">Rs {product.price?.toFixed(2)}</span>
                        {product.originalPrice && (
                            <span className="pd-original-price">${product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <p className="pd-description">{product.description || "No description available."}</p>
                    <p>
                        <span className="pd-label">Category:</span>{" "}
                        <span className="pd-category">{product.category || "Uncategorized"}</span>
                    </p>

                    {/* Quantity & Buttons */}
                    <div className="pd-actions">
                        <div className="pd-quantity">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>

                        <button
                            onClick={() => (user ? addToCart(user, id, quantity, navigate) : navigate("/login"))}
                            className="pd-btn-add"
                        >
                            Add to Cart 🛒
                        </button>
                        <button
                            onClick={() => (user ? addToCart(user, id, quantity, navigate) : navigate("/login"))}
                            className="pd-btn-buy"
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* Extra Info */}
                    <div className="pd-extra-info">
                        <p>
                            <span>Brand:</span> {product.brand || "N/A"}
                        </p>
                        <p>
                            <span>SKU:</span> {product.sku || "N/A"}
                        </p>
                        <p>
                            <span>Availability:</span>{" "}
                            <span className={product.quantity > 0 ? "in-stock" : "out-of-stock"}>
                                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                        </p>
                        <p>
                            <span>Rating:</span> {product.rating || "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
