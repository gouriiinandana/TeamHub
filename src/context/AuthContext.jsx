import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Get additional user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setCurrentUser({ ...user, ...userDoc.data() });
                } else {
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (userData) => {
        const { name, email, password } = userData;

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user profile in Firestore
        const userProfile = {
            uid: user.uid,
            name,
            email,
            phone: '',
            age: '',
            location: '',
            emailVerified: false,
            phoneVerified: false,
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);

        setCurrentUser({ ...user, ...userProfile });
        return user;
    };

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get profile data
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        setCurrentUser({ ...user, ...userData });
        return user;
    };

    const logout = () => {
        return signOut(auth);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const isAuthenticated = () => {
        return currentUser !== null;
    };

    const updateUserProfile = async (profileData) => {
        if (!currentUser) return;

        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, profileData);

        const updatedUser = { ...currentUser, ...profileData };
        setCurrentUser(updatedUser);

        return updatedUser;
    };

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        isAuthenticated,
        updateUserProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
