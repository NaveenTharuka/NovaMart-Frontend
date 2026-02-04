import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from './Navigation.module.css';

function Navigation({ mobile, toggleMenu }) {
    const [categories, setCategories] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/api/categories")
            .then(res => res.json())
            .then(setCategories)
            .catch(console.error);
    }, []);

    const toggleDropdown = () => setOpenDropdown(prev => !prev);

    return (
        <nav className={styles.nav}>
            <ul className={`${styles.navList} ${mobile ? styles.mobile : ''}`}>
                <li>
                    <Link to="/" onClick={toggleMenu} className={styles.navLink}>
                        Home
                    </Link>
                </li>

                <li
                    className={styles.dropdownItem}
                    onMouseEnter={() => !mobile && setOpenDropdown(true)}
                    onMouseLeave={() => !mobile && setOpenDropdown(false)}
                    onClick={() => mobile && toggleDropdown()}
                >
                    <span className={styles.dropdownTitle}>Products</span>
                    <ul className={`${styles.dropdownMenu} ${openDropdown ? styles.visible : ''} ${mobile ? styles.mobile : ''}`}>
                        <li className={styles.menuItem}>
                            <Link to="/products" onClick={toggleMenu} className={styles.menuLink}>
                                All Products
                            </Link>
                        </li>
                        {categories.map(cat => (
                            <li key={cat.id} className={styles.menuItem}>
                                <Link
                                    to={`/products/${cat.name.toLowerCase()}`}
                                    onClick={toggleMenu}
                                    className={styles.menuLink}
                                >
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>

                <li>
                    <Link to="/about" onClick={toggleMenu} className={styles.navLink}>About</Link>
                </li>

                <li>
                    <Link to="/contact" onClick={toggleMenu} className={styles.navLink}>Contact</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
