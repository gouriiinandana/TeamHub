import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('teamhub_current_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signup = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const user = await authService.signup(userData);
            const { token, ...userWithoutToken } = user;
            setCurrentUser(userWithoutToken);
            return userWithoutToken;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const user = await authService.login(email, password);
            const { token, ...userWithoutToken } = user;
            setCurrentUser(userWithoutToken);
            return userWithoutToken;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    const isAuthenticated = () => {
        return currentUser !== null;
    };

    const updateUserProfile = async (profileData) => {
        try {
            setLoading(true);
            setError(null);
            const updatedUser = await authService.updateProfile(profileData);
            setCurrentUser(updatedUser);
            return updatedUser;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Profile update failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            signup,
            login,
            logout,
            isAuthenticated,
            updateUserProfile,
            loading,
            error
        }}>
            {children}
        </AuthContext.Provider>
    );
};
