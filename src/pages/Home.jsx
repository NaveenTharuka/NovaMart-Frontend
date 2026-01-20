import { useEffect, useState } from "react";
import ProductCard from "../components/productCard.jsx";
import { Link } from "react-router-dom";
import './Home.css';

function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch categories
        fetch("http://localhost:8080/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(e => console.log(e));

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

    const featuredProducts = products.slice(0, 6); // First 6 products for homepage

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="container mx-auto px-4">

                {/* Hero Section */}
                <div className="text-center mb-16 mt-20">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                        Discover the Latest Products
                    </h1>
                    <p className="text-gray-600 text-lg max-w-xl mx-auto">
                        Simple. Fast. Reliable Shopping. Handpicked products for you.
                    </p>
                    <Link to="/products">
                        <button className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-orange-600 transition duration-300">
                            Explore Now
                        </button>
                    </Link>
                </div>

                {/* Featured Products */}
                <div className="mb-16">
                    <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                        Featured Products
                    </h3>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Shop by Category
                        </h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {categories.map(category => (
                                <Link
                                    key={category.id}
                                    to={`/products/${category.name.toLowerCase()}`}
                                    className="bg-white shadow-md rounded-lg px-6 py-3 hover:shadow-xl hover:-translate-y-1 transition transform duration-300 font-semibold text-gray-800"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-12 text-center text-white shadow-lg mb-16">
                    <h3 className="text-3xl font-bold mb-4">Special Offers!</h3>
                    <p className="mb-6 text-lg">
                        Get 20% off on your first order. Use code: <span className="font-extrabold">NOVA20</span>
                    </p>
                    <Link to="/products">
                        <button className="bg-white text-orange-500 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition duration-300">
                            Shop Now
                        </button>
                    </Link>
                </div>

            </section>
        </div>
    );
}

export default Home;
