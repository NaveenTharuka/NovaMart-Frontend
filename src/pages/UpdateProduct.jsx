import './UpdateProduct.css';
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
        price: 0,
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
            <div className="update-product-container">
                <div className="loading">Loading product data...</div>
            </div>
        );
    }

    if (error && !updatedProduct.id) {
        return (
            <div className="update-product-container">
                <div className="error-message">{error}</div>
                <button onClick={() => window.location.href = '/'} className="back-btn">
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className="update-product-container">
            <h2>Update Product</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Product updated successfully!</div>}

            <form className="update-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="id">Product ID</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={updatedProduct.id}
                        readOnly
                        className="readonly-input"
                    />
                </div>

                <div className="form-row">
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

                <div className="form-row">
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

                <div className="form-row">
                    <label htmlFor="price">Product Price ($)</label>
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

                <div className="form-row">
                    <label htmlFor="quantity">Product Quantity</label>
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

                <div className="form-row">
                    <label htmlFor="category">Product Category</label>
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
                            <option key={category.id || category.name} value={category.name} className='dropdown'>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="cancel-btn"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateProduct;