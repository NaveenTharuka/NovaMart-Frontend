// components/Footer.jsx
import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <p className={styles.title}>NovaMart</p>
                <p className={styles.text}>© 2025 Your E-Commerce Store. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;