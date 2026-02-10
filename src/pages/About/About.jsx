import styles from './About.module.css';

function About() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>About NovaMart</h1>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            Welcome to NovaMart! We're passionate about bringing you the best products
                            from around the world at unbeatable prices.
                        </p>
                        <p className={styles.paragraph}>
                            Founded with the vision to make online shopping seamless and enjoyable,
                            we carefully curate our collection to ensure quality and value.
                        </p>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>1000+</div>
                            <div className={styles.statLabel}>Products</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>24/7</div>
                            <div className={styles.statLabel}>Support</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>Fast</div>
                            <div className={styles.statLabel}>Shipping</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
