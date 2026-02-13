import Loader from "@/components/Loader/Loader";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 🔹 Wait until auth state is fully loaded
    if (loading) {
        return (
            <div className="flex justify-center items-center" style={{ height: "80vh" }}>
                <Loader />
            </div>
        );
    }

    // 🔹 Only redirect if we are sure there is no user
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
