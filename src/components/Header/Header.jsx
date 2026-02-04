import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation/Navigation";
import Search from "@/components/Search/Search";
import useAuth from "@/auth/UseAuth";
import styles from './Header.module.css';

function Header() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    return (
        <header className={styles.header}>
            {/* Logo + Desktop Navigation */}
            <div className={styles.headerLeft}>
                <Link to="/" className={styles.logo}>
                    {isMobile ? "NM" : "NovaMart"}
                </Link>
                {!isMobile && <Navigation />}
            </div>

            {/* Centered Search */}
            <div className={styles.headerCenter}>
                <Search />
            </div>

            {/* Right Side */}
            <div className={styles.headerRight}>
                <Link to="/cart" className={styles.cartBtn}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span style={{ display: isMobile ? 'none' : 'inline' }}>Cart</span>
                </Link>

                {user ? (
                    <div className={styles.avatar} onPointerUp={() => navigate("/userpage")}>
                        {user.userName[0].toUpperCase()}
                    </div>
                ) : (
                    <button className={styles.loginBtn} onClick={() => navigate("/login")}>
                        Login
                    </button>
                )}

                {/* Hamburger for mobile */}
                {isMobile && (
                    <button className={styles.hamburger} onClick={toggleMobileMenu}>
                        <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOpen1 : ''}`} />
                        <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOpen2 : ''}`} />
                        <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOpen3 : ''}`} />
                    </button>
                )}
            </div>

            {/* Mobile Navigation */}
            {isMobile && isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <Navigation mobile={true} toggleMenu={toggleMobileMenu} />
                </div>
            )}
        </header>
    );
}

export default Header;
