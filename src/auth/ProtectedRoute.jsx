import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./UseAuth";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    // 🔒 Not logged in → redirect once
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
