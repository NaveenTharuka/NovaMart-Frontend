import './banner.css';

function Banner() {
    return (
        <div className="banner">
            <div className="max-w-7xl mx-auto p-10">
                <div className="text-center p-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Welcome to NovaMart!
                    </h1>
                    <p className="text-white/90 text-lg">
                        Your one-stop shop for amazing products
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Banner;