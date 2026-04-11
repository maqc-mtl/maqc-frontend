import axios from 'axios';
import type { PropertyScoreDTO } from '../types/PropertyScoreDTO';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'apiKey': 'MAQC_SECRET_API_KEY_2026',
    },
});

// Add a request interceptor to include the X-User-Id header
api.interceptors.request.use((config) => {
    try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            if (user && user.id) {
                config.headers['X-User-Id'] = user.id.toString();
            }
        }
    } catch (error) {
        console.error('Error reading user from localStorage:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// Property-related API calls
export const propertyApi = {
    // Increment view count for a property
    incrementViewCount: (propertyId: number) =>
        api.post(`/properties/${propertyId}/view`),

    // Update property recommendation score
    updateScore: (propertyId: number, scores: PropertyScoreDTO) =>
        api.post(`/properties/${propertyId}/score`, scores),
};

export default api;
