function About() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">About NovaMart</h1>
                    <div className="prose prose-lg text-gray-600">
                        <p className="mb-4">
                            Welcome to NovaMart! We're passionate about bringing you the best products
                            from around the world at unbeatable prices.
                        </p>
                        <p className="mb-4">
                            Founded with the vision to make online shopping seamless and enjoyable,
                            we carefully curate our collection to ensure quality and value.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                            <div className="text-gray-700">Products</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                            <div className="text-gray-700">Support</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">Free</div>
                            <div className="text-gray-700">Shipping</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;