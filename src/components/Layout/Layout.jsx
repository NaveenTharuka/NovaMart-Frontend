import { useLocation } from "react-router-dom";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from './Layout.module.css';

function Layout({ children }) {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";
    const isAdminPage = location.pathname === "/userpage";

    const showHeaderFooter = !(isLoginPage || isAdminPage);

    return (
        <div className={styles.wrapper}>
            {showHeaderFooter && <Header />}

            <main className={styles.main}>
                {children}
            </main>

            {showHeaderFooter && <Footer />}
        </div>
    );
}

export default Layout;
