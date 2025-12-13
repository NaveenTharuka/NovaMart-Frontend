import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './search.css';

function Search() {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (query.trim().length > 2) {
            setLoading(true);
            fetch("http://localhost:8080/api/products")
                .then(res => res.json())
                .then(data => {
                    const allProducts = Array.isArray(data) ? data : data.products || [];
                    const filtered = allProducts.filter(p =>
                        p?.name?.toLowerCase().includes(query.toLowerCase())
                    );
                    setProducts(filtered.slice(0, 5));
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching products:", err);
                    setLoading(false);
                });
        } else {
            setProducts([]);
        }
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query)}`);
            setQuery('');
            setShowResults(false);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
        setQuery('');
        setShowResults(false);
    };

    return (
        <div className="search relative">
            <form onSubmit={handleSearch} className="flex">
                <input
                    type="text"
                    placeholder="Search for products..."
                    className="search-bar p-2 pl-4 pr-10 border border-gray-300 rounded-l-lg focus:outline-none"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(e.target.value.trim().length > 2);
                    }}
                    onFocus={() => setShowResults(query.trim().length > 2)}
                />
                <button
                    type="submit"
                    className="search-Btn rounded-r-lg"
                    aria-label="Search"
                ></button>
            </form>

            {/* Dropdown Search Results */}
            {showResults && (
                <div className="absolute top-full right-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="p-3 text-center text-gray-500">
                            Loading...
                        </div>
                    ) : products.length > 0 ? (
                        <div>
                            {products.map(product => (
                                <div
                                    key={product.id || product._id}
                                    className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleProductClick(product.id || product._id)}
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100"}
                                            alt={product.name}
                                            className="w-10 h-10 object-cover rounded mr-3"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                                            <p className="text-blue-600 font-bold text-sm">${product.price?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div
                                className="p-3 text-center text-blue-500 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                                onClick={() => {
                                    navigate(`/products?search=${encodeURIComponent(query)}`);
                                    setShowResults(false);
                                }}
                            >
                                View all results for "{query}"
                            </div>
                        </div>
                    ) : query.trim().length > 2 ? (
                        <div className="p-3 text-center text-gray-500">
                            No products found
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default Search;