import api from './api';

const authService = {
    // Sign up new user
    signup: async (userData) => {
        const response = await api.post('/api/auth/signup', userData);
        if (response.data.token) {
            localStorage.setItem('teamhub_token', response.data.token);
            const { token, ...user } = response.data;
            localStorage.setItem('teamhub_current_user', JSON.stringify(user));
        }
        return response.data;
    },

    // Login user
    login: async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('teamhub_token', response.data.token);
            const { token, ...user } = response.data;
            localStorage.setItem('teamhub_current_user', JSON.stringify(user));
        }
        return response.data;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('teamhub_token');
        localStorage.removeItem('teamhub_current_user');
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await api.get('/api/auth/me');
        return response.data;
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const response = await api.put('/api/auth/profile', profileData);
        const user = response.data;
        localStorage.setItem('teamhub_current_user', JSON.stringify(user));
        return user;
    }
};

export default authService;
