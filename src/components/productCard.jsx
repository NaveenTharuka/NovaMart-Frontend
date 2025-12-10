import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./productCard.css";

function ProductCard({ category }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then(response => response.json())
            .then(data => {
                const filteredProducts = category
                    ? data.filter(product =>
                        product.category.toLowerCase() === category.toLowerCase()
                    )
                    : data;
                setProducts(filteredProducts);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    }, [category]);

    if (loading) {
        return (
            <div className="product-grid">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="product-card skeleton">
                        <div className="product-image"></div>
                        <div className="product-content">
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line short"></div>
                            <div className="skeleton-button"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.length === 0 ? (
                <div className="no-products">
                    <p>No products found in this category.</p>
                    <Link to="/products" className="view-all-btn">
                        View All Products
                    </Link>
                </div>
            ) : (
                products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image">
                            <img
                                src={product.imageUrl || "https://picsum.photos/400/300"}
                                alt={product.name}
                            />
                            {product.quantity === 0 && (
                                <span className="out-of-stock-badge">Out of Stock</span>
                            )}
                        </div>

                        <div className="product-content">
                            <div className="product-header">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-price">${product.price.toFixed(2)}</p>
                            </div>

                            <p className="product-category">{product.category}</p>
                            <p className="product-description">{product.description}</p>

                            <div className="product-footer">
                                <p className={`product-quantity ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                                </p>

                                <div className="product-buttons">
                                    <Link to={`/product/${product.id}`} className="details-btn">
                                        View Details
                                    </Link>
                                    <button
                                        className={`cart-btn ${product.quantity === 0 ? 'disabled' : ''}`}
                                        disabled={product.quantity === 0}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ProductCard;