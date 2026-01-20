// components/Layout.jsx
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    return (
        <>
            {!isLoginPage && <Header />}

            <div className="main-content">
                {children}
            </div>

            {!isLoginPage && <Footer />}
        </>
    );
}

export default Layout;