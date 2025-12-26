import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './navigation.css';

function Navigation() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch((e) => console.log(e))
    }, []);

    return (
        <nav className="navigation">
            <div className="nav-container">
                <ul className="nav-list">
                    <li className="nav-item">
                        <NavLink to="/" className="nav-link" end>
                            Home
                        </NavLink>
                    </li>

                    {/* Products with CSS-only dropdown */}
                    <li className="nav-item dropdown">
                        <NavLink to="/products" className="nav-link">
                            Products
                        </NavLink>
                        {categories.length > 0 && (
                            <div className="dropdown-menu">
                                <NavLink
                                    to="/products"
                                    className="dropdown-item"
                                >
                                    All Products
                                </NavLink>
                                {categories.map(category => (
                                    <NavLink
                                        key={category.id}
                                        to={`/products/${category.name.toLowerCase()}`}
                                        className="dropdown-item"
                                    >
                                        {category.name}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </li>

                    <li className="nav-item">
                        <NavLink to="/about" className="nav-link">
                            About
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/contact" className="nav-link">
                            Contact
                        </NavLink>
                    </li>
                    <li className="nav-item cart-item">
                        <NavLink to="/cart" className="nav-link">
                            <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Cart</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/addProduct" className="nav-link">
                            Add Product
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navigation;