// src/auth/UseAuth.js
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => useContext(AuthContext);
export default useAuth;
