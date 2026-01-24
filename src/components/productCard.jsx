import { Link } from "react-router-dom";
import { addToCart } from "../pages/ProductDetail";
import useAuth from "../auth/UseAuth";
import { useNavigate } from "react-router-dom";
import './productCard.css';

function ProductCard({ product }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!product) return null;

    const name = product?.name || "Unnamed Product";
    const price =
        typeof product?.price === "number" ? product.price.toFixed(2) : "N/A";
    const category = product?.category || "Uncategorized";
    const description = product?.description || "No description available";
    const quantity =
        typeof product?.quantity === "number" ? product.quantity : 0;
    const image = product?.imageUrl || "https://picsum.photos/400/300";

    return (
        <div className="product-card">
            {/* Image */}
            <div className="product-image">
                <img src={image} alt={name} />
                {quantity === 0 && (
                    <span className="out-of-stock-badge">Out of Stock</span>
                )}
            </div>

            {/* Content */}
            <div className="product-content">
                <h3 className="product-name">{name}</h3>
                <p className="product-category">{category}</p>
                <p className="product-price">Rs {price}</p>
                <p className="product-description">{description}</p>

                {/* Footer */}
                <div className="product-footer">
                    <p className={`product-quantity ${quantity > 0 ? "in-stock" : "out-of-stock"}`}>
                        {quantity > 0 ? `${quantity} in stock` : "Out of stock"}
                    </p>
                    <div className="product-buttons">
                        <Link to={`/product/${product.id}`} className="details-btn">
                            View Details
                        </Link>
                        <button
                            className={`cart-btn ${quantity === 0 ? "disabled" : ""}`}
                            disabled={quantity === 0}
                            onClick={() => addToCart(user, product.id, 1, navigate)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
