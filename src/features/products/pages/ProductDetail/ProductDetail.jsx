import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";
import styles from "./ProductDetail.module.css";
import { addToCart } from "@/api/cart.api";
import { deleteProduct, fetchProductById } from "@/api/product.api";
import Loader from "../../../../components/Loader/Loader";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(id);
                if (!data) throw new Error("Product not found");
                if (data.success === false) throw new Error(data.error || "Product not found");

                setProduct(data);
                // Set images (mock gallery if only 1 image)
                const mainImage = data.imageUrl || "https://picsum.photos/300/200";
                setSelectedImage(mainImage);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setProduct(null);
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    // Generate stars display function
    const generateStars = (ratingValue) => {
        const fullStars = Math.floor(ratingValue);
        const hasHalfStar = ratingValue % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <>
                {'★'.repeat(fullStars)}
                {hasHalfStar && '★'}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    if (loading) return <div className={styles.loaderContainer}><Loader /></div>;

    if (!product) {
        return (
            <div className={styles.errorContainer}>
                <h2>Product not found</h2>
                <button onClick={() => navigate("/products")} className={styles.backBtn}>
                    Browse Products
                </button>
            </div>
        );
    }

    const ReviewCard = ({ product }) => {
        const [expanded, setExpanded] = useState(false);
        const [visibleReviews, setVisibleReviews] = useState(3);

        if (!product) return null;

        const {
            id,
            name = "Product",
            reviews = []
        } = product;

        const rating = Number(product.rating) || 0;

        const reviewCount = reviews?.length || 0;
        const hasReviews = reviewCount > 0;

        // Get rating text
        const getRatingText = (ratingValue) => {
            if (ratingValue === 0) return "No reviews yet";
            if (ratingValue >= 4.5) return "Excellent";
            if (ratingValue >= 4.0) return "Very Good";
            if (ratingValue >= 3.5) return "Good";
            if (ratingValue >= 3.0) return "Average";
            if (ratingValue >= 2.0) return "Below Average";
            return "Poor";
        };

        // Format date
        const formatDate = (dateString) => {
            if (!dateString) return "Recently";

            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return "Recently";

                // If date is recent, show relative time
                const now = new Date();
                const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

                if (diffInDays === 0) return "Today";
                if (diffInDays === 1) return "Yesterday";
                if (diffInDays < 7) return `${diffInDays} days ago`;
                if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;

                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch (error) {
                return "Recently";
            }
        };

        // Calculate rating breakdown for progress bars
        const calculateRatingBreakdown = () => {
            const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

            if (!reviews || reviews.length === 0) return breakdown;

            reviews.forEach(review => {
                if (review?.rating) {
                    const star = Math.round(review.rating);
                    if (star >= 1 && star <= 5) {
                        breakdown[star]++;
                    }
                }
            });

            return breakdown;
        };

        // Sort reviews by date (newest first)
        const sortedReviews = [...(reviews || [])].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        const ratingBreakdown = calculateRatingBreakdown();

        const loadMoreReviews = () => {
            setVisibleReviews(prev => Math.min(prev + 3, sortedReviews.length));
        };

        const toggleExpanded = () => {
            if (expanded) {
                setVisibleReviews(3);
            } else {
                setVisibleReviews(sortedReviews.length);
            }
            setExpanded(!expanded);
        };

        const handleWriteReview = () => {
            console.log('Write review for product:', id);
        };

        return (
            <div className={styles.reviewCard}>
                {/* Header */}
                <div className={styles.reviewHeader}>
                    <h2 className={styles.reviewTitle}>Customer Reviews</h2>
                </div>

                {/* Rating Summary */}
                <div className={styles.ratingSummary}>
                    <div className={styles.overallRating}>
                        <div className={styles.ratingNumber}>
                            {rating === 0 ? '-' : rating.toFixed(1)}
                        </div>
                        <div className={styles.starsLarge}>
                            {generateStars(rating)}
                        </div>
                        <div className={styles.ratingText}>
                            {getRatingText(rating)}
                        </div>
                        <div className={styles.reviewCountText}>
                            Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                        </div>
                    </div>

                    {/* Rating Breakdown */}
                    {hasReviews && (
                        <div className={styles.ratingBreakdown}>
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = ratingBreakdown[star];
                                const percentage = reviewCount > 0
                                    ? (count / reviewCount) * 100
                                    : 0;

                                return (
                                    <div key={star} className={styles.breakdownRow}>
                                        <div className={styles.starLabel}>
                                            <span>{star} star</span>
                                            <span className={styles.starCount}>({count})</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className={styles.percentage}>
                                            {percentage.toFixed(0)}%
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Reviews List */}
                <div className={styles.reviewsList}>
                    {!hasReviews ? (
                        <div className={styles.noReviews}>
                            <div className={styles.noReviewsIcon}>💬</div>
                            <h3>No reviews yet</h3>
                            <p>Be the first to review "{name}"</p>
                            <button
                                className={styles.beFirstBtn}
                                onClick={handleWriteReview}
                            >
                                Write the First Review
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className={styles.reviewsSectionTitle}>
                                Customer Reviews ({reviewCount})
                            </h3>

                            {sortedReviews.slice(0, visibleReviews).map((review, index) => (
                                <div key={index} className={styles.reviewItem}>
                                    <div className={styles.reviewItemHeader}>
                                        <div className={styles.reviewerInfo}>
                                            <div className={styles.reviewerAvatar}>
                                                {review.username?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className={styles.reviewerName}>
                                                    {review.username || 'Anonymous'}
                                                </div>
                                                <div className={styles.reviewDate}>
                                                    {formatDate(review.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.reviewItemRating}>
                                            {generateStars(review.rating || 0)}
                                        </div>
                                    </div>

                                    {review.comment && (
                                        <>
                                            <p className={styles.reviewContent}>
                                                {review.comment}
                                            </p>

                                            {review.comment.length > 200 && (
                                                <button
                                                    className={styles.readMoreBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const content = e.target.previousSibling;
                                                        content.classList.toggle(styles.expanded);
                                                        e.target.textContent =
                                                            content.classList.contains(styles.expanded)
                                                                ? 'Read Less'
                                                                : 'Read More';
                                                    }}
                                                >
                                                    Read More
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}

                            {/* Load More / Show Less */}
                            {sortedReviews.length > 3 && visibleReviews < sortedReviews.length && (
                                <div className={styles.loadMoreContainer}>
                                    <button
                                        className={styles.loadMoreBtn}
                                        onClick={loadMoreReviews}
                                    >
                                        Load More ({sortedReviews.length - visibleReviews} more reviews)
                                    </button>
                                </div>
                            )}

                            {expanded && visibleReviews === sortedReviews.length && sortedReviews.length > 3 && (
                                <div className={styles.loadMoreContainer}>
                                    <button
                                        className={styles.loadMoreBtn}
                                        onClick={toggleExpanded}
                                    >
                                        Show Less
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    const handleAddToCart = () => {
        if (!user) return navigate("/login");
        const res = addToCart(user.id, id, quantity, navigate);
        if (res.success) alert("Product added to cart successfully!");
    };

    const handleBuyNow = () => {
        if (!user) return navigate("/login");
        navigate(`/orderpage/${id}`, { state: { product } });
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                {/* Admin Bar */}
                {user?.role === "ADMIN" && (
                    <div className={styles.adminBar}>
                        <span>Admin Actions:</span>
                        <button onClick={() => navigate(`/updateProduct/${id}`)} className={styles.adminBtn}>Edit</button>
                        <button onClick={() => deleteProduct(user, id, navigate)} className={`${styles.adminBtn} ${styles.deleteBtn}`}>Delete</button>
                    </div>
                )}

                <div className={styles.grid}>
                    {/* Left: Image Gallery */}
                    <div className={styles.imageSection}>
                        <div className={styles.mainImageContainer}>
                            <img src={selectedImage} alt={product.name} className={styles.mainImage} />
                            <div className={styles.badges}>
                                {product.quantity === 0 && <span className={styles.badgeOut}>Out of Stock</span>}
                                {product.originalPrice && <span className={styles.badgeSale}>Sale</span>}
                            </div>
                        </div>

                        {/* Gallery thumbnails */}
                        <div className={styles.galleryRow}>
                            {[selectedImage].map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.thumbContainer} ${selectedImage === img ? styles.activeThumb : ''}`}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img src={img} alt="" className={styles.thumbImage} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className={styles.detailsSection}>
                        <div className={styles.detailsHeader}>
                            <div className={styles.category}>{product.category || "Uncategorized"}</div>
                            <h1 className={styles.productTitle}>{product.name}</h1>

                            <div className={styles.ratingRow}>
                                <div className={styles.stars}>
                                    {generateStars(Number(product.rating) || 0)}
                                    <span className={styles.ratingValue}> {(Number(product.rating) || 0).toFixed(1)}</span>
                                </div>
                                <span className={styles.reviewCount}>
                                    ({product.reviews?.length || 0} {product.reviews?.length === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>
                        </div>

                        <div className={styles.priceBlock}>
                            <span className={styles.currentPrice}>Rs {(Number(product.price) || 0).toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className={styles.originalPrice}>Rs {(Number(product.originalPrice) || 0).toFixed(2)}</span>
                            )}
                        </div>

                        <div className={styles.description}>
                            <p>{product.description || "No description available."}</p>
                        </div>

                        {/* Quantity Control */}
                        <div className={styles.controls}>
                            <label>Quantity</label>
                            <div className={styles.qtyInput}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={styles.actions}>
                            <button className={styles.addToCartBtn} onClick={handleAddToCart} disabled={product.quantity === 0}>
                                Add to Cart
                            </button>
                            <button className={styles.buyNowBtn} onClick={handleBuyNow} disabled={product.quantity === 0}>
                                Buy Now
                            </button>
                        </div>

                        {/* Meta Info */}
                        <div className={styles.metaInfo}>
                            <div className={styles.metaRow}>
                                <span>Availability:</span>
                                <span className={product.quantity > 0 ? styles.inStock : styles.outStock}>
                                    {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>
                            <div className={styles.metaRow}>
                                <span>SKU:</span>
                                <span>{product.sku || `PROD-${product.id}`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Card - Placed below the product grid */}
                <ReviewCard product={product} />
            </div>
        </div>
    );
}

export default ProductDetail;