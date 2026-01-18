import { NavLink } from 'react-router-dom';
import './Auth.css'

function Login() {
    return (
        <NavLink to="/login">
            <button className='button2'>Login</button>
        </NavLink>

    )
}

export default Login;

