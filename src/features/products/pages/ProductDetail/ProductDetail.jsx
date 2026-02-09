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
                        <div className={styles.header}>
                            <div className={styles.category}>{product.category || "Uncategorized"}</div>
                            <h1 className={styles.title}>{product.name}</h1>

                            <div className={styles.ratingRow}>
                                <div className={styles.stars}>★★★★☆</div>
                                <span className={styles.reviewCount}>({product.reviewCount || 42} reviews)</span>
                            </div>
                        </div>

                        <div className={styles.priceBlock}>
                            <span className={styles.currentPrice}>Rs {product.price?.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className={styles.originalPrice}>Rs {product.originalPrice.toFixed(2)}</span>
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
            </div>
        </div>
    );
}

export default ProductDetail;
