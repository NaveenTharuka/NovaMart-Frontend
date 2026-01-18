import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/user', // base for your login/register
    headers: { 'Content-Type': 'application/json' },
});

export default api;
