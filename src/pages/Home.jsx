import { useEffect, useState } from "react";
import ProductCard from "../components/productCard.jsx";
import './Home.css'

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch((e) => console.log(e))
    }, []);

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
                        Simple. Fast. Reliable Shopping.
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
                <div className="flex justify-center py-12">
                    <div className="card">
                        {categories.map((category) => (
                            <p key={category.id}>
                                <span>{category.name}</span>
                            </p>
                        ))}
                    </div>
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