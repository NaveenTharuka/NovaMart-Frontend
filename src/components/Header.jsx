import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "./navigation"
import Search from "./Search";
import useAuth from "../auth/UseAuth";
import './header.css';

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

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo">NovaMart</Link>

                {!isMobile && <Navigation />} {/* Desktop nav links */}
            </div>

            <div className="header-center">
                <Search />
            </div>

            <div className="header-right">
                {/* Cart */}
                <Link to="/cart" className="cart-btn-with-label">
                    <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <span className="cart-label">Cart</span>
                </Link>

                {/* Avatar / Login */}
                {user ? (
                    <div className="avatar" onClick={() => navigate("/userpage")}>
                        {user.userName[0].toUpperCase()}
                    </div>
                ) : (
                    <button className="login-btn" onClick={() => navigate("/login")}>
                        Login
                    </button>
                )}

                {/* Hamburger for mobile */}
                {isMobile && (
                    <button
                        className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                )}
            </div>


            {/* Mobile Menu */}
            {isMobile && isMobileMenuOpen && (
                <div className="mobile-menu">
                    <Navigation mobile={true} toggleMenu={() => setIsMobileMenuOpen(false)} />
                </div>
            )}
        </header>
    );
}

export default Header;
