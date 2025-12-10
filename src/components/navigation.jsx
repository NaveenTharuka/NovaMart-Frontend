import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./navigation.css";

function Navigation() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [productMenu, setProductMenu] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/categories")
            .then(response => response.json())
            .then(data => setProductMenu(data))
            .catch(error => console.error("Error fetching product categories:", error));
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const productsMenu = productMenu.map(category => ({
        id: category.id,
        name: category.name.charAt(0).toUpperCase() + category.name.slice(1).replace('-', ' & '),
        path: `/products/${category.name.toLowerCase()}`
    }));

    return (
        <nav className="navigation">
            <div className="nav-container">
                <ul className="nav-list">
                    {/* Home */}
                    <li className="nav-item">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            Home
                        </NavLink>
                    </li>

                    {/* Products with Dropdown */}
                    <li className="nav-item relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className={`nav-link ${dropdownOpen ? 'active' : ''}`}
                        >
                            Products
                            <svg
                                className={`dropdown-arrow ${dropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <Link
                                    to="/products"
                                    className="dropdown-item"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    All Products
                                </Link>
                                {productsMenu.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className="dropdown-item"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </li>

                    {/* About Us */}
                    <li className="nav-item">
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            About Us
                        </NavLink>
                    </li>

                    {/* Contact */}
                    <li className="nav-item">
                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            Contact
                        </NavLink>
                    </li>

                    {/* Cart Icon */}
                    <li className="nav-item cart-item">
                        <NavLink
                            to="/cart"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Cart</span>
                            <span className="cart-badge">3</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navigation;