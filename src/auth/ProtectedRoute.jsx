import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./UseAuth";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    // If not logged in, redirect to login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Otherwise, render children
    return children;
};

export default ProtectedRoute;
