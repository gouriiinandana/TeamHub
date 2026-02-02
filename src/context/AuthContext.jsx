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
        if (currentUser) {
            localStorage.setItem('teamhub_current_user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('teamhub_current_user');
        }
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('teamhub_registered_users', JSON.stringify(registeredUsers));
    }, [registeredUsers]);

    const signup = (userData) => {
        const { name, email, password } = userData;
        const normalizedEmail = email?.toLowerCase();
        const superAdminEmail = 'anu@gksinfotech.com';

        if (registeredUsers.find(u => u.email?.toLowerCase() === normalizedEmail)) {
            throw new Error('User already exists');
        }

        const newUser = {
            uid: Date.now().toString(),
            name,
            email,
            password,
            // Only Anu can be the Admin, everyone else is a Member
            role: normalizedEmail === superAdminEmail ? 'Admin' : 'Member',
            phone: '',
            age: '',
            location: '',
            emailVerified: false,
            phoneVerified: false,
            createdAt: new Date().toISOString()
        };

        setRegisteredUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        return newUser;
    };

    const login = (email, password) => {
        const user = registeredUsers.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        setCurrentUser(user);
        return user;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const resetPassword = (email) => {
        // Simulation for local storage version
        return new Promise((resolve, reject) => {
            const user = registeredUsers.find(u => u.email === email);
            if (user) {
                setTimeout(resolve, 1000);
            } else {
                setTimeout(() => reject(new Error('User not found')), 1000);
            }
        });
    };

    const isAuthenticated = () => {
        return currentUser !== null;
    };

    const updateUserProfile = (profileData) => {
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...profileData };
        setCurrentUser(updatedUser);

        setRegisteredUsers(prev => prev.map(u =>
            u.uid === currentUser.uid ? updatedUser : u
        ));

        return updatedUser;
    };

    const updateSystemRole = (userEmail, role) => {
        const normalizedEmail = userEmail?.toLowerCase();
        const superAdminEmail = 'anu@gksinfotech.com';

        // Block promotion to Admin if email is not Anu
        let finalizedRole = role;
        if (role === 'Admin' && normalizedEmail !== superAdminEmail) {
            finalizedRole = 'Member';
            console.warn(`Attempted to promote ${userEmail} to Admin blocked. Defaulting to Member.`);
        }

        setRegisteredUsers(prev => prev.map(u =>
            u.email?.toLowerCase() === normalizedEmail ? { ...u, role: finalizedRole } : u
        ));

        // If the updated user is the current user, update their session too
        if (currentUser?.email?.toLowerCase() === normalizedEmail) {
            setCurrentUser(prev => ({ ...prev, role: finalizedRole }));
        }
    };

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        isAuthenticated,
        updateUserProfile,
        updateSystemRole,
        loading: false
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
