import styles from './addReview.module.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductByOrderItemId } from '../../../api/product.api';
import { addReview } from '../../../api/review.api';
import useAuth from '@/features/auth/hooks/useAuth';
import Loader from '@/components/Loader/Loader';

function AddReview() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetchProductByOrderItemId(id);
                if (res.success) {
                    setProduct(res.data);
                } else {
                    setError('Failed to fetch product');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const res = await addReview(user.id, product.id, rating, comment);
            if (res.success) {
                navigate(`/product/${product.id}`);
            } else {
                setError('Failed to add review');
            }
        } catch (error) {
            console.error('Error adding review:', error);
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h2>Error Loading Review</h2>
                <p>{error}</p>
                <button className={styles.retryBtn} onClick={() => navigate(`/product/${product.id}`)}>
                    Back to Product
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Add Review</h1>
                <div className={styles.productCard}>
                    <div className={styles.productRow}>
                        <img
                            src={product.imageUrl ? product.imageUrl : "https://picsum.photos/300/200"}
                            alt={product?.name}
                            className={styles.productThumbnail}

                        />
                        <div className={styles.productDetails}>
                            <p className={styles.productName}>{product?.name}</p>
                            {product?.category && (
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Category:</span>
                                    <span className={styles.detailValue}>{product.category}</span>
                                </div>
                            )}
                            {product?.price && (
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Price:</span>
                                    <span className={styles.detailValue}>${parseFloat(product.price).toFixed(2)}</span>
                                </div>
                            )}
                            {product?.stock !== undefined && (
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Stock:</span>
                                    <span className={`${styles.detailValue} ${product.stock > 0 ? styles.inStock : styles.outOfStock}`}>
                                        {product.stock} units
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.formGroup}>
                    <label className={styles.label}>Rating</label>
                    <div className={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`${styles.starButton} ${rating >= star ? styles.starActive : ''}`}
                                onClick={() => setRating(star)}
                                title={`${star} star${star > 1 ? 's' : ''}`}
                            >
                                ★
                            </button>
                        ))}
                        <div className={styles.ratingText}>
                            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''} selected` : 'Select a rating'}
                        </div>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="comment" className={styles.label}>Comment</label>
                    <textarea
                        id="comment"
                        className={styles.textarea}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        rows="5"
                    />
                    <div className={styles.charCount}>
                        {comment.length}/500 characters
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => navigate(`/product/${id}`)}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={submitting || rating === 0}
                    >
                        {submitting ? (
                            <>
                                <span className={styles.spinner}></span>
                                Submitting...
                            </>
                        ) : (
                            'Submit Review'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddReview;