import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './navigation.css';

function Navigation({ mobile, toggleMenu }) {
    const [categories, setCategories] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(e => console.log(e));
    }, []);

    return (
        <nav className={`navigation ${mobile ? "mobile-nav" : ""}`}>
            <ul className="nav-list">
                <li>
                    <Link to="/" onClick={toggleMenu}>Home</Link>
                </li>

                <li
                    className="dropdown"
                    onMouseEnter={() => !mobile && setOpenDropdown(true)}
                    onMouseLeave={() => !mobile && setOpenDropdown(false)}
                    onClick={() => mobile && setOpenDropdown(!openDropdown)}
                >
                    <span className="dropdown-title">Products</span>
                    <ul className={`dropdown-menu ${openDropdown ? "open" : ""}`}>
                        <li>
                            <Link to="/products" onClick={toggleMenu}>All Products</Link>
                        </li>
                        {categories.map(cat => (
                            <li key={cat.id}>
                                <Link to={`/products/${cat.name.toLowerCase()}`} onClick={toggleMenu}>
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>

                <li>
                    <Link to="/about" onClick={toggleMenu}>About</Link>
                </li>

                <li>
                    <Link to="/contact" onClick={toggleMenu}>Contact</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
