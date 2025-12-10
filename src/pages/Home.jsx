import ProductCard from '../components/productCard.jsx';

function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className=" mx-auto px-4 ">
                <div className="text-center mb-12 mt-20 ">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Discover Amazing Products
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Shop the latest trends and best deals at NovaMart
                    </p>
                </div>

                {/* Featured Products */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h3>
                    <ProductCard />
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { title: "Electronics", desc: "Latest gadgets & devices" },
                        { title: "Clothing", desc: "Fashion for everyone" },
                        { title: "Home & Living", desc: "Stylish home essentials" }
                    ].map((category, index) => (
                        <div key={index} className="bg-linear-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                            <h4 className="text-xl font-bold mb-2">{category.title}</h4>
                            <p className="text-blue-100">{category.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;