import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState({});

    useEffect(() => {
        fetch('http://localhost:8080/api/cart/22222222-2222-2222-2222-222222222222')
            .then(response => response.json())
            .then(cartData => {
                setCartItems(cartData);

                const productIds = cartData.map(item => item.productId);

                Promise.all(
                    productIds.map(productId =>
                        fetch(`http://localhost:8080/api/products/${productId}`)
                            .then(res => res.json())
                            .catch(() => null)
                    )
                ).then(productDetails => {
                    const productMap = {};
                    productDetails.forEach((product, index) => {
                        if (product) {
                            productMap[productIds[index]] = product;
                        }
                    });
                    setProducts(productMap);
                    setLoading(false);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, []);

    const subtotal = cartItems.reduce((total, item) => total + item.subTotal, 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const updateQuantity = async (productId, change) => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: '22222222-2222-2222-2222-222222222222',
                    productId,
                    quantity: cartItems.find(item => item.productId === productId).quantity + change
                })
            });

            if (response.ok) {
                setCartItems(items =>
                    items.map(item =>
                        item.productId === productId
                            ? {
                                ...item,
                                quantity: Math.max(1, item.quantity + change),
                                subTotal: item.subTotal + (products[productId]?.price || 0) * change
                            }
                            : item
                    )
                );
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/remove`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: '22222222-2222-2222-2222-222222222222',
                    productId
                })
            });

            if (response.ok) {
                setCartItems(items => items.filter(item => item.productId !== productId));
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <p className="text-gray-600">Loading cart...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                <p className="text-gray-600 mb-8">Review your items</p>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
                        <Link
                            to="/products"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Your Items ({cartItems.length})
                                    </h2>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => {
                                        const product = products[item.productId];
                                        const productName = product?.name || item.productName;
                                        const price = product?.price || (item.subTotal / item.quantity);
                                        const image = product?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400";

                                        return (
                                            <div key={item.productId} className="p-6 flex items-center">
                                                <img
                                                    src={image}
                                                    alt={productName}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                />

                                                <div className="ml-6 flex-1">
                                                    <h3 className="font-medium text-gray-900">{productName}</h3>
                                                    <p className="text-blue-600 font-bold mt-1">
                                                        ${price.toFixed(2)} each
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Availability: {item.availability ? 'In Stock' : 'Out of Stock'}
                                                    </p>
                                                </div>

                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, -1)}
                                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l hover:bg-gray-100 disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-12 text-center border-t border-b border-gray-300 py-1">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, 1)}
                                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="ml-8 text-right">
                                                    <p className="font-bold text-gray-900">
                                                        ${item.subTotal.toFixed(2)}
                                                    </p>
                                                    <button
                                                        onClick={() => removeItem(item.productId)}
                                                        className="text-red-600 hover:text-red-800 text-sm mt-2"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">
                                            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium">${tax.toFixed(2)}</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mt-8">
                                    Proceed to Checkout
                                </button>

                                <Link
                                    to="/products"
                                    className="block text-center text-blue-600 hover:text-blue-800 font-medium mt-4"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;