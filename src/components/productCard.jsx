import { useEffect, useState } from "react";
import "./productCard.css";

function ProductCard() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error("Error fetching products:", error));

    }, []);

    return (
        <div className="max-w-[1200px] mx-auto p-6 grid 
                grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {products.map(product => (
                <div key={product.id} className="w-[250px] m-2 cbg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg shadow-black/20 p-4 hover:shadow-2xl hover:scale-[1.02] duration-300">
                    <h2 className="product-name">{product.name}</h2>
                    <p className="product-category">Category: {product.category}</p>
                    <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover mt-2 rounded-md" />
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <p className="product-quantity">Quantity : {product.quantity}</p>
                    <p className="product-description">{product.description}</p>
                </div>
            ))}
        </div>
    );
}

export default ProductCard;
