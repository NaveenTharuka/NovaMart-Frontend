import Loader from '@/components/Loader/Loader';
import styles from './UpdateProduct.module.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, updateProduct } from '../../../../api/product.api';
import { fetchCategories } from '../../../../api/category.api';

function UpdateProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [imageError, setImageError] = useState(false);

    const [updatedProduct, setUpdatedProduct] = useState({
        id: '',
        name: '',
        description: '',
        price: '',
        quantity: 0,
        category: '',
        productImageUrl: ''
    });

    // Fetch categories
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setCategoriesLoading(true);
                const data = await fetchCategories();
                // Handle different response formats
                const categoriesArray = data?.categories || data?.data || data?.results || data || [];
                setCategories(Array.isArray(categoriesArray) ? categoriesArray : []);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setCategories([]);
                setError('Failed to load category data');
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategory();
    }, []);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError('No product ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await fetchProductById(id);
                if (!data) {
                    throw new Error('Product not found');
                }
                setUpdatedProduct(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message || 'Failed to load product data');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Warn about unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // Auto-dismiss success message and redirect
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/products');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    const validateForm = () => {
        if (!updatedProduct.name?.trim()) {
            setError('Product name is required');
            return false;
        }
        if (!updatedProduct.price || updatedProduct.price <= 0) {
            setError('Valid price is required');
            return false;
        }
        if (!updatedProduct.category) {
            setError('Please select a category');
            return false;
        }
        if (updatedProduct.quantity < 0) {
            setError('Quantity cannot be negative');
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        // Reset image error when URL changes
        if (name === 'imageUrl' || name === 'productImageUrl') {
            setImageError(false);
        }

        setHasUnsavedChanges(true);
        setUpdatedProduct(prev => ({
            ...prev,
            [name === 'imageUrl' ? 'productImageUrl' : name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            // Prepare data in the format your backend expects
            const productUpdateReqDto = {
                id: updatedProduct.id,
                name: updatedProduct.name.trim(),
                description: updatedProduct.description?.trim() || '',
                price: parseFloat(updatedProduct.price),
                quantity: parseInt(updatedProduct.quantity),
                category: updatedProduct.category,
                productImageUrl: updatedProduct.productImageUrl?.trim() || ''
            };

            // Call updateProduct - adjust based on your API function signature
            // Option 1: If updateProduct expects (id, data)
            const response = await updateProduct(updatedProduct.id, productUpdateReqDto);

            // Option 2: If updateProduct expects just the data object with id
            // const response = await updateProduct(productUpdateReqDto);

            setSuccess(true);
            setHasUnsavedChanges(false);
        } catch (err) {
            console.error('Error updating product:', err);
            setError(err.message || 'Failed to update product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                navigate(-1);
            }
        } else {
            navigate(-1);
        }
    };

    if (loading || categoriesLoading) {
        return (
            <div className={styles.updateProductContainer}>
                <div className={styles.loading}>
                    <Loader />
                </div>
            </div>
        );
    }

    if (error && !updatedProduct.id) {
        return (
            <div className={styles.updateProductContainer}>
                <div className={styles.errorMessage}>{error}</div>
                <button onClick={() => navigate('/')} className={styles.backBtn}>
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className={styles.updateProductContainer}>
            <h2>Update Product</h2>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && (
                <div className={styles.successMessage}>
                    Product updated successfully! Redirecting...
                </div>
            )}

            <div className={styles.contentLayout}>
                {/* Left Column: Form */}
                <div className={styles.formSection}>
                    <form className={styles.updateForm} onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <label htmlFor="id">Product ID</label>
                            <input
                                type="text"
                                id="id"
                                name="id"
                                value={updatedProduct.id}
                                readOnly
                                className={styles.readonlyInput}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label htmlFor="name">Product Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={updatedProduct.name || ''}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting || success}
                                placeholder="Enter product name"
                            />
                        </div>

                        {/* Image URL Input */}
                        <div className={styles.formRow}>
                            <label htmlFor="imageUrl">Image URL</label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={updatedProduct.productImageUrl || ''}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                disabled={isSubmitting || success}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label htmlFor="description">Product Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={updatedProduct.description || ''}
                                onChange={handleChange}
                                rows="4"
                                disabled={isSubmitting || success}
                                placeholder="Enter product description"
                            />
                        </div>

                        <div className={styles.gridRow}>
                            <div className={styles.formRow}>
                                <label htmlFor="price">Price ($) *</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={updatedProduct.price || ''}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    disabled={isSubmitting || success}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className={styles.formRow}>
                                <label htmlFor="quantity">Quantity *</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={updatedProduct.quantity || 0}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    disabled={isSubmitting || success}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={updatedProduct.category}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting || success}
                            >
                                <option value="">Select a category</option>
                                {Array.isArray(categories) && categories.length > 0 ? (
                                    categories.map(category => (
                                        <option
                                            key={category.id || category._id}
                                            value={category.name}
                                        >
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No categories available</option>
                                )}
                            </select>
                        </div>

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className={styles.cancelBtn}
                                disabled={isSubmitting || success}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting || success}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Column: Preview */}
                <div className={styles.previewSection}>
                    <h3 className={styles.previewTitle}>Live Preview</h3>
                    <div className={styles.previewCard}>
                        <div className={styles.previewImageContainer}>
                            <img
                                src={imageError ? "https://picsum.photos/300/200" : (updatedProduct.productImageUrl || "https://picsum.photos/300/200")}
                                alt={updatedProduct.name || "Product Preview"}
                                className={styles.previewImage}
                                onError={() => setImageError(true)}
                            />
                            {updatedProduct.quantity === 0 && (
                                <div className={styles.outOfStockBadge}>Out of Stock</div>
                            )}
                        </div>
                        <div className={styles.previewContent}>
                            <div className={styles.previewCategory}>
                                {updatedProduct.category || "Category"}
                            </div>
                            <h4 className={styles.previewName}>
                                {updatedProduct.name || "Product Name"}
                            </h4>
                            <p className={styles.previewDescription}>
                                {updatedProduct.description
                                    ? (updatedProduct.description.length > 80
                                        ? updatedProduct.description.substring(0, 80) + "..."
                                        : updatedProduct.description)
                                    : "Product description will appear here..."}
                            </p>
                            <div className={styles.previewFooter}>
                                <div className={styles.previewPrice}>
                                    Rs {Number(updatedProduct.price || 0).toFixed(2)}
                                </div>
                                {updatedProduct.quantity > 0 && (
                                    <div className={styles.previewStock}>
                                        {updatedProduct.quantity} in stock
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;