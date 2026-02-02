import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('teamhub_current_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [registeredUsers, setRegisteredUsers] = useState(() => {
        const saved = localStorage.getItem('teamhub_registered_users');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('teamhub_current_user', JSON.stringify(currentUser));
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('teamhub_registered_users', JSON.stringify(registeredUsers));
    }, [registeredUsers]);

    const signup = (userData) => {
        // userData: { name, email, password }
        const { name, email, password } = userData;

        // Check if user already exists
        const existingUser = registeredUsers.find(u => u.email === email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Validate company email (basic validation - can be customized)
        if (!email.includes('@')) {
            throw new Error('Please enter a valid email address');
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In production, this should be hashed
            phone: '',
            age: '',
            location: '',
            emailVerified: false,
            phoneVerified: false,
            createdAt: new Date().toISOString()
        };

        setRegisteredUsers(prev => [...prev, newUser]);

        // Auto-login after signup
        const { password: _, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);

        return userWithoutPassword;
    };

    const login = (email, password) => {
        const user = registeredUsers.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const { password: _, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);

        return userWithoutPassword;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const isAuthenticated = () => {
        return currentUser !== null;
    };

    const updateUserProfile = (profileData) => {
        // profileData: { phone, age, location, emailVerified, phoneVerified }
        const updatedUser = { ...currentUser, ...profileData };
        setCurrentUser(updatedUser);

        // Update in registered users list
        setRegisteredUsers(prev => prev.map(u =>
            u.id === currentUser.id ? { ...u, ...profileData } : u
        ));

        return updatedUser;
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            signup,
            login,
            logout,
            isAuthenticated,
            updateUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};
