import { useState } from "react";
import styles from './Contact.module.css';

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Thank you for your message!");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Contact Us</h1>

                    <div className={styles.contentGrid}>
                        {/* Contact Form */}
                        <div>
                            <h2 className={styles.sectionTitle}>Send us a Message</h2>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Message</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows="4"
                                        className={styles.textarea}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.button}
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h2 className={styles.sectionTitle}>Contact Information</h2>
                            <div className={styles.infoStack}>
                                <div>
                                    <h3 className={styles.infoHeading}>Address</h3>
                                    <p className={styles.infoText}>123 Shopping Street<br />E-City, EC 12345</p>
                                </div>
                                <div>
                                    <h3 className={styles.infoHeading}>Phone</h3>
                                    <p className={styles.infoText}>+1 (555) 123-4567</p>
                                </div>
                                <div>
                                    <h3 className={styles.infoHeading}>Email</h3>
                                    <p className={styles.infoText}>support@novamart.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
