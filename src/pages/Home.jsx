import { useEffect, useState } from "react";
import ProductCard from "../components/productCard.jsx";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    // Get only featured products (first 6 for homepage)
    const featuredProducts = products.slice(0, 6);

    return (
        <div className="min-h-screen">
            <section className="container mx-auto px-4">
                {/* Hero Section */}
                <div className="text-center mb-12 mt-20">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Shop latest Products
                    </h1>
                    <p className="text-gray-600 text-lg">
                        best - quality, best - products
                    </p>
                </div>

                {/* Featured Products */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        Featured Products
                    </h3>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : (
                        <ProductCard products={featuredProducts} />
                    )}
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { title: "Electronics", desc: "Latest gadgets & devices" },
                        { title: "Clothing", desc: "Fashion for everyone" },
                        { title: "Home & Living", desc: "Stylish home essentials" }
                    ].map((category, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white shadow-lg hover:scale-105 transition-transform"
                        >
                            <h4 className="text-xl font-bold mb-2">{category.title}</h4>
                            <p className="text-blue-100">{category.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-8 text-center text-white mb-12">
                    <h3 className="text-2xl font-bold mb-4">Special Offers!</h3>
                    <p className="mb-4">Get 20% off on your first order. Use code: NOVA20</p>
                    <button className="bg-white text-orange-500 font-bold py-2 px-6 rounded-lg hover:bg-gray-100">
                        Shop Now
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Home;