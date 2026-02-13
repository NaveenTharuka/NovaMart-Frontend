import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/api/cart.api";
import useAuth from "@/features/auth/hooks/useAuth";
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    if (!product) return null;

    const {
        id,
        name = "Unnamed Product",
        price = 0,
        category = "Uncategorized",
        quantity = 0,
        imageUrl,
        rating = 0,
        reviews = [], // Changed from 0 to [] - reviews is an array
        originalPrice
    } = product;

    const displayImage = imageUrl || "https://picsum.photos/300/200";
    const displayPrice = typeof price === 'number' ? price.toFixed(2) : price;

    // Safely handle rating display
    const safeRating = typeof rating === 'number' && !isNaN(rating) ? Number(rating) : 0;
    const displayRating = safeRating.toFixed(1);
    const reviewCount = Array.isArray(reviews) ? reviews.length : 0;
    const hasRating = safeRating > 0;
    const hasReviews = reviewCount > 0;

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (quantity === 0) return;

        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const res = await addToCart(user.id, id, 1);
            if (res.success) {
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            } else {
                console.error("Add to cart failed:", res.error);
            }
        } catch (error) {
            console.error("Add to cart error:", error);
        }
    };

    const handleCardClick = () => {
        navigate(`/product/${id}`);
    };

    const handleCardKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
        }
    };

    const toggleWishlist = (e) => {
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    // Generate stars based on rating
    const generateStars = () => {
        const starCount = 5;
        const fullStars = Math.floor(safeRating);
        const hasHalfStar = safeRating % 1 >= 0.5;

        return (
            <div className={styles.starContainer}>
                {[...Array(starCount)].map((_, index) => {
                    let starClass = styles.starEmpty;

                    if (index < fullStars) {
                        starClass = styles.starFull;
                    } else if (index === fullStars && hasHalfStar) {
                        starClass = styles.starHalf;
                    }

                    return (
                        <span
                            key={index}
                            className={`${styles.star} ${starClass}`}
                            aria-hidden="true"
                        >
                            ★
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={styles.cardWrapper}>
            <div
                className={styles.card}
                onClick={handleCardClick}
                onKeyDown={handleCardKeyDown}
                role="button"
                tabIndex={0}
                aria-label={`View ${name} product details`}
            >
                {/* Image Section */}
                <div className={`${styles.imageContainer} ${imageLoaded ? styles.loaded : ''}`}>
                    <img
                        src={displayImage}
                        alt={name}
                        className={styles.productImage}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.target.src = "https://picsum.photos/300/200";
                            setImageLoaded(true);
                        }}
                    />

                    {/* Overlay & Actions */}
                    <div className={styles.overlay}>
                        <button
                            className={styles.quickViewBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${id}`);
                            }}
                            aria-label={`Quick view ${name}`}
                        >
                            Quick View
                        </button>
                    </div>

                    {/* Badges */}
                    <div className={styles.badges}>
                        {quantity === 0 && (
                            <span className={styles.badgeOut} aria-label="Out of stock">
                                Out of Stock
                            </span>
                        )}
                        {quantity > 0 && originalPrice && (
                            <span className={styles.badgeSale} aria-label="On sale">
                                Sale
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        className={`${styles.wishlistBtn} ${isWishlisted ? styles.active : ''}`}
                        onClick={toggleWishlist}
                        aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
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

                    {/* Rating Section */}
                    <div
                        className={styles.ratingRow}
                        aria-label={`Rating: ${displayRating} out of 5 stars`}
                    >
                        {hasRating || hasReviews ? (
                            <>
                                <div className={styles.stars}>
                                    {generateStars()}
                                    <span className={styles.ratingNumber}>{displayRating}</span>
                                </div>
                                <span className={styles.reviewCount}>
                                    {hasReviews
                                        ? `(${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})`
                                        : "(No reviews)"
                                    }
                                </span>
                            </>
                        ) : (
                            <span className={styles.noRating}>No ratings yet</span>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.priceBlock}>
                            <span className={styles.price}>Rs {displayPrice}</span>
                            {originalPrice && (
                                <span className={styles.originalPrice}>
                                    Rs {typeof originalPrice === 'number' ? originalPrice.toFixed(2) : originalPrice}
                                </span>
                            )}
                        </div>

                        <button
                            className={styles.addCartBtn}
                            onClick={handleAddToCart}
                            disabled={quantity === 0}
                            aria-label={`Add ${name} to cart`}
                            title={quantity === 0 ? "Out of stock" : "Add to cart"}
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
                <div className={styles.notification} role="alert" aria-live="polite">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Added to Cart!
                </div>
            )}
        </div>
    );
}

export default ProductCard;