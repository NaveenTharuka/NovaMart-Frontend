import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Search.module.css';

function Search() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (query.trim().length > 2) {
            setLoading(true);
            fetch("http://localhost:8080/api/products")
                .then(res => res.json())
                .then(data => {
                    const all = Array.isArray(data) ? data : data.products || [];
                    const filtered = all.filter(p =>
                        p?.name?.toLowerCase().includes(query.toLowerCase())
                    );
                    setProducts(filtered.slice(0, 5));
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setProducts([]);
        }
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query)}`);
            setShowResults(false);
        }
    };

    return (
        <div className={styles.searchWrapper} ref={wrapperRef}>
            <form
                onSubmit={handleSearch}
                className={styles.searchForm}
            >
                <input
                    type="text"
                    placeholder={isMobile ? "Search" : "Search products..."}
                    value={query}
                    className={styles.searchInput}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(e.target.value.trim().length > 2);
                    }}
                    onFocus={() => setShowResults(query.trim().length > 2)}
                />
                <button
                    type="submit"
                    className={styles.searchButton}
                >
                    🔍
                </button>
            </form>

            {showResults && (
                <div className={styles.dropdown}>
                    {loading ? (
                        <div className={styles.loading}>Searching...</div>
                    ) : products.length ? (
                        <>
                            {products.map(p => (
                                <div
                                    key={p.id}
                                    className={styles.resultItem}
                                    onClick={() => navigate(`/product/${p.id}`)}
                                >
                                    <img
                                        src={p.imageUrl || "https://picsum.photos/100"}
                                        alt={p.name}
                                        className={styles.resultImg}
                                    />
                                    <div>
                                        <p className={styles.resultName}>{p.name}</p>
                                        <span className={styles.resultPrice}>${p.price?.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                            <div
                                className={styles.viewAll}
                                onClick={() => navigate(`/products?search=${encodeURIComponent(query)}`)}
                            >
                                View all results →
                            </div>
                        </>
                    ) : (
                        <div className={styles.noResults}>No results found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Search;
