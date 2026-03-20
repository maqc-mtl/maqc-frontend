import axios from 'axios';

const api = axios.create({
    baseURL: 'https://maqc-backend.onrender.com/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'apiKey': 'MAQC_SECRET_API_KEY_2026',
    },
});

export default api;
