import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard/ProductCard";
import Loader from "@/components/Loader/Loader";
import styles from "./Products.module.css";
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from "@/api/product.api";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { category } = useParams();

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await getAllProducts();

                if (result.success) {
                    const allProducts = Array.isArray(result.data) ? result.data : result.data?.products || [];
                    setProducts(allProducts);

                    const uniqueCategories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
                    setCategories(uniqueCategories);
                } else {
                    setError(result.error || "Failed to load products");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products by category
    const filteredProducts = category
        ? products.filter(p => p.category?.toLowerCase() === category.toLowerCase())
        : products;

    const getCategoryName = () => {
        if (!category) return "All Products";
        const found = categories.find(c => c.toLowerCase() === category.toLowerCase());
        return found || category;
    };

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorContent}>
                    <p className={styles.errorMessage}>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className={styles.retryButton}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <section className={styles.contentWrapper}>

                {/* Page Header */}
                <div className={styles.headerSection}>
                    <h2 className={styles.pageTitle}>{getCategoryName()}</h2>
                    <p className={styles.resultCount}>
                        {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
                    </p>

                    {/* Category Filters */}
                    {categories.length > 0 && (
                        <div className={styles.filtersContainer}>
                            <Link
                                to="/products"
                                className={`${styles.filterChip} ${!category ? styles.filterChipActive : styles.filterChipInactive}`}
                            >
                                All
                            </Link>
                            {categories.map(cat => (
                                <Link
                                    key={cat}
                                    to={`/products/${cat.toLowerCase()}`}
                                    className={`${styles.filterChip} ${category === cat.toLowerCase() ? styles.filterChipActive : styles.filterChipInactive}`}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading ? (
                    <Loader />
                ) : filteredProducts.length > 0 ? (
                    /* Grid of Products */
                    <div className={styles.productGrid}>
                        {filteredProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className={styles.animatedCard}
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                ) : (
                    /* Empty State */
                    <div className={styles.emptyState}>
                        <p className={styles.emptyMessage}>No products found.</p>
                        {category && (
                            <div>
                                <p className={styles.emptySubMessage}>
                                    No products found in the "{getCategoryName()}" category.
                                </p>
                                <Link
                                    to="/products"
                                    className={styles.viewAllButton}
                                >
                                    View All Products
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Products;
