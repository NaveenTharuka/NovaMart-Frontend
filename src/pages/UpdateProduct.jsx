import styles from './UpdateProduct.module.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UpdateProduct() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState([]);

    // Fixed: Added empty dependency array to prevent infinite loop
    useEffect(() => {
        fetch("http://localhost:8080/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch((e) => console.log(e));
    }, []); // Added empty dependency array

    const [updatedProduct, setUpdatedProduct] = useState({
        id: '',
        name: '',
        description: '',
        price: '',
        quantity: 0,
        category: ''
    });

    // Fixed: Removed duplicate fetch call and fixed conditional logic
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const response = await fetch(`http://localhost:8080/api/products/id/${id}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch product: ${response.status}`);
                }

                const data = await response.json();
                setUpdatedProduct(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        // Fixed: Check id before fetching
        if (id) {
            fetchProduct();
        } else {
            setError('No product ID provided');
            setLoading(false);
        }
    }, [id]); // Added id as dependency

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setUpdatedProduct(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false); // Reset success state

        try {
            const response = await fetch(`http://localhost:8080/api/products`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) {
                throw new Error(`Failed to update product: ${response.status}`);
            }

            setSuccess(true);
            window.alert('Product updated successfully!');

        } catch (err) {
            console.error('Error updating product:', err);
            setError('Failed to update product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <div className={styles.updateProductContainer}>
                <div className={styles.loading}>Loading product data...</div>
            </div>
        );
    }

    if (error && !updatedProduct.id) {
        return (
            <div className={styles.updateProductContainer}>
                <div className={styles.errorMessage}>{error}</div>
                <button onClick={() => window.location.href = '/'} className={styles.backBtn}>
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className={styles.updateProductContainer}>
            <h2>Update Product</h2>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>Product updated successfully!</div>}

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
                            <label htmlFor="name">Product Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={updatedProduct.name}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Image URL Input */}
                        <div className={styles.formRow}>
                            <label htmlFor="imageUrl">Image URL</label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={updatedProduct.imageUrl || ''}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label htmlFor="description">Product Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={updatedProduct.description}
                                onChange={handleChange}
                                rows="4"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className={styles.gridRow}>
                            <div className={styles.formRow}>
                                <label htmlFor="price">Price ($)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={updatedProduct.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={updatedProduct.quantity}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={updatedProduct.category}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category.id || category.name} value={category.name} className={styles.dropdown}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className={styles.cancelBtn}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting}
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
                                src={updatedProduct.imageUrl || "https://picsum.photos/300/200"}
                                alt="Product Preview"
                                className={styles.previewImage}
                                onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=Error+Loading+Image")}
                            />
                            {updatedProduct.quantity === 0 && (
                                <div className={styles.outOfStockBadge}>Out of Stock</div>
                            )}
                        </div>
                        <div className={styles.previewContent}>
                            <div className={styles.previewCategory}>{updatedProduct.category || "Category"}</div>
                            <h4 className={styles.previewName}>{updatedProduct.name || "Product Name"}</h4>
                            <p className={styles.previewDescription}>
                                {updatedProduct.description
                                    ? (updatedProduct.description.length > 80
                                        ? updatedProduct.description.substring(0, 80) + "..."
                                        : updatedProduct.description)
                                    : "Product description will appear here..."}
                            </p>
                            <div className={styles.previewFooter}>
                                <div className={styles.previewPrice}>Rs {Number(updatedProduct.price).toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;