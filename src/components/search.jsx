import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./search.css";

function Search() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

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
        <div className="search-wrapper" ref={wrapperRef}>
            <form onSubmit={handleSearch} className="search-box">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(e.target.value.trim().length > 2);
                    }}
                    onFocus={() => setShowResults(query.trim().length > 2)}
                />
                <button type="submit">🔍</button>
            </form>

            {showResults && (
                <div className="search-dropdown">
                    {loading ? (
                        <div className="search-loading">Searching...</div>
                    ) : products.length ? (
                        <>
                            {products.map(p => (
                                <div
                                    key={p.id}
                                    className="search-item"
                                    onClick={() => navigate(`/product/${p.id}`)}
                                >
                                    <img src={p.imageUrl || "https://picsum.photos/100"} alt={p.name} />
                                    <div>
                                        <p>{p.name}</p>
                                        <span>${p.price?.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                            <div
                                className="search-view-all"
                                onClick={() => navigate(`/products?search=${encodeURIComponent(query)}`)}
                            >
                                View all results →
                            </div>
                        </>
                    ) : (
                        <div className="search-loading">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Search;
