import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, currentUser } = useAuth();

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && currentUser?.role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
