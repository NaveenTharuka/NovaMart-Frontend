import { useEffect, useState } from 'react';
import { addProduct } from '@/api/product.api';
import styles from './AddProduct.module.css';
import { fetchCategories } from '@/api/category.api';

function AddProduct() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    useEffect(() => {
        async function loadCategories() {
            try {
                setIsLoadingCategories(true);
                const result = await fetchCategories();
                if (result.success) {
                    setCategories(result.data);
                } else {
                    console.error('Failed to fetch categories:', result.error);
                    setSubmitStatus({ type: 'error', message: 'Failed to load categories. Please refresh the page.' });
                }
            } catch (error) {
                console.error('Error loading categories:', error);
                setSubmitStatus({ type: 'error', message: 'Error loading categories' });
            } finally {
                setIsLoadingCategories(false);
            }
        }
        loadCategories();
    }, []);

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        imgUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
        if (submitStatus.message) setSubmitStatus({ type: '', message: '' });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setSubmitStatus({ type: '', message: '' });

        try {
            const productToSubmit = {
                ...product,
                price: parseFloat(product.price),
                quantity: parseInt(product.quantity, 10)
            };

            if (isNaN(productToSubmit.price) || productToSubmit.price <= 0) {
                setSubmitStatus({ type: 'error', message: 'Please enter a valid price (greater than 0)' });
                setIsLoading(false);
                return;
            }

            if (isNaN(productToSubmit.quantity) || productToSubmit.quantity < 0) {
                setSubmitStatus({ type: 'error', message: 'Please enter a valid quantity (0 or greater)' });
                setIsLoading(false);
                return;
            }

            if (!productToSubmit.category) {
                setSubmitStatus({ type: 'error', message: 'Please select a category' });
                setIsLoading(false);
                return;
            }

            const result = await addProduct(productToSubmit);

            if (result.success) {
                setSubmitStatus({ type: 'success', message: 'Product added successfully!' });
                setProduct({ name: '', description: '', price: '', quantity: '', category: '' });
            } else {
                setSubmitStatus({ type: 'error', message: result.error || 'Failed to add product.' });
            }

            setTimeout(() => setSubmitStatus({ type: '', message: '' }), 5000);

        } catch (error) {
            console.error('Error adding product:', error);
            setSubmitStatus({ type: 'error', message: error.message || 'Failed to add product. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.wrapper}>
            <div><h1 className={styles.title}>Add New Product</h1></div>
            <div className={`${styles.flex} ${styles.justifyCenter}`}>
                <div className={styles.container}>
                    {submitStatus.message && (
                        <div className={submitStatus.type === 'success' ? styles.successMessage : styles.errorMessage}>
                            {submitStatus.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <span className={styles.heading}>Product Name</span>
                                <input
                                    type='text'
                                    placeholder='Enter product name'
                                    name='name'
                                    value={product.name}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className={styles.input}
                                />
                            </label>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <span className={styles.heading}>Product Description</span>
                                <textarea
                                    placeholder='Enter product description'
                                    name='description'
                                    value={product.description}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className={styles.textarea}
                                />
                            </label>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <span className={styles.heading}>Product Price</span>
                                    <input
                                        type='number'
                                        name='price'
                                        value={product.price}
                                        min='0'
                                        step='0.01'
                                        placeholder='Enter product price'
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        className={styles.input}
                                    />
                                </label>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <span className={styles.heading}>Product Quantity</span>
                                    <input
                                        type='number'
                                        min='0'
                                        name='quantity'
                                        value={product.quantity}
                                        placeholder='Enter product quantity'
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        className={styles.input}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <span className={styles.heading}>Product Category</span>
                                <div className={styles.categoryWrapper}>
                                    <select
                                        name='category'
                                        value={product.category}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading || isLoadingCategories}
                                        className={`${styles.select} ${isLoadingCategories ? styles.selectLoading : ''}`}
                                    >
                                        <option value="">Select a category</option>
                                        {isLoadingCategories ? (
                                            <option value="" disabled>Loading categories...</option>
                                        ) : (
                                            categories.map(category => (
                                                <option key={category.id || category.name} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </label>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <span className={styles.heading}>Product Image URL</span>
                                <input
                                    type='text'
                                    name='imgUrl'
                                    value={product.imgUrl}
                                    placeholder='Enter product image URL'
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className={styles.input}
                                />
                            </label>
                        </div>

                        <button
                            type='submit'
                            className={`${styles.submitBtn} ${isLoading ? styles.submitBtnLoading : ''}`}
                            disabled={isLoading || isLoadingCategories}
                        >
                            {isLoading ? 'Adding Product...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;
