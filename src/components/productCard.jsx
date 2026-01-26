import { useState } from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../Utils/cartFunctions.js";
import useAuth from "../auth/UseAuth";
import { useNavigate } from "react-router-dom";
import './productCard.css';

function ProductCard({ product }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    if (!product) return null;

    const name = product?.name || "Unnamed Product";
    const price = typeof product?.price === "number" ? product.price.toFixed(2) : "N/A";
    const category = product?.category || "Uncategorized";
    const description = product?.description || "No description available";
    const quantity = typeof product?.quantity === "number" ? product.quantity : 0;
    const image = product?.imageUrl || "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";
    const rating = product?.rating || 4.5;
    const reviews = product?.reviews || 42;
    const originalPrice = product?.originalPrice || null;

    const handleAddToCart = () => {
        if (quantity === 0) return;

        addToCart(user, product.id, 1, navigate);

        // Show notification
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);



    };

    const handleQuickView = () => {
        navigate(`/product/${product.id}`);
    };

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<div key={i} className="star">★</div>);
        }

        if (hasHalfStar) {
            stars.push(<div key="half" className="star">☆</div>);
        }

        const remaining = 5 - stars.length;
        for (let i = 0; i < remaining; i++) {
            stars.push(<div key={`empty-${i}`} className="star">☆</div>);
        }

        return stars;
    };

    return (
        <>
            <div className="product-card">
                {/* Image Container */}
                <div className="product-image" style={{ backgroundImage: `url(${image})` }}>
                    {/* Product Labels */}
                    {quantity === 0 && (
                        <div className="product-label">Out of Stock</div>
                    )}
                    {originalPrice && (
                        <div className="product-label sale">Sale</div>
                    )}

                    {/* Wishlist Button */}
                    <div
                        className={`product-wishlist ${isWishlisted ? 'active' : ''}`}
                        onClick={() => setIsWishlisted(!isWishlisted)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <div className="product-category">{category}</div>
                    <div className="product-name">{name}</div>

                    {/* Rating */}
                    <div className="rating">
                        <div className="stars">
                            {renderStars()}
                        </div>
                        <div className="review-count">{reviews} reviews</div>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="price-row">
                        <div className="price-container">
                            <span className="price">Rs {price}</span>
                            {originalPrice && (
                                <span className="original-price">Rs {parseFloat(originalPrice).toFixed(2)}</span>
                            )}
                        </div>
                        <button
                            className={`add-to-cart ${quantity === 0 ? 'disabled' : ''}`}
                            onClick={handleAddToCart}
                            disabled={quantity === 0}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="cart-tooltip">
                                {quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Quick View Overlay */}
                <div className="product-quick-view" onClick={handleQuickView}>
                    Quick view
                </div>
            </div>

            {/* Notification */}
            {showNotification && (
                <div className="cart-notification active">
                    <div className="notification-check">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="notification-text">{name} added to your cart</div>
                </div>
            )}
        </>
    );
}

export default ProductCard;