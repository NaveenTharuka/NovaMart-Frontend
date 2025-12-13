import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetch(`http://localhost:8080/api/products/id/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [id]);

    const addToCart = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/cart/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: '22222222-2222-2222-2222-222222222222',
                    productId: id,
                    quantity: quantity
                })
            });

            if (response.ok) {
                alert('Product added to cart!');
                navigate('/cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    <p className="text-gray-500">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-500 hover:text-blue-700 mb-6"
                >
                    ← Back
                </button>

                <div className="grid md:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg p-8">
                    {/* Product Image */}
                    <div>
                        <img
                            src={product.imageUrl || "https://picsum.photos/800"}
                            alt={product.name}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </div>

                    {/* Product Details */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <div className="flex items-center mb-4">
                            <span className="text-2xl font-bold text-blue-600">${product.price?.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-gray-500 line-through ml-4">${product.originalPrice.toFixed(2)}</span>
                            )}
                        </div>

                        <p className="text-gray-600 mb-6">{product.description || 'No description available.'}</p>

                        <div className="mb-6">
                            <span className="font-medium">Category:</span>
                            <span className="ml-2 text-blue-500">{product.category || 'Uncategorized'}</span>
                        </div>

                        <div className="flex items-center mb-8">
                            <span className="font-medium mr-4">Quantity:</span>
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 border border-gray-300 rounded-l-lg"
                            >
                                -
                            </button>
                            <span className="w-12 text-center border-t border-b border-gray-300 py-2">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 border border-gray-300 rounded-r-lg"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={addToCart}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mb-4"
                        >
                            Add to Cart
                        </button>

                        <button
                            onClick={() => {
                                addToCart();
                                navigate('/cart');
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p><span className="font-medium">Brand:</span> {product.brand || 'N/A'}</p>
                            <p><span className="font-medium">SKU:</span> {product.sku || 'N/A'}</p>
                        </div>
                        <div>
                            <p><span className="font-medium">Availability:</span>
                                <span className={`ml-2 ${product.quantity != 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </p>
                            <p><span className="font-medium">Rating:</span> {product.rating || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;