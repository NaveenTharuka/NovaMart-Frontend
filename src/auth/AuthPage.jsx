// src/auth/AuthPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./UseAuth";
import "./AuthPage.css";

function AuthPage() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        userName: "", // Changed from 'name' to 'userName'
        address: "",
        phoneNumber: "",
        role: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [transitioning, setTransitioning] = useState(false);
    const { login, register, isTokenInvalid, logout } = useAuth();
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (!storedToken || isTokenInvalid(storedToken)) {
            navigate("/login");
        } else {
            navigate("/");
        }
    }, []);



    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const toggleMode = () => {
        setTransitioning(true);
        setTimeout(() => {
            setIsLoginMode(!isLoginMode);
            setError("");
            // Clear form data when switching modes
            setFormData({
                email: "",
                password: "",
                userName: "",
                address: "",
                phoneNumber: "",
                role: "",
                confirmPassword: ""
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
            console.log("Sending registration data:", {
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                role: "USER"
            });

            res = await register(
                formData.email,
                formData.password,
                formData.userName,
                formData.address,
                formData.phoneNumber,
                "USER" // Changed to match your form's role
            );
        }

        setLoading(false);

        if (res.success) {
            navigate("/");
        } else {
            setError(res.error || (isLoginMode ? "Login failed" : "Signup failed"));
        }
    };

    return (
        <div className="item-container">
            <div>
                <div className="auth-logo">NovaMart</div>
            </div>

            <div className="auth-container">
                <div className={`auth-form-container ${transitioning ? 'transitioning' : ''} ${isLoginMode ? 'login-mode' : 'signup-mode'}`}>

                    {/* Mode Switcher */}
                    <div className="mode-switcher">
                        <button
                            className={`mode-btn ${isLoginMode ? 'active' : ''}`}
                            onClick={() => !isLoginMode && toggleMode()}
                            disabled={transitioning}
                        >
                            Login
                        </button>
                        <button
                            className={`mode-btn ${!isLoginMode ? 'active' : ''}`}
                            onClick={() => isLoginMode && toggleMode()}
                            disabled={transitioning}
                        >
                            Sign Up
                        </button>
                        <div className="mode-slider" style={{ transform: isLoginMode ? 'translateX(0)' : 'translateX(100%)' }} />
                    </div>

                    {/* Form Title */}
                    <h1 className="auth-title">
                        {isLoginMode ? 'Welcome Back' : 'Join Us'}
                    </h1>
                    <p className="auth-subtitle">
                        {isLoginMode ? 'Enter your credentials to continue' : 'Create your account to get started'}
                    </p>

                    {/* Error Message */}
                    {error && <div className="error-message">❌ {error}</div>}

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* UserName Field (Only for Signup) */}
                        <div className={`form-group name-field ${isLoginMode ? 'hidden' : ''}`}>
                            <label>Username</label> {/* Changed label */}
                            <input
                                type="text"
                                name="userName" // Changed from 'name' to 'userName'
                                value={formData.userName}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required={!isLoginMode}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={isLoginMode ? "Enter your password" : "Create a password"}
                                required
                            />
                        </div>

                        {/* Confirm Password Field (Only for Signup) */}
                        <div className={`form-group confirm-password-field ${isLoginMode ? 'hidden' : ''}`}>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required={!isLoginMode}
                            />
                        </div>

                        <div className={`form-group ${isLoginMode ? 'hidden' : ''}`}>
                            <label>Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                required={!isLoginMode}
                            />
                        </div>

                        <div className={`form-group ${isLoginMode ? 'hidden' : ''}`}>
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required={!isLoginMode}
                            />
                        </div>

                        {/* Submit Button */}
                        <button type="submit" disabled={loading || transitioning}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    {isLoginMode ? 'Logging in...' : 'Creating account...'}
                                </>
                            ) : (
                                isLoginMode ? 'Login' : 'Sign Up'
                            )}
                        </button>
                    </form>

                    {/* Mode Toggle Link */}
                    <div className="mode-toggle">
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                        <button className="toggle-link" onClick={toggleMode} disabled={transitioning}>
                            {isLoginMode ? 'Sign Up' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;