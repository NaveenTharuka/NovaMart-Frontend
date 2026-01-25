// components/Layout.jsx
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";
    const isAdminPage = location.pathname === "/userpage";

    // Show Header/Footer only if NOT login or admin page
    const showHeaderFooter = !(isLoginPage || isAdminPage);

    return (
        <>
            {showHeaderFooter && <Header />}

            <div className="main-content">
                {children}
            </div>

            {showHeaderFooter && <Footer />}
        </>
    );
}

export default Layout;
