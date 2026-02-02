import { NavLink } from 'react-router-dom';
import useAuth from '@/auth/UseAuth';
import styles from './LoginButton.module.css';

function Login() {
    const { user, logout } = useAuth();

    if (user) {
        return (
            <button
                onClick={logout}
                className={styles.logoutBtn}
            >
                Logout
            </button>
        )
    }

    return (
        <NavLink to="/login">
            <button className={styles.loginBtn}>
                Login
            </button>
        </NavLink>
    )
}

export default Login;
