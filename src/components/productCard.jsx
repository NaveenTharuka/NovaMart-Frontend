import { Link } from "react-router-dom";
import "./productCard.css";

function ProductCard({ products = [] }) {
    if (!Array.isArray(products) || products.length === 0) {
        return (
            <div className="no-products">
                <p>No products found in this category.</p>
                <Link to="/products" className="view-all-btn">View All Products</Link>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((product) => {
                if (!product) return null;

                const name = product?.name || "Unnamed Product";
                const price =
                    typeof product?.price === "number"
                        ? product.price.toFixed(2)
                        : "N/A";
                const category = product?.category || "Uncategorized";
                const description = product?.description || "No description available";
                const quantity =
                    typeof product?.quantity === "number" ? product.quantity : 0;
                const image =
                    product?.imageUrl || "https://picsum.photos/400/300";

                return (
                    <div key={product.id} className="product-card">
                        {/* Product Image */}
                        <div className="product-image">
                            <img src={image} alt={name} />
                            {quantity === 0 && (
                                <span className="out-of-stock-badge">Out of Stock</span>
                            )}
                        </div>

                        {/* Product Content */}
                        <div className="product-content">
                            <div className="product-header">
                                <h3 className="product-name">{name}</h3>
                                <p className="product-price">${price}</p>
                            </div>

                            <p className="product-category">{category}</p>
                            <p className="product-description">{description}</p>

                            <div className="product-footer">
                                <p
                                    className={`product-quantity ${quantity > 0 ? "in-stock" : "out-of-stock"
                                        }`}
                                >
                                    {quantity > 0
                                        ? `${quantity} in stock`
                                        : "Out of stock"}
                                </p>

                                <div className="product-buttons">
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="details-btn"
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        className={`cart-btn ${quantity === 0 ? "disabled" : ""
                                            }`}
                                        disabled={quantity === 0}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ProductCard;