import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard/ProductCard";
import Loader from "@/components/Loader/Loader";
import Beams from "@/components/Background";
import styles from './Home.module.css';

function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [scrollY, setScrollY] = useState(0);

    const heroRef = useRef(null);
    const featuredRef = useRef(null);
    const aboutRef = useRef(null);
    const servicesRef = useRef(null);
    const categoriesRef = useRef(null);

    const [isVisible, setIsVisible] = useState({
        hero: true,
        featured: false,
        about: false,
        services: false,
        categories: false,
    });

    // Sample services data
    const services = [
        { icon: '🚚', title: "Fast Delivery", description: "Get your orders delivered within 2-3 business days" },
        { icon: '🔄', title: "Easy Returns", description: "30-day return policy with free returns" },
        { icon: '🛡️', title: "Secure Payment", description: "100% secure payment with SSL encryption" },
        { icon: '⭐', title: "Premium Quality", description: "All products are quality checked & certified" }
    ];

    const categoryIcons = {
        'Electronics': '💻', 'Fashion': '👕', 'Home & Kitchen': '🏠',
        'Books': '📚', 'Sports': '⚽', 'Beauty': '💄',
        'Watches': '⌚', 'Audio': '🎧', 'Cameras': '📷'
    };

    const categoryColors = {
        'Electronics': 'from-blue-400 to-cyan-400',
        'Fashion': 'from-pink-400 to-rose-400',
        'Home & Kitchen': 'from-green-400 to-emerald-400',
        'Books': 'from-purple-400 to-indigo-400',
        'Sports': 'from-orange-400 to-amber-400',
        'Beauty': 'from-red-400 to-pink-400',
        'Watches': 'from-amber-400 to-orange-400',
        'Audio': 'from-purple-400 to-indigo-400',
        'Cameras': 'from-green-400 to-teal-400'
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);

        const handleScroll = () => {
            setScrollY(window.scrollY);

            const checkVisibility = (ref, key) => {
                if (ref.current) {
                    const rect = ref.current.getBoundingClientRect();
                    const visibleNow = rect.top <= window.innerHeight * 0.8;
                    if (visibleNow && !isVisible[key]) {
                        setIsVisible(prev => ({ ...prev, [key]: true }));
                    }
                }
            };

            checkVisibility(featuredRef, 'featured');
            checkVisibility(aboutRef, 'about');
            checkVisibility(servicesRef, 'services');
            checkVisibility(categoriesRef, 'categories');
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isVisible]);

    useEffect(() => {
        // Fetch categories
        fetch("http://localhost:8080/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(console.log);

        // Fetch products
        fetch("http://localhost:8080/api/products")
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : data.products || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, []);

    const featuredProducts = isMobile ? products.slice(0, 6) : products.slice(0, 4);

    return (
        <div className={styles['home-page']}>
            {/* Hero Section */}
            <section className={styles['hero-section']} ref={heroRef}>
                <div className={styles['beams-bg']}>
                    <Beams beamWidth={3} beamHeight={30} beamNumber={20} lightColor="#ffffff" speed={2} noiseIntensity={1.75} scale={0.2} rotation={30} />
                </div>

                <div className={styles['hero-content']} style={{ opacity: Math.max(0, 1 - scrollY / (heroRef.current?.clientHeight * 0.5)) }}>
                    <span className={`${styles['hero-badge']} ${isVisible.hero ? styles['animate-fade-up'] : ''}`}>
                        ✨ Welcome to Nova Store
                    </span>
                    <h1 className={`${styles['hero-title']} ${isVisible.hero ? styles['animate-fade-up-delay-1'] : ''}`}>
                        Discover the <span className={styles['gradient-text']}>Latest</span><br />Products
                    </h1>
                    <p className={`${styles['hero-subtitle']} ${isVisible.hero ? styles['animate-fade-up-delay-2'] : ''}`}>
                        Simple. Fast. Reliable Shopping. Handpicked premium products curated just for you.
                    </p>
                    <div className={`${styles['hero-buttons']} ${isVisible.hero ? styles['animate-fade-up-delay-3'] : ''}`}>
                        <Link to="/products"><button className={styles['hero-btn-primary']}>Explore Now</button></Link>
                        <Link to="/about"><button className={styles['hero-btn-secondary']}>Learn More</button></Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className={`${styles['featured-section']} ${styles['section-bg-1']}`} ref={featuredRef}>
                <div className={styles.container}>
                    <div className={`${styles['section-header']} ${isVisible.featured ? styles['animate-slide-up'] : ''}`}>
                        <span className={styles['section-badge']}>Featured Collection</span>
                        <h2>Trending Products</h2>
                        <p>Discover our handpicked selection of premium products loved by thousands of customers.</p>
                    </div>

                    {loading ? <Loader /> : (
                        <div className={styles['product-grid']}>
                            {featuredProducts.map((product, idx) => (
                                <div key={product.id} className={`${styles['product-wrapper']} ${isVisible.featured ? styles['animate-scale-in'] : ''}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`${styles['section-footer']} ${isVisible.featured ? styles['animate-slide-up'] : ''}`}>
                        <Link to="/products"><button className={styles['view-all-btn']}>View All Products</button></Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className={`${styles['categories-section']} ${styles['section-bg-2']}`} ref={categoriesRef}>
                    <div className={styles.container}>
                        <div className={`${styles['section-header']} ${isVisible.categories ? styles['animate-slide-up'] : ''}`}>
                            <span className={styles['section-badge']}>Browse Categories</span>
                            <h2>Shop by Category</h2>
                            <p>Find exactly what you're looking for in our curated categories.</p>
                        </div>

                        <div className={styles['categories-grid']}>
                            {categories.map((cat, idx) => (
                                <Link key={cat.id} to={`/products/${cat.name.toLowerCase()}`} className={`${styles['category-card']} ${isVisible.categories ? styles['animate-scale-in'] : ''}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className={styles['category-card-inner']}>
                                        <div className={`${styles['category-icon']} ${categoryColors[cat.name] || 'from-blue-400 to-cyan-400'}`}>
                                            {categoryIcons[cat.name] || '📦'}
                                        </div>
                                        <h3>{cat.name}</h3>
                                        <p>Explore collection →</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* About Section */}
            <section className={`${styles['about-section']} ${styles['section-bg-3']}`} ref={aboutRef}>
                <div className={styles.container}>
                    <div className={styles['about-grid']}>
                        <div className={`${styles['about-content']} ${isVisible.about ? styles['animate-slide-up'] : ''}`}>
                            <span className={styles['section-badge']}>About Us</span>
                            <h2>Who <span className={styles['gradient-text']}>We Are</span></h2>
                            <p className={styles['about-text']}>We're more than just an online store. Nova Store is a curated marketplace bringing you the finest products from around the world.</p>
                            <p className={styles['about-text']}>Founded with a passion for quality and customer satisfaction, we carefully select each product to ensure it meets our high standards.</p>
                            <div className={styles.stats}>
                                <div className={`${styles['stat-item']} ${isVisible.about ? styles['animate-slide-up'] : ''}`}> <div className={styles['stat-number']}>10K+</div> <div className={styles['stat-label']}>Happy Customers</div> </div>
                                <div className={`${styles['stat-item']} ${isVisible.about ? styles['animate-slide-up'] : ''}`}> <div className={styles['stat-number']}>100+</div> <div className={styles['stat-label']}>Premium Products</div> </div>
                                <div className={`${styles['stat-item']} ${isVisible.about ? styles['animate-slide-up'] : ''}`}> <div className={styles['stat-number']}>1K+</div> <div className={styles['stat-label']}>Deliveries</div> </div>
                            </div>
                        </div>

                        <div className={`${styles['about-stats']} ${isVisible.about ? styles['animate-slide-up'] : ''}`}>
                            <div className={`${styles['glass-card']} ${styles['stats-card']}`}>
                                <div className={styles['stats-bg-1']}></div>
                                <div className={styles['stats-bg-2']}></div>
                                <div className={styles['stats-content']}>
                                    {[{ label: "Quality Assurance", value: 98 }, { label: "Customer Satisfaction", value: 95 }, { label: "Fast Delivery Rate", value: 92 }]
                                        .map((item, idx) => (
                                            <div key={item.label} className={`${styles['progress-item']} ${isVisible.about ? styles['animate-slide-up'] : ''}`} style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                                                <div className={styles['progress-header']}><span>{item.label}</span><span className={styles['progress-value']}>{item.value}%</span></div>
                                                <div className={styles['progress-bar']}><div className={styles['progress-fill']} style={{ width: `${item.value}%` }}></div></div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className={`${styles['services-section']} ${styles['section-bg-4']}`} ref={servicesRef}>
                <div className={styles.container}>
                    <div className={`${styles['section-header']} ${isVisible.services ? styles['animate-slide-up'] : ''}`}>
                        <span className={styles['section-badge']}>Why Choose Us</span>
                        <h2>Our Services</h2>
                        <p>We provide exceptional services to make your shopping experience seamless and enjoyable.</p>
                    </div>

                    <div className={styles['services-grid']}>
                        {services.map((service, idx) => (
                            <div key={service.title} className={`${styles['service-card']} ${isVisible.services ? styles['animate-slide-up'] : ''}`} style={{ animationDelay: `${idx * 0.15}s` }}>
                                <div className={styles['service-icon']}>{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
