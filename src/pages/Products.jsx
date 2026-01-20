import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/productCard.jsx";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { category } = useParams();

    // Fetch products
    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch("http://localhost:8080/api/products")
            .then(res => res.json())
            .then(data => {
                const allProducts = Array.isArray(data) ? data : data.products || [];
                setProducts(allProducts);

                const uniqueCategories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
                setCategories(uniqueCategories);

                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load products. Please try again later.");
                setLoading(false);
            });
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="container mx-auto px-4 py-8">

                {/* Page Header */}
                <div className="mb-8 mt-20">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{getCategoryName()}</h2>
                    <p className="text-gray-600">
                        {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
                    </p>

                    {/* Category Filters */}
                    {categories.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            <Link
                                to="/products"
                                className={`px-4 py-2 rounded-full ${!category ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                            >
                                All
                            </Link>
                            {categories.map(cat => (
                                <Link
                                    key={cat}
                                    to={`/products/${cat.toLowerCase()}`}
                                    className={`px-4 py-2 rounded-full ${category === cat.toLowerCase() ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-500">Loading products...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    /* Grid of Products */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-4">No products found.</p>
                        {category && (
                            <div>
                                <p className="text-gray-400 mb-4">
                                    No products found in the "{getCategoryName()}" category.
                                </p>
                                <Link
                                    to="/products"
                                    className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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
