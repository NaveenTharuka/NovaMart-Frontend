import { NavLink } from 'react-router-dom';
import './Auth.css'
import useAuth from '../auth/UseAuth';

function Login() {
    const { user, login, logout, register } = useAuth();

    if (user) {
        return (
            <button onClick={logout}>Logout</button>
        )
    } if (!user) {
        return (
            <NavLink to="/login">
                <button className='button2'>Login</button>
            </NavLink>

        )
    }


}

export default Login;

