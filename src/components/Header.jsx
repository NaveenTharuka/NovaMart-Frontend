// components/Header.jsx
import Banner from "./banner.jsx";
import Navigation from "./navigation.jsx";
import Search from "./search.jsx";

function Header() {
    return (
        <div className="top-0 left-0 w-full z-50 bg-white shadow-md">
            <Banner />
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                <Navigation />
                <div className="ml-auto mr-4">
                    <Search />
                </div>
            </div>
        </div>
    );
}

export default Header;