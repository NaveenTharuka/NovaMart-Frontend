import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/api/products/id/${id}`)
            .then(response => response.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching product:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-center p-12">Loading...</div>;
    if (!product) return <div className="text-center p-12">Product not found</div>;

    return (
        <div className="max-w-[1200px] mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 p-8">
                    {/* Product Image */}
                    <div>
                        <img
                            src={product.imageUrl || "https://picsum.photos/600/400"}
                            alt={product.name}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <p className="text-3xl text-blue-600 font-bold mb-6">${product.price.toFixed(2)}</p>

                        <div className="mb-6">
                            <span className="inline-block bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                                {product.category}
                            </span>
                        </div>

                        <p className="text-gray-700 mb-8">{product.description}</p>

                        <div className="mb-8">
                            <p className="text-gray-600 mb-2">Availability:</p>
                            <p className={`font-bold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.quantity > 0 ? `${product.quantity} items in stock` : 'Out of stock'}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                                disabled={product.quantity === 0}
                            >
                                Add to Cart
                            </button>
                            <Link
                                to="/products"
                                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;