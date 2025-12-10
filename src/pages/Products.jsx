import { useParams } from 'react-router-dom';
import ProductCard from '../components/productCard.jsx';

function Products() {
    const { category } = useParams();

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : "All Products"}
                    </h1>
                    <p className="text-gray-600">
                        Browse our collection of amazing products
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        <a
                            href="/products"
                            className={`px-4 py-2 rounded-full whitespace-nowrap ${!category
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Products
                        </a>
                        {['electronics', 'clothing', 'accessories', 'home-living'].map((cat) => (
                            <a
                                key={cat}
                                href={`/products/${cat}`}
                                className={`px-4 py-2 rounded-full whitespace-nowrap ${category === cat
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' & ')}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <ProductCard category={category} />
            </div>
        </div>
    );
}

export default Products;