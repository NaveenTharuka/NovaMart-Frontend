import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/Utils/cartFunctions";
import useAuth from "@/auth/UseAuth";
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    if (!product) return null;

    const {
        id,
        name = "Unnamed Product",
        price = 0,
        category = "Uncategorized",
        quantity = 0,
        imageUrl,
        rating = 4.5,
        reviews = 42,
        originalPrice
    } = product;

    const displayImage = imageUrl || "https://picsum.photos/300/200";
    const displayPrice = typeof price === 'number' ? price.toFixed(2) : price;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (quantity === 0) return;

        addToCart(user, id, 1, navigate);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const handleCardClick = () => {
        navigate(`/product/${id}`);
    };

    const toggleWishlist = (e) => {
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.card} onClick={handleCardClick}>
                {/* Image Section */}
                <div className={styles.imageContainer}>
                    <img src={displayImage} alt={name} className={styles.productImage} />

                    {/* Overlay & Actions */}
                    <div className={styles.overlay}>
                        <button
                            className={styles.quickViewBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${id}`);
                            }}
                        >
                            Quick View
                        </button>
                    </div>

                    {/* Badges */}
                    <div className={styles.badges}>
                        {quantity === 0 && <span className={styles.badgeOut}>Out of Stock</span>}
                        {quantity > 0 && originalPrice && <span className={styles.badgeSale}>Sale</span>}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        className={`${styles.wishlistBtn} ${isWishlisted ? styles.active : ''}`}
                        onClick={toggleWishlist}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>
                </div>

                {/* Content Section */}
                <div className={styles.content}>
                    <div className={styles.category}>{category}</div>
                    <h3 className={styles.title}>{name}</h3>

                    <div className={styles.ratingRow}>
                        <div className={styles.stars}>
                            <span>★</span>
                            <span>{rating}</span>
                        </div>
                        <span className={styles.reviewCount}>({reviews} reviews)</span>
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.priceBlock}>
                            <span className={styles.price}>Rs {displayPrice}</span>
                            {originalPrice && (
                                <span className={styles.originalPrice}>Rs {originalPrice.toFixed(2)}</span>
                            )}
                        </div>

                        <button
                            className={styles.addCartBtn}
                            onClick={handleAddToCart}
                            disabled={quantity === 0}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5V19M5 12H19" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {showNotification && (
                <div className={styles.notification}>
                    Added to Cart!
                </div>
            )}
        </div>
    );
}

export default ProductCard;