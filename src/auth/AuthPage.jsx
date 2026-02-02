import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/auth/UseAuth";
import styles from "./AuthPage.module.css";

function AuthPage() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        userName: "",
        address: "",
        phoneNumber: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(""); // clear error only when user types
    };

    const toggleMode = () => {
        setTransitioning(true);
        setTimeout(() => {
            setIsLoginMode(!isLoginMode);
            setError("");
            setFormData({
                email: "",
                password: "",
                userName: "",
                address: "",
                phoneNumber: "",
                confirmPassword: "",
            });
            setTransitioning(false);
        }, 300);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isLoginMode && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        let res;
        if (isLoginMode) {
            res = await login(formData.email, formData.password);
        } else {
            res = await register(
                formData.email,
                formData.password,
                formData.userName,
                formData.address,
                formData.phoneNumber,
                "USER"
            );
        }

        setLoading(false);

        if (res.success) {
            navigate("/");
        } else {
            // show backend error message
            setError(res.error || (isLoginMode ? "Login failed" : "Signup failed"));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>NovaMart</div>

            <div className={`${styles.formCard} ${transitioning ? styles.transitioning : ""}`}>

                {/* Mode Switcher */}
                <div className={styles.modeSwitcher}>
                    <button
                        className={`${styles.modeBtn} ${isLoginMode ? styles.modeBtnActive : styles.modeBtnInactive}`}
                        onClick={() => !isLoginMode && toggleMode()}
                        disabled={transitioning}
                    >
                        Login
                    </button>
                    <button
                        className={`${styles.modeBtn} ${!isLoginMode ? styles.modeBtnActive : styles.modeBtnInactive}`}
                        onClick={() => isLoginMode && toggleMode()}
                        disabled={transitioning}
                    >
                        Sign Up
                    </button>
                    {/* Slider */}
                    <div
                        className={styles.slider}
                        style={{
                            transform: isLoginMode ? "translateX(0)" : "translateX(100%)",
                        }}
                    />
                </div>

                {/* Form Title & Subtitle */}
                <h1 className={styles.headerTitle}>
                    {isLoginMode ? "Welcome Back" : "Join Us"}
                </h1>
                <p className={styles.headerSubtitle}>
                    {isLoginMode
                        ? "Enter your credentials to continue"
                        : "Create your account to get started"}
                </p>

                {/* Error Message */}
                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className={styles.form} onSubmit={handleSubmit}>
                    {!isLoginMode && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Username</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                                className={styles.input}
                            />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={isLoginMode ? "Enter your password" : "Create a password"}
                            required
                            className={styles.input}
                        />
                    </div>

                    {!isLoginMode && (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                    required
                                    className={`${styles.input} ${styles.textarea}`}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    required
                                    className={styles.input}
                                />
                            </div>
                        </>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || transitioning}
                        className={styles.submitBtn}
                    >
                        {loading ? <div className={styles.spinner} /> : (isLoginMode ? "Login" : "Sign Up")}
                    </button>
                </form>

                {/* Mode Toggle Link */}
                <div className={styles.toggleContainer}>
                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                    <button
                        className={styles.toggleBtn}
                        onClick={toggleMode}
                        disabled={transitioning}
                    >
                        {isLoginMode ? "Sign Up" : "Login"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
