import axios from 'axios';
import { BASE_URL } from './axios';

const publicAxios = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
});

export default publicAxios;
