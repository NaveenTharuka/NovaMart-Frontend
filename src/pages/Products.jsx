import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/productCard.jsx";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { category } = useParams();

    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then(res => res.json())
            .then(data => {
                let allProducts = Array.isArray(data) ? data : data.products || [];

                // Filter by category if category parameter exists
                if (category) {
                    allProducts = allProducts.filter(product =>
                        product.category?.toLowerCase() === category.toLowerCase()
                    );
                }

                setProducts(allProducts);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, [category]);

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="container mx-auto px-4 py-8">
                <div className="mb-8 mt-20">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
                    </h2>
                    <p className="text-gray-600">
                        {products.length} products found
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading products...</p>
                    </div>
                ) : products.length > 0 ? (
                    <ProductCard products={products} />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No products found.</p>
                        {category && (
                            <p className="text-gray-400 mt-2">
                                Try browsing our <a href="/products" className="text-blue-500 hover:underline">all products</a>
                            </p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Products;